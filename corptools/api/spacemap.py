# Standard Library
import logging

# Third Party
from eve_sde.models import Region, SolarSystem, Stargate

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

logger = get_extension_logger(__name__)

# EVE's SDE bakes space type into the solar system id range rather than a
# flag: wormhole systems are 31_000_000-31_999_999 and Abyssal Deadspace
# systems are 32_000_000-32_999_999 (see eve_sde.models.map.SolarSystem's
# is_wh_space/is_abyssal_deadspace properties) - both ranges are contiguous
# and nothing above them is "known space", so a single lower bound excludes
# both. Pochven (region 10000070) is NOT in this range and stays included -
# it's normal-space, just Triglavian-controlled.
WORMHOLE_AND_ABYSSAL_SYSTEM_ID_START = 31_000_000


def _exclude_wh_and_abyssal(queryset):
    return queryset.exclude(id__gte=WORMHOLE_AND_ABYSSAL_SYSTEM_ID_START)


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


def build_base_map_payload(anchor_system_ids, extra_system_ids=frozenset()) -> dict:
    """Build the generic {regions, systems, edges} map payload shared by every
    space-map feature (sovereignty map, activity map, ...).

    anchor_system_ids=None loads the whole known-space map (every region and
    every solar system) - used by features that want a full backdrop with a
    sparse data overlay. Otherwise it's a set of solar_system ids whose
    *regions* define the map's extent (every system in those regions is
    included, not just the anchors themselves) - this is the sovereignty
    map's "just the regions we care about" behaviour.

    extra_system_ids pulls in systems outside those regions (e.g. workforce
    transport / jump bridge endpoints) as "external" systems, same as today.
    """
    if anchor_system_ids is None:
        base_systems = list(
            _exclude_wh_and_abyssal(SolarSystem.objects.all())
            .select_related('constellation')
        )
        region_ids = {
            s.constellation.region_id for s in base_systems if s.constellation}
    else:
        region_ids = {
            s.constellation.region_id
            for s in SolarSystem.objects.filter(id__in=anchor_system_ids).select_related('constellation')
            if s.constellation
        }
        base_systems = list(
            _exclude_wh_and_abyssal(
                SolarSystem.objects.filter(
                    constellation__region_id__in=region_ids)
            ).select_related('constellation')
        )
    base_system_ids = {s.id for s in base_systems}

    edge_rows = Stargate.objects.filter(
        solar_system_id__in=base_system_ids,
        destination_id__in=base_system_ids,
    ).values_list('solar_system_id', 'destination_id')
    edges = {tuple(sorted(pair)) for pair in edge_rows if pair[0] != pair[1]}

    external_ids = set(extra_system_ids) - base_system_ids
    external_systems = list(
        _exclude_wh_and_abyssal(
            SolarSystem.objects.filter(id__in=external_ids))
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
            "external": s.id not in base_system_ids,
        })

    regions_out = list(Region.objects.filter(
        id__in=region_ids).values('id', 'name'))

    return {
        "regions": regions_out,
        "systems": systems_out,
        "edges": [{"source": a, "target": b} for a, b in edges],
    }
