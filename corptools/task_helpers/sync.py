# Standard Library
from dataclasses import dataclass
from typing import Callable, Iterable, Optional

# Django
from django.db import connection, transaction
from django.db.models import Model, QuerySet

# AA Example App
from corptools.app_settings import CT_DB_BULK_CREATE_BATCH_SIZE


@dataclass
class SyncResult:
    created: int = 0
    updated: int = 0
    deleted: int = 0


def sync_rows(
    queryset: QuerySet,
    new_objs: Iterable[Model],
    key_fields: list,
    fields: list,
    merge: Optional[Callable[[Model, Model], None]] = None,
    batch_size: int = CT_DB_BULK_CREATE_BATCH_SIZE,
) -> SyncResult:
    """
    Bring the rows in `queryset` in line with `new_objs` without flushing them.

    Rows are matched on `key_fields`. Matched rows keep their pk and are only
    written when one of `fields` changed; columns not in `fields` (names,
    blueprint stats, anything filled in by a follow-up call) are never touched.
    New keys are created and stored rows with no incoming match are deleted.

    `merge(existing, incoming)` runs for every matched pair before comparing,
    and may adjust `incoming` - e.g. to keep a value ESI can't supply.

    Duplicate stored keys collapse to the oldest row; duplicate incoming keys
    take the last one.
    """
    model = queryset.model
    attnames = [model._meta.get_field(f).attname for f in fields]
    key_attnames = [model._meta.get_field(f).attname for f in key_fields]

    def key_of(obj):
        return tuple(getattr(obj, a) for a in key_attnames)

    incoming = {key_of(o): o for o in new_objs}

    result = SyncResult()
    with transaction.atomic():
        existing = {}
        stale_pks = []
        for row in queryset.only("pk", *key_fields, *fields).order_by("pk"):
            k = key_of(row)
            if k in existing or k not in incoming:
                stale_pks.append(row.pk)
            else:
                existing[k] = row

        to_create = []
        to_update = []
        for k, obj in incoming.items():
            row = existing.get(k)
            if row is None:
                to_create.append(obj)
                continue
            if merge:
                merge(row, obj)
            if any(getattr(row, a) != getattr(obj, a) for a in attnames):
                obj.pk = row.pk
                to_update.append(obj)

        for i in range(0, len(stale_pks), batch_size):
            model.objects.filter(pk__in=stale_pks[i:i + batch_size]).delete()
        result.deleted = len(stale_pks)

        if to_update:
            # Upsert on the pk rather than bulk_update: bulk_update's CASE WHEN
            # per field was slower than the old flush + recreate once more than
            # a few thousand rows changed. Only `fields` are written on conflict.
            # MySQL/MariaDB refuse unique_fields (they match the pk anyway), the
            # SQLite test DB requires it.
            conflict_target = (
                {"unique_fields": [model._meta.pk.name]}
                if connection.features.supports_update_conflicts_with_target
                else {}
            )
            model.objects.bulk_create(
                to_update,
                update_conflicts=True,
                update_fields=fields,
                batch_size=batch_size,
                **conflict_target
            )
            result.updated = len(to_update)

        if to_create:
            model.objects.bulk_create(to_create, batch_size=batch_size)
            result.created = len(to_create)

    return result


# Columns that come straight off the /assets/ endpoint. name, blueprint stats
# and coordinates are filled in by follow-up calls and are left alone.
ASSET_SYNC_FIELDS = [
    "blueprint_copy",
    "singleton",
    "location_flag",
    "location_id",
    "location_type",
    "quantity",
    "type_id",
    "type_name",
    "location_name",
    "name",
]


def sync_assets(queryset: QuerySet, items: Iterable[Model], coordinate_model) -> SyncResult:
    """
    sync_rows for CharacterAsset/CorpAsset keyed on item_id.

    ESI only gives a location_name when the location is already known, so a
    None for an asset that hasn't moved keeps what's stored (e.g. the managed
    corp hangar locations). Assets that moved lose their coordinates so the
    coordinate fetch writes fresh ones. The custom name comes from a later
    call so it's kept, unless the item was repackaged and can't have one.
    """
    moved_pks = []

    def merge(existing, incoming):
        if incoming.singleton:
            incoming.name = existing.name
        if (existing.location_id, existing.location_flag) != (
                incoming.location_id, incoming.location_flag):
            moved_pks.append(existing.pk)
        elif incoming.location_name_id is None:
            incoming.location_name_id = existing.location_name_id

    with transaction.atomic():
        result = sync_rows(
            queryset, items, key_fields=["item_id"],
            fields=ASSET_SYNC_FIELDS, merge=merge)
        for i in range(0, len(moved_pks), CT_DB_BULK_CREATE_BATCH_SIZE):
            coordinate_model.objects.filter(
                item_id__in=moved_pks[i:i + CT_DB_BULK_CREATE_BATCH_SIZE]
            ).delete()
    return result


def upsert_coordinates(coordinate_model, objs: Iterable[Model]):
    """
    Write asset coordinates, overwriting stored ones. Rows now outlive a
    refresh, so something re-deployed within the same system would otherwise
    keep its first position forever.
    """
    conflict_target = (
        {"unique_fields": ["item"]}
        if connection.features.supports_update_conflicts_with_target
        else {}
    )
    coordinate_model.objects.bulk_create(
        objs,
        update_conflicts=True,
        update_fields=["x", "y", "z"],
        batch_size=CT_DB_BULK_CREATE_BATCH_SIZE,
        **conflict_target
    )
