# Standard Library
import logging
from typing import List

# Third Party
from eve_sde.models import Region, SolarSystem, Stargate
from ninja import NinjaAPI

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools import models

logger = get_extension_logger(__name__)


def _has_sov_perms(user) -> bool:
    return (
        user.has_perm('corptools.own_corp_manager')
        | user.has_perm('corptools.alliance_corp_manager')
        | user.has_perm('corptools.state_corp_manager')
        | user.has_perm('corptools.global_corp_manager')
        | user.has_perm('corptools.holding_corp_structures')
    )


def _has_dash_perms(user) -> bool:
    # Deliberately the lowest bar in the app - the basic "Member Audit" grant
    # most state members already have - since this is the public read-only
    # dashboard, not the operational corp-management view.
    return user.has_perm('corptools.view_characteraudit')


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


def _transport_system_ids(hubs) -> set:
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
    return transport_system_ids


def _serialize_hub(h, system_names: dict) -> dict:
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

    return {
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


def _serialize_hub_public(h) -> dict:
    # The public dashboard variant: upgrades and hub identity only - no
    # power/workforce/reagent figures or transport routing, since that's
    # operational detail the low-permission-bar dashboard shouldn't expose.
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

    return {
        "hub_id": h.hub_id,
        "owner": {
            "corporation_id": h.corporation.corporation.corporation_id,
            "corporation_name": h.corporation.corporation.corporation_name,
        },
        "location": location,
        "constellation": constellation,
        "region": region,
        "upgrades": upgrades,
    }


def _normalize_positions(systems, x_attr: str, y_attr: str, target_span: float = 20000.0) -> dict:
    xs = [getattr(s, x_attr) for s in systems if getattr(
        s, x_attr) is not None and getattr(s, y_attr) is not None]
    ys = [getattr(s, y_attr) for s in systems if getattr(
        s, x_attr) is not None and getattr(s, y_attr) is not None]
    if not xs:
        return {}
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    span = max(max_x - min_x, max_y - min_y) or 1.0
    scale = target_span / span
    result = {}
    for s in systems:
        x_val = getattr(s, x_attr)
        y_val = getattr(s, y_attr)
        if x_val is None or y_val is None:
            continue
        result[s.id] = ((x_val - min_x) * scale, (max_y - y_val) * scale)
    return result


def _get_visible_hubs(user):
    return models.SovereigntyHub.get_visible(user).select_related(
        'corporation__corporation',
        'solar_system_name',
        'solar_system_name__constellation',
        'solar_system_name__constellation__region',
    ).prefetch_related('reagents__type_name', 'upgrades__type_name')


def _get_all_hubs():
    # Unlike _get_visible_hubs, not scoped to the requesting user's own
    # corp/alliance visibility - the public dashboard is a single alliance-
    # wide sovereignty overview, not a per-viewer filtered one.
    return models.SovereigntyHub.objects.all().select_related(
        'corporation__corporation',
        'solar_system_name',
        'solar_system_name__constellation',
        'solar_system_name__constellation__region',
    ).prefetch_related('upgrades__type_name')


def _build_sov_map_payload(hubs, serialize_hub, transport_system_ids=frozenset()) -> dict:
    region_ids = {
        h.solar_system_name.constellation.region_id
        for h in hubs
        if h.solar_system_name and h.solar_system_name.constellation
    }

    base_systems = list(
        SolarSystem.objects.filter(constellation__region_id__in=region_ids)
        .select_related('constellation')
    )
    base_system_ids = {s.id for s in base_systems}

    edge_rows = Stargate.objects.filter(
        solar_system_id__in=base_system_ids,
        destination_id__in=base_system_ids,
    ).values_list('solar_system_id', 'destination_id')
    edges = {tuple(sorted(pair)) for pair in edge_rows if pair[0] != pair[1]}

    external_ids = transport_system_ids - base_system_ids
    external_systems = list(
        SolarSystem.objects.filter(id__in=external_ids)
        .select_related('constellation')
    ) if external_ids else []

    all_systems = base_systems + external_systems
    # Two independent layouts: the SDE's precomputed position2D (a
    # manually laid-out, non-spatially-accurate map projection) and
    # the real universe coordinates (X/Z - EVE's galaxy is arranged
    # flat on that plane, Y being the vertical axis). Both are sent
    # so the frontend can toggle between them instantly, with no
    # extra round trip.
    positions_2d = _normalize_positions(all_systems, 'x_2d', 'y_2d')
    positions_real = _normalize_positions(all_systems, 'x', 'z')

    hub_system_ids = {h.solar_system_id for h in hubs}

    systems_out = []
    for s in all_systems:
        p2d = positions_2d.get(s.id)
        preal = positions_real.get(s.id)
        if p2d is None and preal is None:
            continue
        systems_out.append({
            "id": s.id,
            "name": s.name,
            "region_id": s.constellation.region_id if s.constellation else None,
            "constellation_id": s.constellation_id,
            "x_2d": p2d[0] if p2d else None,
            "y_2d": p2d[1] if p2d else None,
            "x_real": preal[0] if preal else None,
            "y_real": preal[1] if preal else None,
            "security_status": s.security_status,
            "security_class": s.security_class,
            "is_hub": s.id in hub_system_ids,
            "external": s.id not in base_system_ids,
        })

    regions_out = list(Region.objects.filter(
        id__in=region_ids).values('id', 'name'))

    return {
        "regions": regions_out,
        "systems": systems_out,
        "edges": [{"source": a, "target": b} for a, b in edges],
        "hubs": [serialize_hub(h) for h in hubs],
    }


class SovereigntyApiEndpoints:

    tags = ["Sovereignty"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corp/sovhubs",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_visible_sovhubs(request):
            if not _has_sov_perms(request.user):
                logger.error(
                    f"Permission Denied for {request.user} to view sovereignty hubs!")
                return 403, "Permission Denied!"

            hubs = list(_get_visible_hubs(request.user))

            transport_system_ids = _transport_system_ids(hubs)
            system_names = {
                s.id: s.name
                for s in SolarSystem.objects.filter(id__in=transport_system_ids)
            }

            return [_serialize_hub(h, system_names) for h in hubs]

        @api.get(
            "corp/sovhubs/map",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_sov_map(request):
            if not _has_sov_perms(request.user):
                logger.error(
                    f"Permission Denied for {request.user} to view the sovereignty map!")
                return 403, "Permission Denied!"

            hubs = list(_get_visible_hubs(request.user))

            transport_system_ids = _transport_system_ids(hubs)
            system_names = {
                s.id: s.name
                for s in SolarSystem.objects.filter(id__in=transport_system_ids)
            }

            return _build_sov_map_payload(
                hubs,
                lambda h: _serialize_hub(h, system_names),
                transport_system_ids,
            )

        @api.get(
            "dash/sovmap",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_sov_map_public(request):
            if not _has_dash_perms(request.user):
                logger.error(
                    f"Permission Denied for {request.user} to view the public sovereignty dashboard!")
                return 403, "Permission Denied!"

            hubs = list(_get_all_hubs())

            # No workforce_transport in the public payload, so there's
            # nothing to plot outside the sov regions themselves - no
            # external/transport systems to resolve here, unlike get_sov_map.
            return _build_sov_map_payload(hubs, _serialize_hub_public)
