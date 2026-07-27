# Standard Library
from datetime import timedelta

# Third Party
from eve_sde.models import Planet

# Django
from django.db.models import Count, F, Q, Sum
from django.utils import timezone

# AA Example App
from corptools import models
from corptools.api.spacemap import build_base_map_payload

# Mining and ratting are date-bound activity logs (unlike assets, which are
# a current-state snapshot with no date field at all) - cap them to a
# rolling window so the map reflects recent activity, not a character's
# entire multi-year history.
LOOKBACK_DAYS = 90

# Bounty payouts are the only wallet ref_type ESI attaches a solar system to -
# context_id_type="system_id" with context_id being that system's id (see the
# 'system_id' choice on WalletJournalEntry.context_id_type,
# corptools/models/wallets.py:25-29). Every other ref_type either has no
# context or a non-system one (structure/station/market transaction/...).
# Confirmed against real character wallet data: every "bounty_prizes" entry
# carries context_id_type="system_id" resolving to a real SolarSystem.
RATTING_REF_TYPE = "bounty_prizes"
SYSTEM_CONTEXT_TYPE = "system_id"


def asset_counts_by_system(asset_qs, extra_filter: Q = None) -> dict:
    """asset_qs is any already-scoped Asset queryset (CharacterAsset or
    CorpAsset - both share the abstract Asset model's location_name/quantity/
    type_name fields), so this works the same regardless of whether the
    caller is scoping to a character's own alts or a whole corporation.
    """
    qs = asset_qs.filter(location_name__system__isnull=False)
    if extra_filter is not None:
        qs = qs.filter(extra_filter)
    rows = qs.values('location_name__system').annotate(
        count=Count('id'),
        quantity=Sum('quantity'),
    )
    return {r['location_name__system']: r for r in rows}


