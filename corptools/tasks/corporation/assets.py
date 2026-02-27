# Standard Library
import re
from typing import Union

# Third Party
from aiopenapi3 import HTTPError
from celery import chain, shared_task
from eve_sde.models import ItemType

# Django
from django.db.models import F, Q
from django.db.models.aggregates import Sum

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

# AA Example App
from corptools.models import (
    AssetCoordiante,
    BridgeOzoneLevel,
    CorpAsset,
    CorporationAudit,
    EveLocation,
    Structure,
)
from corptools.task_helpers.update_tasks import fetch_location_name

from .. import providers
from ..utils import chunks
from .utils import get_corp_token, update_corp_audit

logger = get_extension_logger(__name__)


@update_corp_audit(update_field="last_update_assets")
def corp_update_assets(corp_id, force_refresh: bool = False):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Assets for: {}".format(
        audit_corp.corporation))

    req_scopes = [
        'esi-assets.read_corporation_assets.v1',
        'esi-characters.read_corporation_roles.v1'
    ]

    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    failed_locations = []

    assets = providers.esi_openapi.client.Assets.GetCorporationsCorporationIdAssets(
        corporation_id=corp_id,
        token=token
    ).results(
        force_refresh=force_refresh
    )

    location_names = list(
        EveLocation.objects.all().values_list('location_id', flat=True)
    )

    _current_type_ids = []
    item_ids = []
    items = []

    for item in assets:
        if item.type_id not in _current_type_ids:
            _current_type_ids.append(item.type_id)
        item_ids.append(item.item_id)

        asset_item = CorpAsset.from_esi_model(audit_corp, item)

        if item.location_id not in location_names:
            try:
                if item.location_id not in failed_locations:
                    new_name = fetch_location_name(
                        item.location_id,
                        item.location_flag,
                        token.character_id
                    )
                    if new_name:
                        new_name.save()
                        location_names.append(
                            item.location_id
                        )
                        asset_item.location_name_id = item.location_id
                    else:
                        failed_locations.append(item.location_id)
            except Exception:
                pass  # TODO
        else:
            asset_item.location_name_id = item.location_id

        items.append(asset_item)

    delete_query = CorpAsset.objects.filter(
        corporation=audit_corp)  # Flush Assets
    if delete_query.exists():
        # with coords we need to care about the fkeys/signals
        delete_query.delete()

    CorpAsset.objects.bulk_create(items)
    try:
        corp_update_asset_names(corp_id)
    except Exception as e:
        logger.error(e)

    que = []
    que.append(fetch_coordiantes.si(corp_id, force_refresh=force_refresh))
    que.append(run_ozone_levels.si(corp_id))
    que.append(build_managed_asset_locations.si(
        corp_id, force_refresh=force_refresh))
    chain(que).apply_async(priority=7)

    return f"Finished assets for: {audit_corp.corporation}"


@shared_task(bind=True)
def build_managed_asset_locations(self, corp_id, force_refresh: bool = True):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Corporate Hangar Locations for: %s" %
                 (_corporation.corporation))

    req_scopes = ['esi-corporations.read_divisions.v1',
                  'esi-characters.read_corporation_roles.v1']
    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    divisions = {}
    if token:
        divs = providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdDivisions(
            corporation_id=_corporation.corporation.corporation_id,
            token=token
        ).result(
            force_refresh=force_refresh,
            use_etag=False
        )
        for d in divs.hangar:
            divisions[f"CorpSAG{d.division}"] = d.name

    existing_locations = set(list(EveLocation.objects.filter(
        managed=True, managed_corp=_corporation).values_list("location_id", flat=True)))
    current = []
    new = []
    updates = []
    # get office folders and name them
    folders = CorpAsset.objects.filter(
        corporation=_corporation,
        location_flag="OfficeFolder"
    ).select_related("location_name")

    names = {}

    grp_ids = [
        12,
        340,
        448,
        649,
    ]

    cat_ids = [
        6
    ]

    corp_hangars = {}
    hangar_ids = []
    for i in folders:
        system = None
        if i.location_name:
            names[i.item_id] = i.location_name.location_name
            system = i.location_name.system
        else:
            names[i.item_id] = i.location_id
        corp_hangars[i.item_id] = {}
        for j in range(1, 8):

            # Build the Managed Location for hangars
            id = -int(f"{i.item_id}{j}")
            sag = f"CorpSAG{j}"
            name = f"{names[i.item_id]} > {divisions.get(sag, sag)}"
            hangar_ids.append(id)

            # store for later?
            corp_hangars[i.item_id][sag] = (id, name)

            # update or create the location
            EveLocation.objects.update_or_create(
                location_id=id,
                defaults={
                    "location_name": name,
                    "managed": True,
                    "managed_corp": _corporation,
                    "system": system
                }
            )

            # update all the assets.
            CorpAsset.objects.filter(
                corporation=_corporation,
                location_id=i.item_id,
                location_flag=sag
            ).update(location_name_id=id)
    # get Containers in office folders and assign the names

    containers = CorpAsset.objects.filter(
        Q(type_name__group_id__in=grp_ids) | Q(
            type_name__group__category_id__in=cat_ids)
    ).filter(
        corporation=_corporation,
        singleton=True,
        location_id__in=folders.values_list(
            "item_id", flat=True),
    ).select_related("location_name", "type_name")

    req_scopes = ['esi-assets.read_corporation_assets.v1',
                  'esi-characters.read_corporation_roles.v1']

    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)
    if token:
        ids = list(set(list(containers.values_list("item_id", flat=True))))
        for c in chunks(ids, 900):
            items = providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsNames(
                body=c,
                corporation_id=_corporation.corporation.corporation_id,
                token=token
            ).result(
                force_refresh=force_refresh
            )
            for n in items:
                names[n.item_id] = n.name

    # each container gets a location name Station > Hangar > Type
    for c in containers:
        current.append(c.item_id)
        name = names.get(c.item_id, c.type_name.name)
        hangar = divisions.get(c.location_flag, c.location_flag)
        station = names.get(c.location_id, c.location_id)
        item_loc = f"{station} > {hangar} > {name}"
        loc = EveLocation(
            location_id=c.item_id,
            location_name=item_loc,
            managed=True,
            managed_corp=_corporation
        )
        if c.item_id in existing_locations:
            updates.append(loc)
        else:
            new.append(loc)

    if len(new):
        EveLocation.objects.bulk_create(new)

    if len(updates):
        EveLocation.objects.bulk_update(
            updates, ["location_name", "managed", "managed_corp"])

    EveLocation.objects.filter(managed=True, managed_corp=_corporation).exclude(
        location_id__in=current + hangar_ids).delete()

    CorpAsset.objects.filter(location_id__in=current).update(
        location_name_id=F("location_id"))


