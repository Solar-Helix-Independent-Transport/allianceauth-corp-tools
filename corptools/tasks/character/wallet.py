# Third Party
from celery import chain as Chain
from celery import shared_task
from eve_sde.models import ItemType, TypeDogma

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
from ..utils import esi_error_retry, no_fail_chain, rate_limited_task

logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
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
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_transactions"
)
@no_fail_chain
@esi_error_retry
def update_char_transactions(self, character_id, force_refresh=False, chain=[]):
    return update_character_transactions(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_orders"
)
@no_fail_chain
@esi_error_retry
def update_char_orders(self, character_id, force_refresh=False, chain=[]):
    return update_character_orders(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
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
@rate_limited_task("600/15m", keys=["character_id"])
@esi_error_retry
def update_char_contract_items(self, character_id, contract_id, force_refresh=False):
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

    _chain = [
        update_char_contract_items.si(
            character_id, contract_id, force_refresh=force_refresh)
        for contract_id in ids
    ]
    Chain(_chain).apply_async(priority=8)

    return "Completed Contracts for: %s" % str(character_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"keys": ["character_id", "entry_id"]},
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

    bounties = []
    logger.debug(f"Found {entry.reason}")

    for bty in entry.reason.split(","):
        b = bty.split(":")
        ship_type = ItemType.objects.get(id=b[0].strip())
        ship_dogma = TypeDogma.objects.filter(
            item_type__id=ship_type.id,
            dogma_attribute_id=481
        ).first()
        bounties.append({
            "msg": f"{b[1].strip()}x {ship_type.name} @ {ship_dogma.value:,.0f} ISK",
            "type_id": ship_type.id,
            "qty": b[1].strip()
        })

    msg = "\n".join([b["msg"] for b in bounties])
    event = CharacterBountyEvent.objects.create(entry=entry, message=msg)
    for b in bounties:
        CharacterBountyStat.objects.create(
            event=event,
            type_name_id=b["type_id"],
            qty=b["qty"]
        )
    entry.processed = True
    entry.save()

    logger.info(f"Completed {character_id} - {entry_id}\n{event.message}")


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