def build_asset_map_payload(asset_qs, extra_filter: Q = None) -> dict:
    by_system = asset_counts_by_system(asset_qs, extra_filter)

    # Always the whole known-space map, not just the systems that have
    # matching assets in them - the map is meant to show sparse activity
    # against the full backdrop, not zoom in on only what's populated.
    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["quantity"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def mining_volume_by_system(characters) -> dict:
    cutoff = (timezone.now() - timedelta(days=LOOKBACK_DAYS)).date()
    rows = models.CharacterMiningLedger.objects.filter(
        character__character__in=characters,
        date__gte=cutoff,
    ).values('system').annotate(
        volume=Sum(F('quantity') * F('type_name__volume')),
        quantity=Sum('quantity'),
        entries=Count('id'),
    )
    return {r['system']: r for r in rows}


def build_mining_map_payload(characters) -> dict:
    by_system = mining_volume_by_system(characters)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["volume"] or 0,
            "count": row["entries"],
            "quantity": row["quantity"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def current_location_counts_by_system(characters) -> dict:
    """CharacterLocation is a live current-state snapshot (kept up to date by
    the location-tracking tasks in tasks/locations.py), not a historical log
    - no time window, same reasoning as assets. character is a OneToOneField
    here, so this is at most one row per character."""
    rows = models.CharacterLocation.objects.filter(
        character__character__in=characters,
        current_location__system__isnull=False,
    ).values('current_location__system').annotate(count=Count('id'))
    return {r['current_location__system']: r for r in rows}


def build_current_location_map_payload(characters) -> dict:
    by_system = current_location_counts_by_system(characters)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def home_clone_counts_by_system(characters) -> dict:
    """Clone (home clone) is also a current-state snapshot - one per
    character (OneToOneField)."""
    rows = models.Clone.objects.filter(
        character__character__in=characters,
        location_name__system__isnull=False,
    ).values('location_name__system').annotate(count=Count('id'))
    return {r['location_name__system']: r for r in rows}


def build_home_clone_map_payload(characters) -> dict:
    by_system = home_clone_counts_by_system(characters)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def jump_clone_counts_by_system(characters) -> dict:
    """Unlike the home clone, JumpClone.character is a plain FK - a
    character can have several jump clones, so this can have multiple rows
    per character."""
    rows = models.JumpClone.objects.filter(
        character__character__in=characters,
        location_name__system__isnull=False,
    ).values('location_name__system').annotate(count=Count('id'))
    return {r['location_name__system']: r for r in rows}


def build_jump_clone_map_payload(characters) -> dict:
    by_system = jump_clone_counts_by_system(characters)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def structure_counts_by_system(structure_qs) -> dict:
    """structure_qs is any already-scoped Structure queryset. Structures are
    corporation property (there's no character-owned equivalent), so this is
    only ever used from the corporation activity map."""
    rows = structure_qs.filter(system_name__isnull=False).values(
        'system_name'
    ).annotate(
        count=Count('id'),
    )
    return {r['system_name']: r for r in rows}


def build_structure_map_payload(structure_qs) -> dict:
    by_system = structure_counts_by_system(structure_qs)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def poco_counts_by_system(poco_qs) -> dict:
    """poco_qs is any already-scoped Poco queryset. Like structures, POCOs
    are corporation property with no character-owned equivalent."""
    rows = poco_qs.filter(system_name__isnull=False).values(
        'system_name'
    ).annotate(
        count=Count('id'),
    )
    return {r['system_name']: r for r in rows}


def build_poco_map_payload(poco_qs) -> dict:
    by_system = poco_counts_by_system(poco_qs)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


# ESI's contract `type` field: item_exchange/auction are trade contracts
# (one location - where the item sits), courier is a pickup-and-deliver
# contract (two meaningful locations). "loan" exists too but doesn't fit
# either grouping cleanly, so it's only ever counted in the unfiltered
# "everything" contracts view, same way ships/capitals don't cover every
# asset either.
SALES_CONTRACT_TYPES = ["item_exchange", "auction"]
LOGISTICS_CONTRACT_TYPES = ["courier"]


def contract_counts_by_system(contract_qs, extra_filter: Q = None) -> dict:
    """contract_qs is any already-scoped Contract queryset (Contract or
    CorporateContract - both share start_location_name/end_location_name/
    date_issued). A contract represents activity at both its start and end
    location, so both endpoints are counted rather than picking one -
    a single contract can contribute to two systems (or two counts in the
    same system, if start and end happen to match). For contract types with
    no real "end" (item_exchange/auction), end_location_name is simply never
    populated, so only the start side ever contributes for those - no
    special-casing needed here beyond the type filter itself."""
    cutoff = timezone.now() - timedelta(days=LOOKBACK_DAYS)
    qs = contract_qs.filter(date_issued__gte=cutoff)
    if extra_filter is not None:
        qs = qs.filter(extra_filter)

    by_system: dict = {}
    for location_field in ('start_location_name__system', 'end_location_name__system'):
        rows = qs.filter(**{f"{location_field}__isnull": False}).values(
            location_field
        ).annotate(count=Count('id'))
        for row in rows:
            system_id = row[location_field]
            by_system[system_id] = by_system.get(system_id, 0) + row['count']

    return {
        system_id: {"count": count}
        for system_id, count in by_system.items()
    }


def build_contract_map_payload(contract_qs, extra_filter: Q = None) -> dict:
    by_system = contract_counts_by_system(contract_qs, extra_filter)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def industry_job_counts_by_system(job_qs) -> dict:
    """job_qs is any already-scoped IndustryJob queryset (CharacterIndustryJob
    or CorporationIndustryJob - both share facility_id/start_date). Unlike
    every other source here, facility_id has no FK to EveLocation at all, so
    this resolves it with an explicit lookup instead of a queryset join.
    Every activity type (manufacturing, research, invention, reactions, ...)
    is combined into one count - the map doesn't distinguish between them.
    """
    cutoff = timezone.now() - timedelta(days=LOOKBACK_DAYS)
    facility_counts = list(
        job_qs.filter(start_date__gte=cutoff).values('facility_id').annotate(
            count=Count('id')
        )
    )

    facility_to_system = dict(
        models.EveLocation.objects.filter(
            location_id__in=[row['facility_id'] for row in facility_counts],
            system__isnull=False,
        ).values_list('location_id', 'system')
    )

    by_system: dict = {}
    for row in facility_counts:
        system_id = facility_to_system.get(row['facility_id'])
        if system_id is None:
            continue
        by_system[system_id] = by_system.get(system_id, 0) + row['count']

    return {
        system_id: {"count": count}
        for system_id, count in by_system.items()
    }


def build_industry_map_payload(job_qs) -> dict:
    by_system = industry_job_counts_by_system(job_qs)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def ratting_isk_by_system(characters) -> dict:
    cutoff = timezone.now() - timedelta(days=LOOKBACK_DAYS)
    rows = models.CharacterWalletJournalEntry.objects.filter(
        character__character__in=characters,
        ref_type=RATTING_REF_TYPE,
        context_id_type=SYSTEM_CONTEXT_TYPE,
        context_id__isnull=False,
        date__gte=cutoff,
    ).values('context_id').annotate(
        isk=Sum('amount'),
        entries=Count('id'),
    )
    return {r['context_id']: r for r in rows}


def build_ratting_map_payload(characters) -> dict:
    by_system = ratting_isk_by_system(characters)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": float(row["isk"] or 0),
            "count": row["entries"],
            "quantity": float(row["isk"] or 0),
        }
        for system_id, row in by_system.items()
    ]
    return payload


