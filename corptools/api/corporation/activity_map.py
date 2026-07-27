# Third Party
from ninja import NinjaAPI

# Django
from django.db.models import Q

# AA Example App
from corptools import models
from corptools.api.activity_map_shared import (
    LOGISTICS_CONTRACT_TYPES,
    SALES_CONTRACT_TYPES,
    build_asset_map_payload,
    build_contract_map_payload,
    build_current_location_map_payload,
    build_home_clone_map_payload,
    build_industry_map_payload,
    build_jump_clone_map_payload,
    build_market_order_map_payload,
    build_mercenary_den_map_payload,
    build_mercenary_tactical_operation_map_payload,
    build_mining_map_payload,
    build_pi_activity_map_payload,
    build_poco_map_payload,
    build_poco_revenue_map_payload,
    build_ratting_map_payload,
    build_starbase_map_payload,
    build_structure_map_payload,
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
            "corporation/{corporation_id}/activitymap/assets/members",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_assets_members(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            asset_qs = models.CharacterAsset.objects.filter(
                character__character__in=characters)
            return build_asset_map_payload(asset_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/assets/members/ships",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_assets_members_ships(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            asset_qs = models.CharacterAsset.objects.filter(
                character__character__in=characters)
            return build_asset_map_payload(
                asset_qs,
                Q(type_name__group__category_id=SHIP_CATEGORY_ID),
            )

        @api.get(
            "corporation/{corporation_id}/activitymap/assets/members/capitals",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_assets_members_capitals(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            asset_qs = models.CharacterAsset.objects.filter(
                character__character__in=characters)
            return build_asset_map_payload(
                asset_qs,
                Q(type_name__group_id__in=CAPITAL_SHIP_GROUP_IDS),
            )

        @api.get(
            "corporation/{corporation_id}/activitymap/structures",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_structures(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            structure_qs = models.Structure.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_structure_map_payload(structure_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/starbases",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_starbases(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            starbase_qs = models.Starbase.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_starbase_map_payload(starbase_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/pocos",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_pocos(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            poco_qs = models.Poco.get_visible(request.user).filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_poco_map_payload(poco_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/pocos/revenue",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_pocos_revenue(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            wallet_qs = models.CorporationWalletJournalEntry.get_visible(request.user).filter(
                division__corporation__corporation__corporation_id=corporation_id)
            return build_poco_revenue_map_payload(wallet_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/orders",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_orders(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            order_qs = models.CorporationMarketOrder.objects.filter(
                wallet_division__corporation__corporation__corporation_id=corporation_id)
            return build_market_order_map_payload(order_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/orders/members",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_orders_members(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            order_qs = models.CharacterMarketOrder.objects.filter(
                character__character__in=characters)
            return build_market_order_map_payload(order_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/contracts",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_contracts(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            contract_qs = models.CorporateContract.objects.filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_contract_map_payload(contract_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/contracts/sales",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_contracts_sales(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            contract_qs = models.CorporateContract.objects.filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_contract_map_payload(
                contract_qs,
                Q(contract_type__in=SALES_CONTRACT_TYPES),
            )

        @api.get(
            "corporation/{corporation_id}/activitymap/contracts/logistics",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_contracts_logistics(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            contract_qs = models.CorporateContract.objects.filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_contract_map_payload(
                contract_qs,
                Q(contract_type__in=LOGISTICS_CONTRACT_TYPES),
            )

        @api.get(
            "corporation/{corporation_id}/activitymap/industry",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_industry(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            job_qs = models.CorporationIndustryJob.objects.filter(
                corporation__corporation__corporation_id=corporation_id)
            return build_industry_map_payload(job_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/location",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_location(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            return build_current_location_map_payload(characters)

        @api.get(
            "corporation/{corporation_id}/activitymap/clones/home",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_clones_home(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            return build_home_clone_map_payload(characters)

        @api.get(
            "corporation/{corporation_id}/activitymap/clones/jump",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_clones_jump(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            return build_jump_clone_map_payload(characters)

        @api.get(
            "corporation/{corporation_id}/activitymap/mercenarydens",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_mercenary_dens(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            den_qs = models.CharacterMercenaryDen.objects.filter(
                character__character__in=characters)
            return build_mercenary_den_map_payload(den_qs)

        @api.get(
            "corporation/{corporation_id}/activitymap/mercenarytacticaloperations",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_mercenary_tactical_operations(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            return build_mercenary_tactical_operation_map_payload(characters)

        @api.get(
            "corporation/{corporation_id}/activitymap/pi",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_activity_map_pi(request, corporation_id: int):
            if not _has_activity_map_perms(request.user):
                return 403, "Permission Denied!"

            characters = get_corporation_characters(request, corporation_id)
            return build_pi_activity_map_payload(characters)

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