@shared_task(bind=True, base=QueueOnce)
def fetch_coordiantes(self, corp_id, force_refresh: bool = False):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id
    )

    logger.info(
        f"CT: Starting Coords for {_corporation.corporation.corporation_name}")

    catagories = [
        23,  # Starbases
        65,  # Structures
        40,  # Sov
        22,  # Deployables
    ]

    # These must be in space
    max_location_id = 35000000
    min_location_id = 30000000

    assets = CorpAsset.objects.filter(
        corporation=_corporation,
        type_name__group__category_id__in=catagories,
        location_id__gte=min_location_id,
        location_id__lte=max_location_id
    )

    logger.info(f"CT: COORDS {assets.count()} Assets found.")

    _req_scopes = ['esi-assets.read_corporation_assets.v1']
    _req_roles = ['Director']
    _token = get_corp_token(
        _corporation.corporation.corporation_id,
        _req_scopes,
        _req_roles
    )

    if not _token or not assets.count():
        logger.info(
            f"CT: COORDS No Tokens or Assets for {_corporation.corporation.corporation_name}")
        return f"CT: COORDS No Tokens or Assets for {_corporation.corporation.corporation_name}"

    _all_ids = assets.values_list("item_id", flat=True)
    locations = []

    locations = []

    for id_chunk in providers.esi_openapi.chunk_ids(_all_ids):
        locations += providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsLocations(
            corporation_id=_corporation.corporation.corporation_id,
            body=id_chunk,
            token=_token
        ).result(
            force_refresh=force_refresh
        )

    logger.info(locations)

    new_coords = {}
    for loc in locations:
        new_coords[loc.item_id] = loc.position

    new_models = []
    for a in assets:
        if a.item_id in new_coords:
            new_models.append(
                AssetCoordiante(
                    item=a,
                    x=new_coords[a.item_id].x,
                    y=new_coords[a.item_id].y,
                    z=new_coords[a.item_id].z
                )
            )
            logger.info(
                f"CT: COORD - {a.type_name.name} {new_coords[a.item_id]}")

    AssetCoordiante.objects.bulk_create(new_models, ignore_conflicts=True)

    return f"CT: Finished Coords for {_corporation.corporation.corporation_name}"


def corp_update_asset_names(corp_id, force_refresh: bool = False):
    """
        Uses PostCorporationCorporationIdAssetsNames
    """

    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Assets for: {}".format(
        audit_corp.corporation))

    req_scopes = ['esi-assets.read_corporation_assets.v1',
                  'esi-characters.read_corporation_roles.v1']
    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    expandable_cats = [2, 6, 65]

    asset_list = CorpAsset.objects.filter(
        corporation=audit_corp,
        type_name__group__category_id__in=expandable_cats,
        singleton=True
    ).order_by("pk")

    for subset in chunks(asset_list, 900):
        assets_names = providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsNames(
            corporation_id=corp_id,
            body=list(set([i.item_id for i in subset])),
            token=token
        ).results(
            force_refresh=force_refresh
        )

        id_list = {i.item_id: i.name for i in assets_names}

        for asset in subset:
            if asset.item_id in id_list:
                asset.name = id_list.get(asset.item_id)
                asset.save()

    return f"CT: Finished corp asset names for: {audit_corp.corporation}"


@shared_task(bind=True, base=QueueOnce)
def run_ozone_levels(self, corp_id):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id
    )
    logger.debug("Updating Ozone for: %s" % (_corporation.corporation))

    _structures = Structure.objects.filter(
        type_id=35841,
        corporation=_corporation
    )

    for structure in _structures:
        _quantity = CorpAsset.objects.filter(
            corporation=_corporation,
            location_id=structure.structure_id,
            type_id=16273
        ).aggregate(
            ozone=Sum('quantity')
        )['ozone']
        _used = 0

        try:
            last_ozone = BridgeOzoneLevel.objects.filter(
                station_id=structure.structure_id
            ).order_by('-date')[:1][0].quantity
            delta = last_ozone - _quantity
            _used = (delta if _quantity < last_ozone else 0)
        except Exception:
            pass
        try:
            BridgeOzoneLevel.objects.create(
                station_id=structure.structure_id, quantity=_quantity, used=_used)
        except Exception:
            pass  # dont fail for now
    return f"Finished Ozone for: {_corporation.corporation}"
