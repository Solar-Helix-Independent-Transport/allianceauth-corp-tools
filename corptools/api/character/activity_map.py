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
            "account/{character_id}/activitymap/contracts",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_contracts(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            contract_qs = models.Contract.objects.filter(
                character__character__in=characters)
            return build_contract_map_payload(contract_qs)

        @api.get(
            "account/{character_id}/activitymap/contracts/sales",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_contracts_sales(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            contract_qs = models.Contract.objects.filter(
                character__character__in=characters)
            return build_contract_map_payload(
                contract_qs,
                Q(contract_type__in=SALES_CONTRACT_TYPES),
            )

        @api.get(
            "account/{character_id}/activitymap/contracts/logistics",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_contracts_logistics(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            contract_qs = models.Contract.objects.filter(
                character__character__in=characters)
            return build_contract_map_payload(
                contract_qs,
                Q(contract_type__in=LOGISTICS_CONTRACT_TYPES),
            )

        @api.get(
            "account/{character_id}/activitymap/industry",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_industry(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            job_qs = models.CharacterIndustryJob.objects.filter(
                character__character__in=characters)
            return build_industry_map_payload(job_qs)

        @api.get(
            "account/{character_id}/activitymap/location",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_location(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return build_current_location_map_payload(characters)

        @api.get(
            "account/{character_id}/activitymap/clones/home",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_clones_home(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return build_home_clone_map_payload(characters)

        @api.get(
            "account/{character_id}/activitymap/clones/jump",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_clones_jump(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return build_jump_clone_map_payload(characters)

        @api.get(
            "account/{character_id}/activitymap/orders",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_orders(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            order_qs = models.CharacterMarketOrder.objects.filter(
                character__character__in=characters)
            return build_market_order_map_payload(order_qs)

        @api.get(
            "account/{character_id}/activitymap/mercenarydens",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_mercenary_dens(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            den_qs = models.CharacterMercenaryDen.objects.filter(
                character__character__in=characters)
            return build_mercenary_den_map_payload(den_qs)

        @api.get(
            "account/{character_id}/activitymap/mercenarytacticaloperations",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_mercenary_tactical_operations(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return build_mercenary_tactical_operation_map_payload(characters)

        @api.get(
            "account/{character_id}/activitymap/pi",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_activity_map_pi(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return build_pi_activity_map_payload(characters)

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
