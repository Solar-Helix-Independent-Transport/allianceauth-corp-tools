import logging
from typing import List

from ninja import NinjaAPI

from django.db.models import F, Q, Sum
from django.db.models.functions import Length

from allianceauth.services.hooks import get_extension_logger

from corptools import models
from corptools.api import schema

logger = get_extension_logger(__name__)


class AssetsApiEndpoints:

    tags = ["Assets"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corporation/{corporation_id}/asset/locations",
            response={200: List[schema.ValueLabel], 403: schema.Message},
            tags=self.tags
        )
        def get_corporation_asset_locations(request, corporation_id: int, top_level_only: bool = True):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_assets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view wallets!")
                return 403, "Permission Denied!"

            asset_locs = models.CorpAsset.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id,
                location_name__isnull=False).values_list('location_name').distinct()
            asset_locs = models.EveLocation.objects.filter(
                location_id__in=asset_locs,
            ).order_by('location_name')
            if top_level_only:
                asset_locs = asset_locs.filter(managed=False)
            asset_locations = [{"label": "Everywhere", "value": 0},
                               {"label": "AssetSafety", "value": 2004}, ]
            for loc in asset_locs:
                asset_locations.append({
                    "label": loc.location_name,
                    "value": loc.location_id
                })

            return asset_locations

        @api.get(
            "corporation/{corporation_id}/asset/{location_id}/list",
            response={200: List[schema.AssetItem],
                      403: schema.Message},
            tags=self.tags
        )
        def get_corporation_asset_list(request, corporation_id: int, location_id: int, new_asset_tree: bool = False):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_assets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view wallets!")
                return 403, "Permission Denied!"

            expandable_cats = [2, 6, 29, 65]

            if new_asset_tree:
                if corporation_id == 0:
                    corporation_id = request.user.profile.main_character.corporation_id

                assets = models.CorpAsset.get_visible(request.user).filter(
                    corporation__corporation__corporation_id=corporation_id).select_related(
                    "type_name",
                    "location_name",
                    "location_name__system",
                    "location_name__system__constellation",
                    "location_name__system__constellation__region",
                    "type_name__group__category"
                )

                asset_locations = []
                if location_id == 2004:
                    asset_locations = assets.filter(
                        location_flag="AssetSafety")
                    assets = assets.filter(
                        location_id__in=asset_locations.values_list('item_id'))
                elif location_id != 0:
                    asset_locations = assets.filter(
                        location_name_id=int(location_id))
                    assets = assets.filter(Q(location_name_id=int(location_id)) | Q(
                        location_id__in=asset_locations.values_list('item_id')) | Q(location_id=int(location_id)))
                else:
                    asset_locations = assets.filter(
                        location_name__isnull=False)

                output = []
                location_names = {}

                for a in assets:
                    type_nm = a.type_name.name
                    if a.name:
                        type_nm = f"{a.type_name.name} ({a.name})"
                    loc = {
                        "id": a.location_id,
                        "name": f"{a.location_id} ({a.location_flag})"
                    }
                    if a.location_name:
                        loc["name"] = a.location_name.location_name
                        if a.location_name.system:
                            loc["solar_system"] = {
                                "system": {
                                    "id": a.location_name.system.system_id,
                                    "name": a.location_name.system.name
                                },
                                "constellation": {
                                    "id": a.location_name.system.constellation.constellation_id,
                                    "name": a.location_name.system.constellation.name
                                },
                                "region": {
                                    "id": a.location_name.system.constellation.region.region_id,
                                    "name": a.location_name.system.constellation.region.name
                                },
                                "security_status": a.location_name.system.security_status
                            }
                    output.append({
                        "item": {
                            "id": a.type_name.type_id,
                            "name": type_nm,
                            "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}",
                            "cat_id": a.type_name.group.category.category_id
                        },
                        "quantity": a.quantity,
                        "id": a.item_id,
                        "expand": True if a.type_name.group.category.category_id in expandable_cats else False,
                        "location": loc
                    })

                return output

            everywhere_flags = ["CorpSAG1", "CorpSAG2", "CorpSAG3", "CorpSAG4",
                                "CorpSAG5", "CorpSAG6", "CorpSAG7", "CorpDeliveries", "AssetSafety"]

            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            assets = models.CorpAsset.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id).select_related(
                "type_name", "location_name", "type_name__group__category"
            )

            asset_locations = []
            if location_id == 2004:
                asset_locations = assets.filter(
                    location_flag="AssetSafety")
                assets = assets.filter(
                    location_id__in=asset_locations.values_list('item_id'))
            elif location_id != 0:
                asset_locations = assets.filter(
                    location_name_id=int(location_id))
                assets = assets.filter(Q(location_name_id=int(location_id)) | Q(
                    location_id__in=asset_locations.values_list('item_id')) | Q(location_id=int(location_id)))
            else:
                asset_locations = assets.filter(
                    location_name__isnull=False)
                assets = assets.filter(location_flag__in=everywhere_flags)

            output = []
            location_names = {}
            for lo in asset_locations:
                if lo.location_name:
                    location_names[lo.item_id] = lo.location_name.location_name

            for a in assets:
                loc = a.location_flag
                if a.location_id in location_names:
                    loc = f"{location_names[a.location_id]} ({a.location_flag})"

                output.append({
                    "item": {
                        "id": a.type_name.type_id,
                        "name": a.type_name.name,
                        "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}"
                    },
                    "quantity": a.quantity,
                    "id": a.item_id,
                    "expand": True if a.type_name.group.category.category_id in expandable_cats else False,
                    "location": {
                        "id": a.location_id,
                        "name": loc
                    }
                })

            return output

        @api.get(
            "corporation/asset/{item_id}/contents",
            response={200: List[schema.AssetItem],
                      403: schema.Message},
            tags=self.tags
        )
        def get_corporation_asset_contents(request, item_id: int):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_assets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view Assets!")
                return 403, "Permission Denied!"

            assets = models.CorpAsset.get_visible(
                request.user
            ).select_related(
                "type_name",
                "location_name",
                "type_name__group__category"
            )

            assets = assets.filter(location_id=item_id)

            output = []

            for a in assets:
                output.append({
                    "item": {
                        "id": a.type_name.type_id,
                        "name": a.type_name.name,
                        "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}"
                    },
                    "quantity": a.quantity,
                    "id": a.item_id,
                    "expand": False,
                    "location": {
                        "id": item_id,
                        "name": a.location_flag
                    }
                })

            return output

        @api.get(
            "corporation/{corporation_id}/asset/{location_id}/groups",
            response={200: List[schema.CharacterAssetGroups],
                      403: schema.Message},
            tags=self.tags
        )
        def get_corporation_asset_groups(request, corporation_id: int, location_id: int):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_assets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view wallets!")
                return 403, "Permission Denied!"

            capital_groups = [30, 547, 659, 1538, 485, 902, 513, 883, 77283]
            subcap_cat = [6]
            noteable_cats = [4, 20, 23, 25, 34, 35, 87, 91]
            structure_cats = [22, 24, 40, 41, 46, 65, 66, ]
            bpo_cats = [9]

            assets = models.CorpAsset.get_visible(request.user)\
                .filter((Q(blueprint_copy=None) | Q(blueprint_copy=False)),
                        corporation__corporation__corporation_id=corporation_id)

            if location_id == 2004:
                asset_locations = assets.filter(
                    location_flag="AssetSafety").values_list('item_id')
                assets = assets.filter(location_id__in=asset_locations)
            elif location_id != 0:
                asset_locations = assets.filter(
                    location_name_id=int(location_id)).values_list('item_id')
                assets = assets.filter(Q(location_name_id=int(location_id)) | Q(
                    location_id__in=asset_locations) | Q(location_id=int(location_id)))

            assets = assets.values('type_name__group__group_id')\
                .annotate(grp_total=Sum('quantity'))\
                .annotate(grp_name=F('type_name__group__name'))\
                .annotate(grp_id=F('type_name__group_id'))\
                .annotate(cat_id=F('type_name__group__category_id'))\
                .order_by('-grp_total')

            capital_asset_groups = []
            subcap_asset_groups = []
            noteable_asset_groups = []
            structure_asset_groups = []
            bpo_asset_groups = []
            remaining_asset_groups = []

            for grp in assets:
                _grp = {
                    "label": grp['grp_name'],
                    "value": grp['grp_total'],
                }
                if grp['grp_id'] in capital_groups:
                    capital_asset_groups.append(_grp)
                elif grp['cat_id'] in subcap_cat:
                    subcap_asset_groups.append(_grp)
                elif grp['cat_id'] in noteable_cats:
                    noteable_asset_groups.append(_grp)
                elif grp['cat_id'] in structure_cats:
                    structure_asset_groups.append(_grp)
                elif grp['cat_id'] in bpo_cats:
                    bpo_asset_groups.append(_grp)
                else:
                    remaining_asset_groups.append(_grp)

            return [
                {"name": "Capital Ships",
                 "items": capital_asset_groups},
                {"name": "Subcap Ships",
                 "items": subcap_asset_groups},
                {"name": "Noteable Assets",
                 "items": noteable_asset_groups},
                {"name": "Structures",
                 "items": structure_asset_groups},
                {"name": "BPO",
                 "items": bpo_asset_groups},
                {"name": "Remaining",
                 "items": remaining_asset_groups},
            ]
