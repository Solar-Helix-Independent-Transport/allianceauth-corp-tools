# Third Party
from ninja import NinjaAPI

# Django
from django.db.models import Q

# AA Example App
from corptools import models
from corptools.api.activity_map_shared import (
    build_asset_map_payload,
    build_mining_map_payload,
    build_ratting_map_payload,
)
from corptools.api.helpers import resolve_character
from corptools.constants.assets import CAPITAL_SHIP_GROUP_IDS, SHIP_CATEGORY_ID


class ActivityMapApiEndpoints:

    tags = ["ActivityMap"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/activitymap/assets",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_assets(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            asset_qs = models.CharacterAsset.objects.filter(
                character__character__in=characters)
            return build_asset_map_payload(asset_qs)

        @api.get(
            "account/{character_id}/activitymap/assets/ships",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_assets_ships(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            asset_qs = models.CharacterAsset.objects.filter(
                character__character__in=characters)
            return build_asset_map_payload(
                asset_qs,
                Q(type_name__group__category_id=SHIP_CATEGORY_ID),
            )

        @api.get(
            "account/{character_id}/activitymap/assets/capitals",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_assets_capitals(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            asset_qs = models.CharacterAsset.objects.filter(
                character__character__in=characters)
            return build_asset_map_payload(
                asset_qs,
                Q(type_name__group_id__in=CAPITAL_SHIP_GROUP_IDS),
            )

        @api.get(
            "account/{character_id}/activitymap/mining",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_mining(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return build_mining_map_payload(characters)

        @api.get(
            "account/{character_id}/activitymap/ratting",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_ratting(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return build_ratting_map_payload(characters)
