# Third Party
import requests
from celery import shared_task
from eve_sde.models import ItemType, Moon, Planet, SolarSystem

# Django
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.db.models import F
from django.db.models.functions import Power, Sqrt

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce
from esi.exceptions import HTTPNotModified

# AA Example App
from corptools.models import (
    CorporationAudit,
    EveLocation,
    Poco,
    Starbase,
    Structure,
    StructureCelestial,
    StructureService,
)
from corptools.models.eve_models import MapJumpBridge
from corptools.task_helpers.update_tasks import fetch_location_name

from .. import providers
from .utils import get_corp_token, update_corp_audit

logger = get_extension_logger(__name__)


@update_corp_audit(update_field="last_update_structures")
def corp_structure_update(corp_id, force_refresh=False):  # pagnated results
    # logger.debug("Started structures for: %s" % (str(character_id)))

    def _structures_db_update(_corporation, _structure, _name):
        str_type, _ = ItemType.objects.get_or_create_from_esi(
            _structure.type_id
        )

        _structure_ob, _created = Structure.objects.update_or_create(
            structure_id=_structure.structure_id,
            corporation=_corporation,
            defaults={
                'fuel_expires': _structure.fuel_expires,
                'next_reinforce_apply': _structure.next_reinforce_apply,
                # 'next_reinforce_weekday': _structure.next_reinforce_weekday,
                'profile_id': _structure.profile_id,
                'reinforce_hour': _structure.reinforce_hour,
                # 'reinforce_weekday': _structure.reinforce_weekday,
                'state': _structure.state,
                'state_timer_end': _structure.state_timer_end,
                'state_timer_start': _structure.state_timer_start,
                'system_id': _structure.system_id,
                'type_id': _structure.type_id,
                'unanchors_at': _structure.unanchors_at,
                'name': _name,
                'system_name_id': _structure.system_id,
                'type_name': str_type
            }
        )

        if _structure_ob:
            # _asset = None
            _location = None
            celestial = StructureCelestial.objects.filter(
                structure_id=_structure.structure_id
            )

            if not celestial.exists():
                try:
                    # _asset = CorpAsset.objects.get(
                    #     item_id=_structure.get('structure_id'), corp=_corporation)
                    _req_scopes = ['esi-assets.read_corporation_assets.v1']
                    _req_roles = ['Director']
                    _token = get_corp_token(
                        _corporation.corporation.corporation_id, _req_scopes, _req_roles)
                    if _token:
                        locations = providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsLocations(
                            corporation_id=_corporation.corporation.corporation_id,
                            item_ids=[_structure.structure_id],
                            token=token
                        ).result()

                        _location = locations[0]

                        url = "https://www.fuzzwork.co.uk/api/nearestCelestial.php?x=%s&y=%s&z=%s&solarsystemid=%s" % (
                            (str(_location.position.x)),
                            (str(_location.position.y)),
                            (str(_location.position.z)),
                            (str(_structure.system_id))
                        )

                        r = requests.get(url)
                        fuzz_result = r.json()

                        celestial = StructureCelestial.objects.create(
                            structure_id=_structure.structure_id,
                            celestial_name=fuzz_result.get('itemName')
                        )
                except ObjectDoesNotExist:
                    celestial = None
                except Exception:
                    # logging.exception("Messsage")
                    celestial = None
            else:
                celestial = celestial[0]

            # TODO fix this all up.
            if isinstance(celestial, StructureCelestial):
                if celestial is not None:
                    _structure_ob.closest_celestial = celestial
                    _structure_ob.save()
            else:
                celestial = None

            if _structure.services:
                db_services = StructureService.objects.filter(
                    structure=_structure_ob)
                current_services = []
                for service in _structure.services:
                    db_service = db_services.filter(name=service.name)
                    if db_service.exists():
                        if db_service.count() == 1:
                            if db_service[0].state == service.state:
                                current_services.append(db_service[0].id)
                                pass
                            else:
                                db_service.update(state=service.state)
                                current_services.append(db_service[0].id)
                        else:
                            StructureService.objects.filter(
                                structure=_structure_ob,
                                name=service.name
                            ).delete()
                            new_service = StructureService.objects.create(
                                structure=_structure_ob,
                                state=service.state,
                                name=service.name
                            )
                            current_services.append(new_service.id)

                    else:
                        new_service = StructureService.objects.create(
                            structure=_structure_ob,
                            state=service.state,
                            name=service.name
                        )
                        current_services.append(new_service.id)
                db_services.exclude(id__in=current_services).delete()

        return _structure_ob, _created

    req_scopes = [
        'esi-corporations.read_structures.v1',
        'esi-universe.read_structures.v1',
        'esi-characters.read_corporation_roles.v1'
    ]

    req_roles = ['Director', 'Station_Manager']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    structure_ids = []
    structures = providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdStructures(
        corporation_id=_corporation.corporation.corporation_id,
        token=token
    ).results(
        force_refresh=force_refresh
    )

    for structure in structures:
        name = str(structure.structure_id)
        if structure.name:
            name = structure.name
            EveLocation.objects.update_or_create(
                location_id=structure.structure_id,
                defaults={
                    "location_name": structure.name,
                    "system_id": structure.system_id,
                }
            )
        else:
            try:
                structure_info = fetch_location_name(
                    structure.structure_id,
                    'solar_system',
                    token.character_id
                )
            except Exception:
                structure_info = False
            if structure_info:
                structure_info.save()
                name = structure_info.location_name

        try:
            structure_ob, created = _structures_db_update(
                _corporation,
                structure,
                name
            )

        except MultipleObjectsReturned:
            id_of_first = Structure.objects.filter(
                structure_id=structure.structure_id
            ).order_by("id")[0].id
            Structure.objects.filter(
                structure_id=structure.structure_id).exclude(id=id_of_first).delete()
            structure_ob, created = _structures_db_update(
                _corporation,
                structure,
                name
            )

        structure_ids.append(structure_ob.structure_id)

    Structure.objects.filter(corporation=_corporation).exclude(
        structure_id__in=structure_ids).delete()  # structures die/leave

    return f"Updated structures for: {_corporation}"


