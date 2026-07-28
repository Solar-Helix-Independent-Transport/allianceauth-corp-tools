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
from corptools.api.spacemap import build_base_map_payload

logger = get_extension_logger(__name__)


def _has_sov_perms(user) -> bool:
    return (
        user.has_perm('corptools.own_corp_manager')
        | user.has_perm('corptools.alliance_corp_manager')
        | user.has_perm('corptools.state_corp_manager')
        | user.has_perm('corptools.global_corp_manager')
        | user.has_perm('corptools.show_if_director')
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


ANSIBLEX_JUMP_GATE_TYPE_ID = 35841


def _get_jump_bridge_structures(structures_qs):
    return structures_qs.filter(
        type_id=ANSIBLEX_JUMP_GATE_TYPE_ID
    ).select_related('system_name')


def _jump_bridge_edges(structures) -> set:
    # Same naming convention get_dashboard_gates (dashboards.py) parses: each
    # end of a bridge is its own Structure, named "<this system> » <other
    # system> - <bridge name>". The structure's own system_name gives us the
    # "this system" side reliably; the "other system" side is only ever a
    # name, so it needs a bulk lookup, and a link is declared once from each
    # end (two Structure rows), so the result needs deduping too.
    parsed = []
    other_names = set()
    for s in structures:
        if not s.system_name_id or not s.name:
            continue
        parts = s.name.split(" » ")
        if len(parts) < 2:
            continue
        other_name = parts[1].split(" - ")[0].strip()
        if not other_name:
            continue
        parsed.append((s.system_name_id, other_name))
        other_names.add(other_name)

    if not parsed:
        return set()

    name_to_id = {
        sys_.name: sys_.id
        for sys_ in SolarSystem.objects.filter(name__in=other_names)
    }

    edges = set()
    for from_id, other_name in parsed:
        to_id = name_to_id.get(other_name)
        if to_id is None or to_id == from_id:
            continue
        edges.add(tuple(sorted((from_id, to_id))))
    return edges


def _serialize_hub(h, system_names: dict, anarchy_dens=None) -> dict:
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
        "anarchy_dens": anarchy_dens or [],
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
        "power_allocated": None,
        "power_available": None,
        "workforce_allocated": None,
        "workforce_available": None,
        "reagent_last_updated": None,
        "reagents": [],
        "upgrades": upgrades,
        "workforce_transport": None,
        "anarchy_dens": [],
    }


# Mercenary den "anarchy" reduces the workforce available to a sovereignty
# hub in the same solar system, so a den running hot enough is a threat to
# that hub regardless of who anchored it - anything at or above this is
# flagged on the map.
ANARCHY_ALERT_THRESHOLD_PCT = 40


def _high_anarchy_dens_by_system(system_ids) -> dict:
    """solar_system_id -> list of high-anarchy den alerts anchored in that system."""
    if not system_ids:
        return {}

    dens = models.CharacterMercenaryDen.objects.filter(
        anarchy_amount__gt=ANARCHY_ALERT_THRESHOLD_PCT,
        planet_name__solar_system_id__in=system_ids,
    ).select_related(
        'planet_name__solar_system',
        'character__character',
        'type_name',
    )

    by_system = {}
    for den in dens:
        by_system.setdefault(den.planet_name.solar_system_id, []).append({
            "den_id": den.den_id,
            "anarchy_amount": den.anarchy_amount,
            "character_name": den.character.character.character_name,
            "type_name": den.type_name.name if den.type_name else "Unknown",
            "planet_name": den.planet_name.name if den.planet_name else f"Planet ID {den.planet_id}",
        })
    return by_system


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


def _build_sov_map_payload(
    hubs,
    serialize_hub,
    transport_system_ids=frozenset(),
    jump_bridge_edges=frozenset(),
    include_den_detail=True,
) -> dict:
    hub_system_ids = {h.solar_system_id for h in hubs}

    # Jump bridges routinely connect a hub region to somewhere far outside
    # any tracked sov region, so their endpoints need the same "pull in as
    # an external system" treatment as workforce-transport systems do.
    jump_bridge_system_ids = {
        sid for pair in jump_bridge_edges for sid in pair}
    extra_system_ids = transport_system_ids | jump_bridge_system_ids

    payload = build_base_map_payload(
        hub_system_ids, extra_system_ids=extra_system_ids)

    # Anarchy only disrupts the sov hub sharing its system, so only hub
    # systems need to be checked. The public/dashboard view shouldn't reveal
    # any den info at all - not even that an alert exists - so skip the
    # lookup entirely there rather than just withholding the den list.
    anarchy_by_system = (
        _high_anarchy_dens_by_system(
            hub_system_ids) if include_den_detail else {}
    )

    for s in payload["systems"]:
        anarchy_dens = anarchy_by_system.get(s["id"], [])
        s["is_hub"] = s["id"] in hub_system_ids
        s["anarchy_alert"] = len(anarchy_dens) > 0
        s["anarchy_dens"] = anarchy_dens

    payload["jump_bridges"] = [{"source": a, "target": b}
                               for a, b in jump_bridge_edges]
    payload["hubs"] = [serialize_hub(h) for h in hubs]
    return payload


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
            anarchy_by_system = _high_anarchy_dens_by_system(
                {h.solar_system_id for h in hubs}
            )

            return [
                _serialize_hub(
                    h, system_names, anarchy_by_system.get(
                        h.solar_system_id, [])
                )
                for h in hubs
            ]

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
            jump_bridge_edges = _jump_bridge_edges(
                _get_jump_bridge_structures(
                    models.Structure.get_visible(request.user))
            )

            return _build_sov_map_payload(
                hubs,
                lambda h: _serialize_hub(h, system_names),
                transport_system_ids,
                jump_bridge_edges,
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
            # Same low-sensitivity treatment as the sov hubs themselves -
            # unscoped, alliance-wide, not filtered to the viewer's own corp.
            jump_bridge_edges = _jump_bridge_edges(
                _get_jump_bridge_structures(models.Structure.objects.all())
            )

            return _build_sov_map_payload(
                hubs,
                _serialize_hub_public,
                jump_bridge_edges=jump_bridge_edges,
                include_den_detail=False,
            )
