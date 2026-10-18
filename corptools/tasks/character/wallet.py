# Third Party
from celery import shared_task
from eve_sde.models import ItemType, TypeDogma

# Django
from django.db import transaction

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ...models import (
    CharacterBountyEvent,
    CharacterBountyStat,
    CharacterWalletJournalEntry,
)
from ...task_helpers.char_tasks import (
    update_character_contract_items,
    update_character_contracts,
    update_character_order_history,
    update_character_orders,
    update_character_transactions,
    update_character_wallet,
)
from ..utils import (
    enqueue_next_task,
    esi_error_retry,
    no_fail_chain,
    rate_limited_task,
)

logger = get_extension_logger(__name__)

# Dogma attribute holding an NPC's bounty value
BOUNTY_DOGMA_ATTRIBUTE_ID = 481


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id"]},
    name="corptools.tasks.update_char_wallet"
)
@no_fail_chain
@esi_error_retry
def update_char_wallet(self, character_id, force_refresh=False, chain=[]):
    msg = update_character_wallet(character_id, force_refresh=force_refresh)

    for entry in CharacterWalletJournalEntry.objects.filter(
        character__character__character_id=character_id,
        ref_type="bounty_prizes",
        processed=False
    ):
        update_char_wallet_bounty_text.apply_async(
            args=[character_id, entry.entry_id],
            priority=9
        )

    return msg


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id"]},
    name="corptools.tasks.update_char_transactions"
)
@no_fail_chain
@esi_error_retry
def update_char_transactions(self, character_id, force_refresh=False, chain=[]):
    return update_character_transactions(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id"]},
    name="corptools.tasks.update_char_orders"
)
@no_fail_chain
@esi_error_retry
def update_char_orders(self, character_id, force_refresh=False, chain=[]):
    return update_character_orders(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id"]},
    name="corptools.tasks.update_char_order_history"
)
@no_fail_chain
@esi_error_retry
def update_char_order_history(self, character_id, force_refresh=False, chain=[]):
    return update_character_order_history(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id", "contract_id"]},
    name="corptools.tasks.update_char_contract_items"
)
@no_fail_chain
@rate_limited_task("600/15m", keys=["character_id"])
@esi_error_retry
def update_char_contract_items(self, character_id, contract_id, force_refresh=False, chain=[]):
    return update_character_contract_items(
        character_id,
        contract_id,
        force_refresh=force_refresh
    )


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id"]},
    name="corptools.tasks.update_char_contracts"
)
@no_fail_chain
@esi_error_retry
def update_char_contracts(self, character_id, force_refresh=False, chain=[]):
    _, ids = update_character_contracts(
        character_id, force_refresh=force_refresh)

    # Separate chain from the one this task is part of, so the character's
    # remaining updates aren't stuck behind a long run of contract items.
    enqueue_next_task([
        update_char_contract_items.si(
            character_id, contract_id, force_refresh=force_refresh
        ).set(priority=8)
        for contract_id in ids
    ])

    return "Completed Contracts for: %s" % str(character_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id", "entry_id"]},
    name="corptools.tasks.translate_char_wallet_bounty_text"
)
def update_char_wallet_bounty_text(self, character_id, entry_id, force_refresh=False):
    logger.info(f"Translating {character_id} - {entry_id}")
    try:
        entry = CharacterWalletJournalEntry.objects.get(
            character__character__character_id=character_id,
            entry_id=entry_id,
            processed=False,
            ref_type="bounty_prizes"
        )
    except CharacterWalletJournalEntry.DoesNotExist:
        return f"Unable to find {character_id} - {entry_id}"
    except CharacterWalletJournalEntry.MultipleObjectsReturned:
        _clear_dupes(character_id, entry_id)
        self.retry()

    logger.debug(f"Found {entry.reason}")

    # Anything we can't translate is skipped rather than raised: a raise
    # leaves the entry unprocessed, and every wallet update re-queues it.
    bounties = _parse_bounty_reason(entry.reason)
    type_ids = [type_id for type_id, _ in bounties]
    types = {t.id: t for t in ItemType.objects.filter(id__in=type_ids)}
    bounty_values = dict(
        TypeDogma.objects.filter(
            item_type_id__in=type_ids,
            dogma_attribute_id=BOUNTY_DOGMA_ATTRIBUTE_ID
        ).values_list("item_type_id", "value")
    )

    lines = []
    stats = []
    for type_id, qty in bounties:
        item_type = types.get(type_id)
        line = f"{qty}x {item_type.name if item_type else f'Unknown Type {type_id}'}"
        if bounty_values.get(type_id) is not None:
            line += f" @ {bounty_values[type_id]:,.0f} ISK"
        lines.append(line)
        if item_type:
            stats.append((type_id, qty))

    missing = set(type_ids) - set(types)
    if missing:
        logger.warning(
            f"Bounty entry {entry_id} references types missing from the SDE: {sorted(missing)}")

    with transaction.atomic():
        # A run that died part way before this was atomic can have left an
        # event behind, which would make create() fail on every retry.
        CharacterBountyEvent.objects.filter(entry=entry).delete()
        event = CharacterBountyEvent.objects.create(
            entry=entry, message="\n".join(lines))
        CharacterBountyStat.objects.bulk_create([
            CharacterBountyStat(event=event, type_name_id=type_id, qty=qty)
            for type_id, qty in stats
        ])
        entry.processed = True
        entry.save(update_fields=["processed"])

    logger.info(f"Completed {character_id} - {entry_id}\n{event.message}")


def _parse_bounty_reason(reason):
    """`"type_id: qty,type_id: qty"` -> [(type_id, qty)], skipping malformed parts."""
    bounties = []
    for part in (reason or "").split(","):
        bits = part.split(":")
        if len(bits) != 2:
            continue
        try:
            bounties.append((int(bits[0].strip()), int(bits[1].strip())))
        except ValueError:
            continue
    return bounties


def _clear_dupes(character_id, entry_id):
    logger.warning(f"Cleaning up `{entry_id}` duplicates in wallet.")
    dupes = list(
        CharacterWalletJournalEntry.objects.filter(
            ref_type="bounty_prizes",
            character__character__character_id=character_id,
            entry_id=entry_id
        )
    )
    dupes.pop()  # keep one
    logger.warning(f"Found `{len(dupes)}` duplicates.")
    for dupe in dupes:
        dupe.delete()