# TODO Fuel
# Small: 10 blocks / hour, 7200 / 30 days
# Medium: 20 blocks / hour, 14400 / 30 days
# Large: 40 blocks / hour, 28800 / 30 days
# 25% for sov
# Faction towers use less (10% less for tier 1, 20% less for tier 2).
# how is tier calculated?
# TODO Stront
# Small: 100/hr, 4166 max units for 41.7 hours
# Medium: 200/hr, 8333 max units for 41.7 hours
# Large: 400/hr, 16666 max units for 41.7 hours

@update_corp_audit(update_field="last_update_starbases")
def corp_starbase_update(corp_id, force_refresh=True):  # Set true as we have bad data
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    logger.info(
        f"CT: Starting Starbases for {_corporation.corporation.corporation_name}")

    _req_scopes = ['esi-corporations.read_starbases.v1']
    _req_roles = ['Director']
    _token = get_corp_token(
        _corporation.corporation.corporation_id,
        _req_scopes,
        _req_roles
    )
    if not _token:
        logger.info(
            f"CT: No Tokens for Starbases for {_corporation.corporation.corporation_name}")
        return f"CT: No Tokens for Starbases for {_corporation.corporation.corporation_name}"

    starbases = providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdStarbases(
        corporation_id=_corporation.corporation.corporation_id,
        token=_token
    ).results(
        force_refresh=force_refresh
    )

    if not len(starbases):
        # Remove them all!
        Starbase.objects.filter(
            corporation=_corporation,
        ).delete()
        return f"CT: Completed Starbases for {_corporation.corporation.corporation_name}. No Starbases found."

    ids = []
    for sb in starbases:
        ids.append(sb.starbase_id)

    starbase_names = {}

    _req_scopes_assets = ['esi-assets.read_corporation_assets.v1']
    _req_roles_assets = ['Director']
    _token_assets = get_corp_token(
        _corporation.corporation.corporation_id,
        _req_scopes_assets,
        _req_roles_assets
    )

    if _token_assets:
        names = providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsNames(
            corporation_id=_corporation.corporation.corporation_id,
            body=ids,
            token=_token_assets
        ).result(
            use_etag=False,
            force_refresh=force_refresh
        )
        for nm in names:
            starbase_names[nm.item_id] = nm.name

    for sb in starbases:
        try:
            starbase = providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdStarbasesStarbaseId(
                corporation_id=_corporation.corporation.corporation_id,
                starbase_id=sb.starbase_id,
                system_id=sb.system_id,
                token=_token
            ).result(
                force_refresh=force_refresh
            )
        except HTTPNotModified:
            continue

        update_fields = {}

        if sb.moon_id:
            moon, _created = Moon.objects.get_or_create_from_esi(
                sb.moon_id)
            update_fields["moon"] = moon

        eve_type, _created = ItemType.objects.get_or_create_from_esi(
            sb.type_id)

        Starbase.objects.update_or_create(
            starbase_id=sb.starbase_id,
            corporation=_corporation,
            defaults={
                "name": starbase_names.get(sb.starbase_id),
                "onlined_since": sb.onlined_since,
                "reinforced_until": sb.reinforced_until,
                "unanchor_at": sb.unanchor_at,
                "state": sb.state,
                "system_id": sb.system_id,
                "type_name": eve_type,
                "allow_alliance_members": starbase.allow_alliance_members,
                "allow_corporation_members": starbase.allow_corporation_members,
                "anchor": starbase.anchor,
                "attack_if_at_war": starbase.attack_if_at_war,
                "attack_if_other_security_status_dropping": starbase.attack_if_other_security_status_dropping,
                "attack_security_status_threshold": starbase.attack_security_status_threshold,
                "attack_standing_threshold": starbase.attack_standing_threshold,
                "fuel_bay_take": starbase.fuel_bay_take,
                "fuel_bay_view": starbase.fuel_bay_view,
                "offline": starbase.offline,
                "online": starbase.online,
                "unanchor": starbase.unanchor,
                "use_alliance_standings": starbase.use_alliance_standings,
                "fuels": starbase.fuels,
                **update_fields
            }
        )

    Starbase.objects.filter(
        corporation=_corporation,
    ).exclude(
        starbase_id__in=ids
    ).delete()

    return f"CT: Completed Starbases for {_corporation.corporation.corporation_name}"


