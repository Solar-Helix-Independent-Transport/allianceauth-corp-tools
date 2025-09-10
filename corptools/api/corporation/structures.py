import json
import logging
from datetime import timedelta
from typing import List

from ninja import NinjaAPI

from django.db.models import F
from django.db.models.functions import Power, Sqrt
from django.http import HttpResponse
from django.utils import timezone

from allianceauth.services.hooks import get_extension_logger

from corptools import app_settings, models
from corptools.api import schema
from corptools.api.helpers import round_or_null

logger = get_extension_logger(__name__)


class StructureApiEndpoints:

    tags = ["Structures"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corp/structures",
            response={200: List[schema.Structure], 403: str},
            tags=self.tags
        )
        def get_visible_structures(request):
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
                return 403, "Permission Denied!"

            output = []
            for s in models.Structure.get_visible(request.user).select_related(
                'type_name', "corporation__corporation", "system_name"
            ).prefetch_related('structureservice_set'):
                _ss = list()
                for __s in s.structureservice_set.all():
                    _ss.append({
                        "name": __s.name,
                        "state": __s.state
                    })
                _s = {
                    "id": s.structure_id,
                    "owner": s.corporation.corporation,
                    "name": s.name,
                    "type": {"id": s.type_id,
                             "name": s.type_name.name},
                    "services": _ss,
                    "location": {"id": s.system_name.system_id,
                                 "name": s.system_name.name},
                    "constellation": {"id": s.system_name.constellation.constellation_id,
                                      "name": s.system_name.constellation.name},
                    "region": {"id": s.system_name.constellation.region.region_id,
                               "name": s.system_name.constellation.region.name},
                    "fuel_expiry": s.fuel_expires,
                    "state": s.state,
                    "state_expiry": s.state_timer_end
                }
                output.append(_s)
            return list(output)

        @api.get(
            "corp/structures/fuel",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_fuel_data(request):
            if not (request.user.has_perm('corptools.own_corp_manager')
                    or request.user.has_perm('corptools.alliance_corp_manager')
                    or request.user.has_perm('corptools.state_corp_manager')
                    or request.user.has_perm('corptools.global_corp_manager')
                    or request.user.has_perm('corptools.holding_corp_structures')):
                logging.error(
                    f"Permission Denied for {request.user} to view Fuel!")
                return 403, "Permission Denied!"

            # hourly fuel reqs [ cit, eng, ref, flex ]
            citadel_service_mods = {
                'Clone Bay': [7.5, 10, 10, 10],
                'Market': [30, 40, 40, 40],
                'Manufacturing (Capitals)': [24, 18, 24, 24],
                # how to detect this
                'Standup Hyasyoda Research Lab': [10, 7.5, 10, 10],
                'Invention': [12, 9, 12, 12],
                'Manufacturing (Standard)': [12, 9, 12, 12],
                'Blueprint Copying': [12, 9, 12, 12],
                'Material Efficiency Research': [0, 0, 0, 0],  # part of above
                'Time Efficiency Research': [0, 0, 0, 0],  # part of above
                'Manufacturing (Super Capitals)': [36, 27, 36, 36],
                'Composite Reactions': [15, 15, 12, 15],
                'Hybrid Reactions': [15, 15, 12, 15],
                'Moon Drilling': [5, 5, 5, 5],
                'Biochemical Reactions': [15, 15, 12, 15],
                'Reprocessing': [10, 10, 7.5, 10],
                'Jump Access': [0, 0, 0, 15],  # large to show errors
                'Cynosural Jammer': [0, 0, 0, 40],
                'Jump Gate Access': [0, 0, 0, 30],
                'Automatic Moon Drilling': [0, 0, 0, 5]
            }

            cit = [35833, 47516, 47512, 47513, 47514, 47515, 35832, 35834]
            eng = [35827, 35826, 35825]
            ref = [35835, 35836]
            fle = [37534, 35841, 35840, 81826]

            flex_fuel_types = [81143]

            all_structures = models.Structure.get_visible(request.user).select_related(
                'corporation', 'corporation__corporation', 'system_name', 'type_name',
                'system_name__constellation', 'system_name__constellation__region'
            ).prefetch_related('structureservice_set')

            structure_tree = []
            total_hourly_fuel = 0
            for s in all_structures:
                structure_hourly_fuel = 0
                structure_type = 99

                if s.type_id in cit:
                    structure_type = 0
                elif s.type_id in eng:
                    structure_type = 1
                elif s.type_id in ref:
                    structure_type = 2
                elif s.type_id in fle:
                    structure_type = 3

                for service in s.structureservice_set.all():
                    if service.state == 'online':
                        fuel_use = citadel_service_mods[service.name][structure_type]
                        total_hourly_fuel += fuel_use
                        structure_hourly_fuel += fuel_use

                hours = 0

                if s.fuel_expires is not None:
                    hours = (s.fuel_expires - timezone.now()
                             ).total_seconds() // 3600

                extras = None

                if s.type_id == 81826:
                    fuels = models.CorpAsset.objects.filter(
                        type_id__in=flex_fuel_types,
                        location_id=s.structure_id
                    ).select_related(
                        'type_name'
                    )
                    out = {
                        "qty": 0,
                    }
                    for itm in fuels:
                        out["name"] = itm.type_name.name
                        out["qty"] += itm.quantity

                    out["expires"] = timezone.now() + timedelta(
                        hours=out["qty"] /
                        app_settings.CT_CHAR_METENOX_GAS_USE_HOURLY
                    )
                    if out['qty'] > 0:
                        extras = out

                structure_tree.append(
                    {
                        "id": s.structure_id,
                        "owner": {
                            "id": s.corporation.corporation.corporation_id,
                            "name": s.corporation.corporation.corporation_name
                        },
                        "name": s.name,
                        "type": {"id": s.type_id,
                                 "name": s.type_name.name},
                        "location": {"id": s.system_name.system_id,
                                     "name": s.system_name.name},
                        "constellation": {"id": s.system_name.constellation.constellation_id,
                                          "name": s.system_name.constellation.name},
                        "region": {"id": s.system_name.constellation.region.region_id,
                                   "name": s.system_name.constellation.region.name},
                        "fuel_expiry": s.fuel_expires,
                        "state": s.state,
                        "state_expiry": s.state_timer_end,
                        'fuel_req': structure_hourly_fuel,
                        "current_blocks": int(hours * structure_hourly_fuel),
                        "extra_fuel_info": extras,
                        "90day": max(
                            int(
                                (
                                    structure_hourly_fuel * 90 * 24
                                ) - (
                                    hours * structure_hourly_fuel
                                )
                            ),
                            0
                        )
                    }
                )

            context = {
                'structures': structure_tree,
                'total_hourly_fuel': total_hourly_fuel,
            }

            return context

        @api.get(
            "corp/structures/{structure_id}",
            response={200: dict, 404: str, 403: str},
            tags=self.tags
        )
        def get_corporation_structure_fitting(request, structure_id):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_structures')
            )
            structure = models.Structure.get_visible(request.user).filter(
                structure_id=structure_id)

            if not perms or not structure.exists():
                logging.error(
                    f"Permission Denied for {request.user} to view structures!")
                return 403, "Permission Denied!"

            output = {}
            assets = models.CorpAsset.objects.filter(location_id=structure_id)
            accepted_flags = [
                "Cargo",
                "StructureFuel",
                "QuantumCoreRoom",
                "FighterBay",
                "MoonMaterialBay"
            ]
            for a in assets:

                if "Slot" in a.location_flag:
                    output[a.location_flag] = {
                        "id": a.type_name.type_id,
                        "name": a.type_name.name
                    }
                elif "Tube" in a.location_flag:
                    output[a.location_flag] = {
                        "id": a.type_name.type_id,
                        "name": a.type_name.name
                    }
                else:
                    if a.location_flag in accepted_flags:
                        if a.location_flag not in output:
                            output[a.location_flag] = []
                        output[a.location_flag].append({
                            "id": a.type_name.type_id,
                            "name": a.type_name.name,
                            "qty": a.quantity
                        })

            _dogma = models.EveItemDogmaAttribute.objects.filter(
                eve_type_id=structure.first().type_id,
                attribute_id__in=[12, 13, 14, 1137, 2216, 2056]
            )
            slots = {"low": 8, "med": 8, "high": 8, "rig": 3,
                     "service": 0, "fighter": 0, "subsystem": 0}
            for d in _dogma:
                if d.attribute_id == 12:
                    slots["low"] = d.value
                if d.attribute_id == 13:
                    slots["med"] = d.value
                if d.attribute_id == 14:
                    slots["high"] = d.value
                if d.attribute_id == 1137:
                    slots["rig"] = d.value
                if d.attribute_id == 2216:
                    slots["fighter"] = d.value
                if d.attribute_id == 2056:
                    slots["service"] = d.value

            return {
                "fit": output,
                **slots
            }

        @api.get(
            "corp/pocos",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_visible_pocos(request):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_structures')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view pocos!")
                return 403, "Permission Denied!"

            output = []
            for s in models.Poco.get_visible(request.user).select_related(
                "corporation__corporation", "system_name", "system_name__constellation", "system_name__constellation__region", "planet"
            ):
                try:
                    _s = {
                        "id": s.office_id,
                        "owner": {
                            "corporation_name": s.corporation.corporation.corporation_name,
                            "corporation_id": s.corporation.corporation.corporation_id
                        },
                        "name": s.name,
                        "location": {"id": s.planet.planet_id,
                                     "name": s.planet.name,
                                     "region": s.system_name.constellation.region.name,
                                     "constellation": s.system_name.constellation.name},
                        "standing_level": s.standing_level,
                        "alliance_tax_rate": round_or_null(s.alliance_tax_rate),
                        "corporation_tax_rate": round_or_null(s.corporation_tax_rate),
                        "terrible_standing_tax_rate": round_or_null(s.terrible_standing_tax_rate),
                        "bad_standing_tax_rate": round_or_null(s.bad_standing_tax_rate),
                        "neutral_standing_tax_rate": round_or_null(s.neutral_standing_tax_rate),
                        "good_standing_tax_rate": round_or_null(s.good_standing_tax_rate),
                        "excellent_standing_tax_rate": round_or_null(s.excellent_standing_tax_rate),
                        "reinforce_exit_end": s.reinforce_exit_end,
                        "reinforce_exit_start": s.reinforce_exit_start,
                        "allow_access_with_standings": s.allow_access_with_standings,
                        "allow_alliance_access": s.allow_alliance_access,
                    }
                    output.append(_s)
                except AttributeError:
                    logger.error(
                        f"Bad Poco {s}"
                    )
            return list(output)

        @api.get(
            "extra/jb/export",
            response={200: str, 403: str},
            tags=["Extras"]
        )
        def get_jb_link(request):
            output = []
            for s in models.Structure.objects.filter(
                type_id=35841
            ):
                id = s.structure_id
                split = s.name.split(" » ")

                from_sys = split[0]
                to_sys = split[1].split(" - ")[0]

                output.append(f"{id} {from_sys} --> {to_sys}")
            return HttpResponse("\n".join(output), content_type="text/plain")

        @api.get(
            "corp/starbases",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_visible_starbases(request):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_structures')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view starbases!")
                return 403, "Permission Denied!"

            output = []
            for s in models.Starbase.get_visible(request.user).select_related(
                'type_name', "corporation__corporation", "system", "moon"
            ):
                extras = {}
                if s.moon:
                    extras["moon"] = {
                        "id": s.moon.moon_id,
                        "name": s.moon.name
                    }

                if s.system:
                    extras["system"] = {
                        "id": s.system.system_id,
                        "name": s.system.name
                    }
                    extras["constellation"] = {
                        "id": s.system.constellation.constellation_id,
                        "name": s.system.constellation.name
                    }
                    extras["region"] = {
                        "id": s.system.constellation.region.region_id,
                        "name": s.system.constellation.region.name
                    }

                _s = {
                    "starbase_id": s.starbase_id,
                    "owner": {
                        "corporation_id": s.corporation.corporation.corporation_id,
                        "corporation_name": s.corporation.corporation.corporation_name,
                    },
                    "name": s.name,
                    "type": {"id": s.type_name.type_id,
                             "name": s.type_name.name},
                    "state": s.state,
                    "onlined_since": s.onlined_since,
                    "reinforced_until": s.reinforced_until,
                    "unanchor_at": s.unanchor_at,
                    "allow_alliance_members": s.allow_alliance_members,
                    "allow_corporation_members": s.allow_corporation_members,
                    "attack_if_other_security_status_dropping": s.attack_if_other_security_status_dropping,
                    "use_alliance_standings": s.use_alliance_standings,
                    "attack_security_status_threshold": s.attack_security_status_threshold,
                    "attack_standing_threshold": s.attack_standing_threshold,
                    "anchor": s.anchor,
                    "online": s.online,
                    "offline": s.offline,
                    "unanchor": s.unanchor,
                    "fuel_bay_take": s.fuel_bay_take,
                    "fuel_bay_view": s.fuel_bay_view,
                    "fuels": s.fuels,
                    **extras
                }
                output.append(_s)
            return list(output)

        @api.get(
            "corp/starbase/{starbase_id}",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_visible_starbase_fit(request, starbase_id: int):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_structures')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view starbases!")
                return 403, "Permission Denied!"
            starbase = models.Starbase.get_visible(
                request.user
            ).filter(starbase_id=starbase_id)
            if starbase.exists():
                parent = models.CorpAsset.objects.filter(
                    item_id=starbase_id,
                    coordinate__isnull=False
                ).first()

                if parent:
                    logger.warning(f"Tower - {parent.type_name.name}")
                    distances = models.CorpAsset.objects.filter(
                        coordinate__isnull=False
                    ).annotate(
                        distance=Sqrt(
                            Power(
                                parent.coordinate.x - F("coordinate__x"),
                                2
                            ) + Power(
                                parent.coordinate.y - F("coordinate__y"),
                                2
                            ) + Power(
                                parent.coordinate.z - F("coordinate__z"),
                                2
                            )
                        )
                    ).filter(
                        distance__lte=100000
                    )

                    assets_in_space = []
                    for d in distances:
                        assets_in_space.append({
                            "type": {
                                "id": d.type_name.type_id,
                                "name": d.type_name.name
                            },
                            "distance": d.distance
                        })

                    assets_in_bay = []
                    starbase = starbase.first()
                    try:
                        for f in json.loads(starbase.fuels.replace("'", '"')):
                            # This is bad and i should feel bad....
                            # TODO save this correctly...
                            # TODO investigate if i can do this via assets betterer
                            type_name = models.EveItemType.objects.get(
                                type_id=f['type_id'])
                            assets_in_bay.append({
                                "id": type_name.type_id,
                                "name": type_name.name,
                                "qty": f['quantity']
                            })
                    except json.JSONDecodeError as e:
                        pass

                    return 200, {
                        "fuel": assets_in_bay,
                        "space": assets_in_space
                    }
            else:
                logging.error(
                    f"Permission Denied for {request.user} to view starbase {starbase_id}!")
                logger.warning(f"Tower - not found in assets")

                return 403, "Permission Denied!"
