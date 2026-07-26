# Standard Library
from datetime import timedelta

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