@update_corp_audit(update_field="last_update_pocos")
def corp_update_pocos(corp_id, full_update=False):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    logger.debug(
        "Updating Pocos for: {}".format(
            audit_corp.corporation.corporation_name
        )
    )

    req_scopes = ['esi-planets.read_customs_offices.v1']

    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    poco_data = providers.esi_openapi.client.Planetary_Interaction.GetCorporationsCorporationIdCustomsOffices(
        corporation_id=audit_corp.corporation.corporation_id,
        token=token
    ).results(
        force_refresh=full_update
    )

    # Get all Poco Names ( planet name here )
    _all_ids = [p.office_id for p in poco_data]

    # Ensure all planets are in DB
    _all_system_ids = [p.system_id for p in poco_data]

    _pids = []
    for system_id in _all_system_ids:
        _s = providers.esi_openapi.client.Universe.GetUniverseSystemsSystemId(
            system_id=system_id
        ).result()
        _pids += [
            _p.planet_id for _p in _s.planets
        ]

    for _p in _pids:
        _, _ = Planet.objects.get_or_create_from_esi(_p)

    token_assets = get_corp_token(
        corp_id, ['esi-assets.read_corporation_assets.v1'], req_roles)

    _all_locations = []

    for id_chunk in providers.esi_openapi.chunk_ids(_all_ids):
        _all_locations += providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsLocations(
            corporation_id=corp_id,
            item_ids=id_chunk,
            token=token_assets
        ).result()

    _office_to_names = {}

    for n in _all_locations:
        nearest = Planet.objects.all(
        ).annotate(
            distance=Sqrt(
                Power(
                    n.position.x - F("x"),
                    2
                ) + Power(
                    n.position.y - F("y"),
                    2
                ) + Power(
                    n.position.z - F("z"),
                    2
                )
            )
        ).order_by(
            "distance"
        ).first()
        _office_to_names[n['item_id']] = nearest

    for poco in poco_data:
        Poco.objects.update_or_create(
            office_id=poco.office_id,
            corporation=audit_corp,
            defaults={
                "alliance_tax_rate": poco.alliance_tax_rate,
                "allow_access_with_standings": poco.allow_access_with_standings,
                "allow_alliance_access": poco.allow_alliance_access,
                "bad_standing_tax_rate": poco.bad_standing_tax_rate,
                "corporation_tax_rate": poco.corporation_tax_rate,
                "excellent_standing_tax_rate": poco.excellent_standing_tax_rate,
                "good_standing_tax_rate": poco.good_standing_tax_rate,
                "neutral_standing_tax_rate": poco.neutral_standing_tax_rate,
                "office_id": poco.office_id,
                "reinforce_exit_end": poco.reinforce_exit_end,
                "reinforce_exit_start": poco.reinforce_exit_start,
                "standing_level": poco.standing_level,
                "system_id": poco.system_id,
                "system_name_id": poco.system_id,
                "name": _office_to_names.get(poco.office_id).name,
                "planet_id": _office_to_names.get(poco.office_id).planet_id,
                "terrible_standing_tax_rate": poco.terrible_standing_tax_rate
            }
        )
    logger.info(
        f"{audit_corp.corporation.corporation_name}: Created {len(poco_data)} Pocos")

    d = Poco.objects.filter(corporation=audit_corp).exclude(
        office_id__in=_all_ids
    ).delete()

    logger.info(
        f"{audit_corp.corporation.corporation_name}: Deleted {d} Pocos")

    return f"CT: Finished Pocos for: {audit_corp.corporation.corporation_name}"


@shared_task(bind=True, base=QueueOnce)
def build_jb_network(self):
    structures = Structure.objects.filter(type_id=35841).select_related(
        "corporation__corporation",
        "system_name"
    ).prefetch_related('structureservice_set')

    # second_systems = set()
    output = {}
    regex = r"^(.*) » ([^ - ]*) - (.*)"
    for s in structures:
        matches = re.findall(regex, s.name)
        matches = matches[0]
        output[matches[0]] = {}
        output[matches[0]]["start"] = {
            "system": s.system_name,
            "structure_id": s.structure_id,
            "owner": s.corporation.corporation.alliance.alliance_id,
            "name": s.name
        }
        _exit = SolarSystem.objects.get(name=matches[1])
        output[matches[0]]["end"] = {
            "system": _exit,
            "name": _exit.name
        }

    new_jbs = []
    for k, m in output.items():
        new_jbs.append(
            MapJumpBridge(
                structure_id=m["start"]["structure_id"],
                from_solar_system=m["start"]["system"],
                to_solar_system=m["end"]["system"],
                owner_id=m["start"]["owner"]
            )
        )

    MapJumpBridge.objects.filter(manually_input=False).delete()
    MapJumpBridge.objects.bulk_create(new_jbs)

    return f"Created {len(new_jbs)} new JB links"
