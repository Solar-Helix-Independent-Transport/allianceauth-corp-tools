# Standard Library
import logging
from typing import List

# Third Party
from eve_sde.models import SolarSystem
from ninja import NinjaAPI

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools import models

logger = get_extension_logger(__name__)


def _parse_workforce_transport(wt: dict, system_names: dict) -> dict:
    if not wt:
        return None

    def name(sid):
        return system_names.get(sid, f"#{sid}")

    config = wt.get("configuration") or {}
    state = wt.get("state") or {}

    if "import" in config:
        mode = "import"
        cfg_sources = [
            {"system_id": s["solar_system_id"],
                "system_name": name(s["solar_system_id"])}
            for s in (config["import"].get("sources") or [])
        ]
        state_sources = [
            {"system_id": s["solar_system_id"], "system_name": name(
                s["solar_system_id"]), "amount": s.get("amount")}
            for s in ((state.get("import") or {}).get("sources") or [])
        ]
        return {"mode": mode, "config_sources": cfg_sources, "state_sources": state_sources,
                "config_destination": None, "state_destination": None}

    if "export" in config:
        mode = "export"
        cfg_exp = config["export"]
        sid = cfg_exp.get("solar_system_id")
        cfg_dest = {"system_id": sid, "system_name": name(
            sid), "amount": cfg_exp.get("amount")} if sid else None
        st_exp = state.get("export") or {}
        st_sid = st_exp.get("solar_system_id")
        st_dest = {"system_id": st_sid, "system_name": name(
            st_sid), "amount": st_exp.get("amount")} if st_sid else None
        return {"mode": mode, "config_sources": [], "state_sources": [],
                "config_destination": cfg_dest, "state_destination": st_dest}

    if "transit" in config:
        return {"mode": "transit", "config_sources": [], "state_sources": [],
                "config_destination": None, "state_destination": None}

    return {"mode": None, "config_sources": [], "state_sources": [],
            "config_destination": None, "state_destination": None}


class SovereigntyApiEndpoints:

    tags = ["Sovereignty"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corp/sovhubs",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_visible_sovhubs(request):
            perms = (
                request.user.has_perm('corptools.own_corp_manager')
                | request.user.has_perm('corptools.alliance_corp_manager')
                | request.user.has_perm('corptools.state_corp_manager')
                | request.user.has_perm('corptools.global_corp_manager')
                | request.user.has_perm('corptools.holding_corp_structures')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view sovereignty hubs!")
                return 403, "Permission Denied!"

            hubs = list(models.SovereigntyHub.get_visible(request.user).select_related(
                'corporation__corporation',
                'solar_system_name',
                'solar_system_name__constellation',
                'solar_system_name__constellation__region',
            ).prefetch_related('reagents__type_name', 'upgrades__type_name'))

            # Collect all solar system IDs needed for workforce transport lookups
            transport_system_ids = set()
            for h in hubs:
                wt = h.workforce_transport or {}
                for variant in [wt.get("configuration") or {}, wt.get("state") or {}]:
                    for imp in [(variant.get("import") or {}).get("sources") or []]:
                        for s in imp:
                            transport_system_ids.add(s.get("solar_system_id"))
                    exp = variant.get("export") or {}
                    if exp.get("solar_system_id"):
                        transport_system_ids.add(exp["solar_system_id"])

            transport_system_ids.discard(None)
            system_names = {
                s.id: s.name
                for s in SolarSystem.objects.filter(id__in=transport_system_ids)
            }

            output = []
            for h in hubs:
                reagents = []
                for r in h.reagents.all():
                    reagents.append({
                        "name": r.type_name.name if r.type_name else "Unknown",
                        "type_id": r.type_name.id if r.type_name else None,
                        "amount": r.amount,
                        "burning_per_hour": r.burning_per_hour,
                    })

                upgrades = []
                for u in h.upgrades.all():
                    upgrades.append({
                        "name": u.type_name.name if u.type_name else "Unknown",
                        "type_id": u.type_name.id if u.type_name else None,
                        "power_state": u.power_state,
                    })

                system = h.solar_system_name
                const_obj = system.constellation if system else None
                region_obj = const_obj.region if const_obj else None
                location = {"id": system.id if system else None,
                            "name": system.name if system else "Unknown"}
                constellation = {"id": const_obj.id if const_obj else None,
                                 "name": const_obj.name if const_obj else "Unknown"}
                region = {"id": region_obj.id if region_obj else None,
                          "name": region_obj.name if region_obj else "Unknown"}

                _h = {
                    "hub_id": h.hub_id,
                    "owner": {
                        "corporation_id": h.corporation.corporation.corporation_id,
                        "corporation_name": h.corporation.corporation.corporation_name,
                    },
                    "location": location,
                    "constellation": constellation,
                    "region": region,
                    "power_allocated": h.power_allocated,
                    "power_available": h.power_available,
                    "workforce_allocated": h.workforce_allocated,
                    "workforce_available": h.workforce_available,
                    "reagent_last_updated": h.reagent_last_updated,
                    "reagents": reagents,
                    "upgrades": upgrades,
                    "workforce_transport": _parse_workforce_transport(h.workforce_transport, system_names),
                }
                output.append(_h)
            return output
