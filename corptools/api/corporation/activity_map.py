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
from corptools.api.helpers import get_corporation_characters
from corptools.constants.assets import CAPITAL_SHIP_GROUP_IDS, SHIP_CATEGORY_ID


def _has_activity_map_perms(user) -> bool:
    return (
        user.has_perm('corptools.own_corp_manager')
        | user.has_perm('corptools.alliance_corp_manager')
        | user.has_perm('corptools.state_corp_manager')
        | user.has_perm('corptools.global_corp_manager')
        | user.has_perm('corptools.holding_corp_assets')
        | user.has_perm('corptools.holding_corp_wallets')
    )


class CorpActivityMapApiEndpoints:

    tags = ["ActivityMap"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corporation/{corporation_id}/activitymap/assets",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_assets(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            asset_qs = models.CorpAsset.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_asset_map_payload(asset_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/assets/ships",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_assets_ships(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            asset_qs = models.CorpAsset.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_asset_map_payload(
                asset_qs,
                Q(type_name__group__category_id=SHIP_CATEGORY_ID),
            )

        @api.get(
            "corporation/{corporation_id}/activitymap/assets/capitals",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_assets_capitals(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            asset_qs = models.CorpAsset.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_asset_map_payload(
                asset_qs,
                Q(type_name__group_id__in=CAPITAL_SHIP_GROUP_IDS),
            )

        @api.get(
            "corporation/{corporation_id}/activitymap/mining",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_mining(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            return build_mining_map_payload(characters)

        @api.get(
            "corporation/{corporation_id}/activitymap/ratting",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_ratting(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            return build_ratting_map_payload(characters)
