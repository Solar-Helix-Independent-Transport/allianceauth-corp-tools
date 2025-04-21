from typing import List

from ninja import NinjaAPI

from django.db.models import F, Q, Sum
from django.utils.translation import gettext as _

from corptools import models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character


class AssetsApiEndpoints:

    tags = ["Assets"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/{character_id}/asset/locations",
            response={200: List[schema.ValueLabel], 403: str},
            tags=self.tags
        )
        def get_character_asset_locations(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            asset_locs = models.CharacterAsset.objects.filter(character__character__in=characters,
                                                              location_name__isnull=False).values_list('location_name').distinct()
            asset_locs = models.EveLocation.objects.filter(
                location_id__in=asset_locs).order_by('location_name')

            asset_locations = [{"label": _("Everywhere"), "value": 0},
                               {"label": _("AssetSafety"), "value": 2004}, ]

            for loc in asset_locs:
                name = loc.location_name
                if loc.system:
                    name = f"{loc.location_name} ({loc.system.security_status:0.2f})"
                asset_locations.append({
                    "label": name,
                    "value": loc.location_id
                })

            return asset_locations

        @api.get(
            "account/{character_id}/asset/{location_id}/list",
            response={200: List[schema.CharacterAssetItem], 403: str},
            tags=self.tags
        )
        def get_character_asset_list(request, character_id: int, location_id: int):
            expandable_cats = [2, 6]

            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            assets = models.CharacterAsset.objects\
                .filter((Q(blueprint_copy=None) | Q(blueprint_copy=False)),
                        character__character__in=characters).select_related(
                            "character",
                            "character__character",
                            "type_name",
                            "location_name",
                            "location_name__system",
                            "location_name__system__constellation",
                            "location_name__system__constellation__region",
                            "type_name__group__category"
                )

            if location_id == 2004:
                asset_locations = assets.filter(
                    location_flag="AssetSafety").values_list('item_id')
                assets = assets.filter(location_id__in=asset_locations)
            elif location_id != 0:
                assets = assets.filter(Q(location_name_id=int(
                    location_id)) | Q(location_id=int(location_id)))

            output = []

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
                    "character": {
                        "character_id": a.character.character.character_id,
                        "character_name": a.character.character.character_name,
                        "corporation_id": a.character.character.corporation_id,
                        "corporation_name": a.character.character.corporation_name,
                        "alliance_id": a.character.character.alliance_id,
                        "alliance_name": a.character.character.alliance_name
                    },
                    "item": {
                        "id": a.type_name.type_id,
                        "name": type_nm,
                        "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}",
                        "cat_id": a.type_name.group.category_id
                    },
                    "quantity": a.quantity,
                    "id": a.item_id,
                    "expand": True if a.type_name.group.category.category_id in expandable_cats else True if a.type_name_id == 60 else False,  # ships or asset wraps
                    "location": loc
                })

            return output

        @api.get(
            "account/{character_id}/asset/{item_id}/contents",
            response={200: List[schema.CharacterAssetItem], 403: str},
            tags=self.tags
        )
        def get_character_asset_contents(request, character_id: int, item_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            assets = models.CharacterAsset.objects\
                .filter(character__character__in=characters).select_related(
                    "character", "character__character",
                    "type_name", "location_name", "type_name__group__category"
                )
            assets = assets.filter(location_id=item_id)
            output = []

            for a in assets:
                output.append({
                    "character": {
                        "character_id": a.character.character.character_id,
                        "character_name": a.character.character.character_name,
                        "corporation_id": a.character.character.corporation_id,
                        "corporation_name": a.character.character.corporation_name,
                        "alliance_id": a.character.character.alliance_id,
                        "alliance_name": a.character.character.alliance_name
                    },
                    "item": {
                        "id": a.type_name.type_id,
                        "name": a.type_name.name,
                        "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}",
                        "cat_id": a.type_name.group.category_id

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
            "account/{character_id}/asset/{location_id}/groups",
            response={200: List[schema.CharacterAssetGroups], 403: str},
            tags=self.tags
        )
        def get_character_asset_groups(request, character_id: int, location_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            capital_groups = [30, 547, 659, 1538, 485, 902, 513, 883, 77283]
            subcap_cat = [6]
            noteable_cats = [4, 20, 23, 25, 34, 35, 87, 91]
            structure_cats = [22, 24, 40, 41, 46, 65, 66, ]
            bpo_cats = [9]

            assets = models.CharacterAsset.objects\
                .filter((Q(blueprint_copy=None) | Q(blueprint_copy=False)),
                        character__character__in=characters)

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
                {"name": _("Capital Ships"),
                 "items": capital_asset_groups},
                {"name": _("Subcaps Ships"),
                 "items": subcap_asset_groups},
                {"name": _("Noteable Assets"),
                 "items": noteable_asset_groups},
                {"name": _("Structures"),
                 "items": structure_asset_groups},
                {"name": _("BPO"),
                 "items": bpo_asset_groups},
                {"name": _("Remaining"),
                 "items": remaining_asset_groups},
            ]