# Confirmed against real wallet data (2026-07-27): all three PI-related
# ref_types carry context_id_type="planet_id", unlike bounty_prizes above -
# context_id here is a planet, not a system, so it needs an extra lookup
# through eve_sde.Planet.solar_system to get a system_id. construction is a
# personal colony-upkeep cost (confirmed absent from the corp wallet
# entirely); import/export tax is paid by whoever uses a customs office, corp
# or not, so it appears in both character and corporation wallets.
PI_REF_TYPES = ["planetary_construction",
                "planetary_import_tax", "planetary_export_tax"]
POCO_REVENUE_REF_TYPES = ["planetary_import_tax", "planetary_export_tax"]
PLANET_CONTEXT_TYPE = "planet_id"


def _planet_journal_isk_by_system(journal_qs, ref_types) -> dict:
    cutoff = timezone.now() - timedelta(days=LOOKBACK_DAYS)
    rows = list(
        journal_qs.filter(
            ref_type__in=ref_types,
            context_id_type=PLANET_CONTEXT_TYPE,
            context_id__isnull=False,
            date__gte=cutoff,
        ).values('context_id').annotate(
            isk=Sum('amount'),
            entries=Count('id'),
        )
    )

    planet_to_system = dict(
        Planet.objects.filter(
            id__in=[row['context_id'] for row in rows],
            solar_system__isnull=False,
        ).values_list('id', 'solar_system_id')
    )

    by_system: dict = {}
    for row in rows:
        system_id = planet_to_system.get(row['context_id'])
        if system_id is None:
            continue
        entry = by_system.setdefault(system_id, {"isk": 0, "entries": 0})
        entry["isk"] += row['isk'] or 0
        entry["entries"] += row['entries']
    return by_system


def pi_activity_isk_by_system(characters) -> dict:
    """Personal PI activity (colony upkeep + customs office tax paid),
    summed across the given characters. amount is negative for all three of
    these ref_types from the paying character's side, so this reports the
    absolute ISK spent, not raw signed amount."""
    by_system = _planet_journal_isk_by_system(
        models.CharacterWalletJournalEntry.objects.filter(
            character__character__in=characters),
        PI_REF_TYPES,
    )
    return {
        system_id: {"isk": abs(row["isk"]), "entries": row["entries"]}
        for system_id, row in by_system.items()
    }


def build_pi_activity_map_payload(characters) -> dict:
    by_system = pi_activity_isk_by_system(characters)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": float(row["isk"] or 0),
            "count": row["entries"],
            "quantity": float(row["isk"] or 0),
        }
        for system_id, row in by_system.items()
    ]
    return payload


def poco_revenue_isk_by_system(wallet_qs) -> dict:
    """wallet_qs is an already-scoped CorporationWalletJournalEntry queryset.
    This is a genuinely different metric from the "pocos" location source -
    it's how much tax the corp's customs offices have actually earned, not
    just where they sit. planetary_construction is deliberately excluded
    here (confirmed absent from the corp wallet - it's a personal expense of
    the colony owner, not corp income)."""
    return _planet_journal_isk_by_system(wallet_qs, POCO_REVENUE_REF_TYPES)


