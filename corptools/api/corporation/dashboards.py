import logging
from typing import List

from ninja import NinjaAPI

from django.db.models import (
    ExpressionWrapper, FloatField, OuterRef, Subquery, Sum,
)
from django.utils import timezone

from allianceauth.services.hooks import get_extension_logger

from corptools import models
from corptools.api import schema
from corptools.task_helpers.update_tasks import fetch_location_name

logger = get_extension_logger(__name__)


class DashboardApiEndpoints:

    tags = ["Dashboards"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "dashboard/gates",
            response={200: List, 403: schema.Message},
            tags=self.tags
        )
        def get_dashboard_gates(request):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_structures')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view structures!")
                return 403, {"message": "Permission Denied!"}

            output = []
            structures = models.Structure.get_visible(request.user).select_related(
                "corporation__corporation", "system_name"
            ).prefetch_related('structureservice_set').filter(type_id=35841)

            ozone = models.CorpAsset.objects.filter(
                type_id=16273,
                location_flag="StructureFuel"
            ).values("location_id").annotate(total=Sum('quantity'))
            levels = {}
            for o in ozone:
                if o["location_id"] not in levels:
                    levels[o["location_id"]] = 0
                levels[o["location_id"]] += o["total"]

            second_systems = set()
            output = {}
            now = timezone.now()
            for s in structures:
                split = s.name.split(" » ")
                from_sys = split[0]
                to_sys = split[1].split(" - ")[0]
                connection = f"{from_sys}{to_sys}"
                reverse_connection = f"{to_sys}{from_sys}"
                days = 0
                if s.fuel_expires:
                    days = (s.fuel_expires - now).days
                active = False
                for ss in s.structureservice_set.all():
                    if ss.name == "Jump Bridge Access" and ss.state == "online":
                        active = True
                if reverse_connection in second_systems:
                    output[to_sys]["end"] = {
                        "system_name": s.system_name.name,
                        "system_id": s.system_name_id,
                        "ozone": levels.get(s.structure_id),
                        "known": True,
                        "active": active,
                        "expires": days,
                        "name": s.name
                    }
                else:
                    output[from_sys] = {}
                    output[from_sys]["start"] = {
                        "system_name": s.system_name.name,
                        "system_id": s.system_name_id,
                        "ozone": levels.get(s.structure_id),
                        "known": True,
                        "active": active,
                        "expires": days,
                        "name": s.name
                    }
                    output[from_sys]["end"] = {
                        "known": False, "active": False}
                    second_systems.add(connection)

            return list(output.values())

        @api.get(
            "dashboard/sov",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_dashboard_sov(request):
            perms = (
                request.user.has_perm('corptools.holding_corp_assets')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view Sov Structures!")
                return 403, "Permission Denied!"

            types = [32458]

            assets = models.CorpAsset.get_visible(request.user).filter(
                type_id__in=types,
                location_type="solar_system").select_related(
                "type_name",
                "location_name__system",
                "location_name__system__constellation",
                "location_name__system__constellation__region",
                "type_name__group__category"
            )

            asset_locations = models.CorpAsset.get_visible(request.user).filter(
                location_id__in=assets.values("item_id")).select_related(
                "type_name"
            )

            location_names = {}

            for a in assets:
                if not a.location_name_id:
                    location = fetch_location_name(
                        a.location_id, a.location_type, 0)
                    a.location_name = location
                loc_id = a.item_id
                if loc_id not in location_names:
                    location_names[loc_id] = {
                        "system": {
                            "name": a.location_name.location_name,
                            "const": a.location_name.system.constellation.name,
                            "rgn": a.location_name.system.constellation.region.name
                        },
                        "upgrades": []
                    }

            for a in asset_locations:
                location_names[a.location_id]["upgrades"].append({
                    "id": a.type_name.type_id,
                    "name": a.type_name.name,
                    "active": a.location_flag
                })

            return list(location_names.values())

        @api.get(
            "dashboard/metenox",
            response={200: List[schema.Metenox], 403: str},
            tags=self.tags
        )
        def get_dashboard_drills(request):
            return self.get_dashboard_drills_levels(request)

        @api.get(
            "dashboard/dens",
            response={200: list, 403: str},
            tags=self.tags
        )
        def get_visible_dens(
            request,
        ):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
            )

            if not perms:
                logger.error(
                    f"Permission Denied for {request.user} to view mining!")
                return 403, "Permission Denied!"

            characters = models.CharacterAudit.objects.visible_to(
                request.user
            )
            assets = models.CharacterAsset.objects.filter(
                singleton=True,
                location_id__lte=32000000,
                type_name__group_id=4810,
                character__in=characters,
            ).select_related(
                "character",
                "character__character",
                "type_name",
                "location_name",
                "type_name__group__category"
            )

            output = []

            for a in assets:
                type_nm = a.type_name.name
                if a.name:
                    type_nm = f"{a.type_name.name} ({a.name})"
                loc = f"{a.location_id} ({a.location_flag})"
                const = {"id": 0, "name": ""}
                region = {"id": 0, "name": ""}
                if a.location_name:
                    loc = a.location_name.location_name
                    try:
                        const = {
                            "id": a.location_name.system.constellation_id,
                            "name": a.location_name.system.constellation.name
                        }
                        region = {
                            "id": a.location_name.system.constellation.region_id,
                            "name": a.location_name.system.constellation.region.name
                        }
                    except Exception:
                        pass
                character_name = a.character.character.character_name
                try:
                    mc = a.character.character.character_ownership.user.profile.main_character
                    character_name = f"{mc.character_name} ({character_name})"
                except Exception:
                    pass
                output.append({
                    "character": {
                        "character_id": a.character.character.character_id,
                        "character_name": character_name,
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
                    "expand": False,
                    "name": a.name,
                    "location": {
                        "id": a.location_id,
                        "name": loc,
                        "constellation": const,
                        "region": region
                    }
                })

            return output

    def get_dashboard_drills_levels(request):
        perms = (
            request.user.has_perm('corptools.own_corp_manager')
            | request.user.has_perm('corptools.alliance_corp_manager')
            | request.user.has_perm('corptools.state_corp_manager')
            | request.user.has_perm('corptools.global_corp_manager')
            | request.user.has_perm('corptools.holding_corp_structures')
        )

        if not perms:
            logging.error(
                f"Permission Denied for {request.user} to view Metenox!")
            return 403, "Permission Denied!"

        types = [81826]  # metenox drills

        drills = models.Structure.get_visible(request.user).filter(
            type_id__in=types
        ).select_related(
            "type_name",
            "system_name",
            "system_name__constellation",
            "system_name__constellation__region",
        )

        output = {}

        for d in drills:
            output[d.structure_id] = {
                "structure": {
                    "id": d.structure_id,
                    "owner": d.corporation.corporation,
                    "name": d.name,
                    "type": {
                        "id": d.type_name.type_id,
                        "name": d.type_name.name
                    },
                    "location": {
                        "id": d.system_name.system_id,
                        "name": d.system_name.name
                    },
                    "constellation": {
                        "id": d.system_name.constellation.constellation_id,
                        "name": d.system_name.constellation.name
                    },
                    "region": {
                        "id": d.system_name.constellation.region.region_id,
                        "name": d.system_name.constellation.region.name
                    },
                },
                "contents": {},
                "total": 0
            }

        type_price = models.TypePrice.objects.filter(
            item_id=OuterRef('type_id')
        )

        asset_contents = models.CorpAsset.objects.filter(
            location_id__in=drills.values("structure_id"),
            location_flag="MoonMaterialBay"
        ).select_related(
            "type_name"
        ).annotate(
            value=ExpressionWrapper(
                Subquery(type_price.values('price')) * Sum('quantity'),
                output_field=FloatField()
            )
        )

        for a in asset_contents:
            _lid = a.location_id
            _tid = a.type_id

            if _tid not in output[_lid]["contents"]:
                output[_lid]["contents"][_tid] = {
                    "type": {
                        "id": a.type_name.type_id,
                        "name": a.type_name.name
                    },
                    "quantity": 0,
                    "value": 0
                }

            output[_lid]["contents"][_tid]["quantity"] += a.quantity or 0
            output[_lid]["contents"][_tid]["value"] += a.value or 0
            output[_lid]["total"] += a.value or 0

        for k, i in output.items():
            i["contents"] = list(i["contents"].values())
            i["total"] = int(i["total"])

        return list(output.values())
