from ninja import NinjaAPI

from django.db.models import F, Q, Sum
from django.utils.translation import gettext as _

from allianceauth.services.hooks import get_extension_logger

from corptools import models
# from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character

logger = get_extension_logger(__name__)


class GlanceApiEndpoints:

    tags = ["At a Glance"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/glance/assets",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_assets(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id

            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            ship_cat = [6]
            injector_grp = 1739

            ship_assets = models.CharacterAsset.objects.filter(
                (
                    Q(type_name__group__category_id__in=ship_cat)
                    or Q(type_name__group_id=injector_grp)
                ),
                character__character__in=characters,
            ).values(
                'type_name__group__group_id'
            ).annotate(
                grp_total=Sum('quantity')
            ).annotate(
                grp_name=F('type_name__group__name')
            ).annotate(
                grp_id=F('type_name__group_id')
            ).annotate(
                cat_id=F('type_name__group__category_id')
            ).order_by(
                '-grp_total'
            )

            mining_groups = [463, 543]
            frig_groups = [25, 324, 830, 831, 834, 893, 1283, 1527, 2078]
            destroyer_groups = [420, 541, 1305, 1534]
            cruiser_groups = [26, 358, 832, 833, 894, 906, 963, 1972]
            bc_groups = [419, 540, 1201]
            bs_groups = [27, 381, 898, 900]
            indy_groups = [28, 380, 1202]
            dread_groups = [485, 4594]
            cap_indy_groups = [902, 513, 883]

            out_groups = {
                "frigate": 0,
                "destroyer": 0,
                "cruiser": 0,
                "battlecruiser": 0,
                "battleship": 0,
                "carrier": 0,
                "fax": 0,
                "dread": 0,
                "supercarrier": 0,
                "titan": 0,
                "mining": 0,
                "hauler": 0,
                "indy_command": 0,
                "capital_indy": 0,
                "injector": 0,
                "extractor": 0
            }

            for group in ship_assets:
                # this is ugly...
                grp = group["type_name__group__group_id"]

                if grp in frig_groups:
                    out_groups["frigate"] += group["grp_total"]
                elif grp in destroyer_groups:
                    out_groups["destroyer"] += group["grp_total"]
                elif grp in cruiser_groups:
                    out_groups["cruiser"] += group["grp_total"]
                elif grp in bc_groups:
                    out_groups["battlecruiser"] += group["grp_total"]
                elif grp in bs_groups:
                    out_groups["battleship"] += group["grp_total"]
                elif grp in indy_groups:
                    out_groups["hauler"] += group["grp_total"]
                elif grp in mining_groups:
                    out_groups["mining"] += group["grp_total"]
                elif grp in dread_groups:
                    out_groups["dread"] += group["grp_total"]
                elif grp in cap_indy_groups:
                    out_groups["capital_indy"] += group["grp_total"]
                elif grp == 30:
                    out_groups["titan"] += group["grp_total"]
                elif grp == 547:
                    out_groups["carrier"] += group["grp_total"]
                elif grp == 1538:
                    out_groups["fax"] += group["grp_total"]
                elif grp == 659:
                    out_groups["supercarrier"] += group["grp_total"]
                elif grp == 659:
                    out_groups["supercarrier"] += group["grp_total"]
                elif grp == injector_grp:
                    out_groups["injector"] += group["grp_total"]

            sp_types = [
                40519,  # extractor
            ]

            sp_assets = models.CharacterAsset.objects.filter(
                character__character__in=characters,
                type_name__type_id__in=sp_types
            ).values(
                'type_name__type_id'
            ).annotate(
                type_total=Sum('quantity')
            )

            for sp_type in sp_assets:
                _type = sp_type["type_name__type_id"]
                if _type == 40519:
                    out_groups["extractor"] += group["grp_total"]

            return out_groups