def build_poco_revenue_map_payload(wallet_qs) -> dict:
    by_system = poco_revenue_isk_by_system(wallet_qs)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": float(row["isk"] or 0),
            "count": row["entries"],
            "quantity": float(row["isk"] or 0),
        }
        for system_id, row in by_system.items()
    ]
    return payload


def starbase_counts_by_system(starbase_qs) -> dict:
    """starbase_qs is any already-scoped Starbase queryset. Starbases (POS
    towers) are corporation property, like Structure/Poco - no character
    equivalent, and a direct system FK just like those two."""
    rows = starbase_qs.filter(system__isnull=False).values(
        'system'
    ).annotate(
        count=Count('id'),
    )
    return {r['system']: r for r in rows}


def build_starbase_map_payload(starbase_qs) -> dict:
    by_system = starbase_counts_by_system(starbase_qs)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def market_order_counts_by_system(order_qs) -> dict:
    """order_qs is any already-scoped MarketOrder queryset (CharacterMarketOrder
    or CorporationMarketOrder). Only active orders count - like assets, this
    is a current-state snapshot, not a historical log, so counting cancelled/
    expired orders forever would just accumulate meaninglessly."""
    rows = order_qs.filter(
        state='active',
        location_name__system__isnull=False,
    ).values('location_name__system').annotate(
        # MarketOrder's primary key is order_id, not the usual implicit id -
        # Count('pk') works regardless of what the PK field is actually called.
        count=Count('pk'),
    )
    return {r['location_name__system']: r for r in rows}


def build_market_order_map_payload(order_qs) -> dict:
    by_system = market_order_counts_by_system(order_qs)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def mercenary_den_counts_by_system(den_qs) -> dict:
    """den_qs is any already-scoped CharacterMercenaryDen queryset (there's
    no corporation-owned den model - mercenary dens are always personal).
    planet_name is a direct FK to eve_sde.Planet, itself with a direct FK to
    SolarSystem, so this is a plain queryset join - no manual lookup needed,
    unlike the wallet-derived PI sources above."""
    rows = den_qs.filter(planet_name__solar_system__isnull=False).values(
        'planet_name__solar_system'
    ).annotate(
        count=Count('id'),
    )
    return {r['planet_name__solar_system']: r for r in rows}


def build_mercenary_den_map_payload(den_qs) -> dict:
    by_system = mercenary_den_counts_by_system(den_qs)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload


def mercenary_tactical_operation_counts_by_system(characters) -> dict:
    """CharacterMercenaryTacticalOperation has no location field of its own -
    only mercenary_den_id, a raw int matching CharacterMercenaryDen.den_id
    (also a raw int, not an FK - two independent per-character IDs, not a
    real database relationship) - so this needs an explicit den -> planet ->
    system lookup, the same two-step pattern used for industry jobs/PI."""
    op_counts = list(
        models.CharacterMercenaryTacticalOperation.objects.filter(
            character__character__in=characters
        ).values('mercenary_den_id').annotate(count=Count('id'))
    )

    den_to_system = dict(
        models.CharacterMercenaryDen.objects.filter(
            character__character__in=characters,
            den_id__in=[row['mercenary_den_id'] for row in op_counts],
            planet_name__solar_system__isnull=False,
        ).values_list('den_id', 'planet_name__solar_system')
    )

    by_system: dict = {}
    for row in op_counts:
        system_id = den_to_system.get(row['mercenary_den_id'])
        if system_id is None:
            continue
        by_system[system_id] = by_system.get(system_id, 0) + row['count']

    return {
        system_id: {"count": count}
        for system_id, count in by_system.items()
    }


def build_mercenary_tactical_operation_map_payload(characters) -> dict:
    by_system = mercenary_tactical_operation_counts_by_system(characters)

    payload = build_base_map_payload(anchor_system_ids=None)
    payload["values"] = [
        {
            "system_id": system_id,
            "value": row["count"],
            "count": row["count"],
            "quantity": row["count"],
        }
        for system_id, row in by_system.items()
    ]
    return payload
