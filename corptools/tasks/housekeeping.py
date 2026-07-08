# Third Party
from celery import shared_task

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce
from esi.openapi_clients import EsiOperation

from ..models import CharacterAudit, CharacterWalletJournalEntry, CorporationAudit
from ..providers import esi_openapi
from ..task_helpers.housekeeping_tasks import (
    purge_npc_wallet_entries,
    remove_old_notifications,
)
from ..task_helpers.wallet_export import (
    export_character_wallet_fixtures,
    export_corporation_wallet_fixtures,
)

logger = get_extension_logger(__name__)

ETAG_CLEAR_GROUPS = {
    "char_skills": {
        "label": "Character Skills & Queue",
        "operations": [
            "GetCharactersCharacterIdSkills",
            "GetCharactersCharacterIdSkillqueue",
        ],
    },
    "char_assets": {
        "label": "Character Assets",
        "operations": ["GetCharactersCharacterIdAssets"],
    },
    "char_wallets": {
        "label": "Character Wallets",
        "operations": [
            "GetCharactersCharacterIdWallet",
            "GetCharactersCharacterIdWalletJournal",
            "GetCharactersCharacterIdWalletTransactions",
            "GetCharactersCharacterIdOrders",
            "GetCharactersCharacterIdOrdersHistory",
        ],
    },
    "char_clones": {
        "label": "Character Clones & Implants",
        "operations": [
            "GetCharactersCharacterIdClones",
            "GetCharactersCharacterIdImplants",
        ],
    },
    "char_notifications": {
        "label": "Character Notifications",
        "operations": ["GetCharactersCharacterIdNotifications"],
    },
    "char_roles": {
        "label": "Character Roles & Titles",
        "operations": [
            "GetCharactersCharacterIdRoles",
            "GetCharactersCharacterIdTitles",
        ],
    },
    "char_contacts": {
        "label": "Character Contacts",
        "operations": [
            "GetCharactersCharacterIdContacts",
            "GetCharactersCharacterIdContactsLabels",
        ],
    },
    "char_mail": {
        "label": "Character Mail",
        "operations": [
            "GetCharactersCharacterIdMail",
            "GetCharactersCharacterIdMailLabels",
        ],
    },
    "char_mining": {
        "label": "Character Mining",
        "operations": ["GetCharactersCharacterIdMining"],
    },
    "char_industry": {
        "label": "Character Industry Jobs",
        "operations": ["GetCharactersCharacterIdIndustryJobs"],
    },
    "char_contracts": {
        "label": "Character Contracts",
        "operations": ["GetCharactersCharacterIdContracts"],
    },
    "corp_structures": {
        "label": "Corp Structures & Starbases",
        "operations": [
            "GetCorporationsCorporationIdStructures",
            "GetCorporationsCorporationIdStarbases",
            "GetCorporationsCorporationIdCustomsOffices",
        ],
    },
    "corp_assets": {
        "label": "Corp Assets",
        "operations": ["GetCorporationsCorporationIdAssets"],
    },
    "corp_wallets": {
        "label": "Corp Wallets",
        "operations": [
            "GetCorporationsCorporationIdWallets",
            "GetCorporationsCorporationIdWalletsDivisionJournal",
            "GetCorporationsCorporationIdWalletsDivisionTransactions",
        ],
    },
    "corp_members": {
        "label": "Corp Members",
        "operations": ["GetCorporationsCorporationIdMembertracking"],
    },
    "corp_contracts": {
        "label": "Corp Contracts",
        "operations": ["GetCorporationsCorporationIdContracts"],
    },
    "corp_industry": {
        "label": "Corp Industry Jobs",
        "operations": ["GetCorporationsCorporationIdIndustryJobs"],
    },
}


@shared_task(name="corptools.tasks.run_housekeeping")
def run_housekeeping():
    return remove_old_notifications()


@shared_task(name="corptools.tasks.clear_all_skill_caches")
def clear_all_skill_caches():
    try:
        # Third Party
        from django_redis import get_redis_connection
        _client = get_redis_connection("default")
    except (NotImplementedError, ModuleNotFoundError):
        # Django
        from django.core.cache import caches
        _client = caches['default'].get_master_client()

    keys = _client.keys(":?:SKILL_LISTS_*")
    deleted = 0
    if keys:
        deleted = _client.delete(*keys)
    return f"Deleted {deleted} skill cache keys"


@shared_task(name="corptools.tasks.clear_etags_for_operation")
def clear_etags_for_operation(group_keys: list):
    char_ids = list(CharacterAudit.objects.values_list(
        "character__character_id", flat=True))
    corp_ids = list(CorporationAudit.objects.values_list(
        "corporation__corporation_id", flat=True))

    def _find_operation(op_name):
        op_index = esi_openapi.client._
        for tag_data in op_index._tags.values():
            if op_name in tag_data._operations:
                return EsiOperation(tag_data._operations[op_name], esi_openapi.client.api)
        return None

    deleted = 0

    for group_key in group_keys:
        group = ETAG_CLEAR_GROUPS.get(group_key)
        if not group:
            logger.warning(f"Unknown etag group: {group_key}")
            continue

        for op_name in group["operations"]:
            op = _find_operation(op_name)
            if op is None:
                logger.warning(f"Operation {op_name} not found in ESI client")
                continue

            param_names = [p.name for p in op.operation.parameters]
            has_pages = op._has_page_param()

            if "character_id" in param_names:
                entity_ids = char_ids
                id_key = "character_id"
            elif "corporation_id" in param_names:
                entity_ids = corp_ids
                id_key = "corporation_id"
            else:
                op._clear_etag()
                deleted += 1
                continue

            # division is a secondary positional param on corp wallet endpoints (values 1-7)
            secondary_kwarg_sets = [{}]
            if "division" in param_names:
                secondary_kwarg_sets = [{"division": d} for d in range(1, 8)]

            for entity_id in entity_ids:
                base_kwargs = {id_key: entity_id}
                for secondary in secondary_kwarg_sets:
                    full_kwargs = {**base_kwargs, **secondary}
                    if has_pages:
                        for page in range(1, 51):
                            op(**{**full_kwargs, "page": page})
                            op._clear_etag()
                            deleted += 1
                    else:
                        op(**full_kwargs)
                        op._clear_etag()
                        deleted += 1

    return f"Cleared {deleted} etag entries for groups: {group_keys}"


@shared_task(name="corptools.tasks.update_wallet_currency")
def update_wallet_currency(pk):
    m = CharacterWalletJournalEntry.objects.get(pk=pk)
    reason = m.reason
    if not reason.endswith("ISK"):
        reason = reason.replace(" @ $", " @ ")
        m.reason = reason + " ISK"
        m.save()


@shared_task(name="corptools.tasks.export_old_wallet_fixtures")
def export_old_wallet_fixtures():
    char_ids = list(CharacterAudit.objects.values_list(
        "character__character_id", flat=True))
    for char_id in char_ids:
        export_character_wallet_fixtures_task.apply_async(
            args=[char_id], priority=7)

    corp_ids = list(CorporationAudit.objects.values_list(
        "corporation__corporation_id", flat=True))
    for corp_id in corp_ids:
        export_corporation_wallet_fixtures_task.apply_async(
            args=[corp_id], priority=7)

    return f"Dispatched {len(char_ids)} character and {len(corp_ids)} corporation wallet fixture export tasks"


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["character_id"]},
    name="corptools.tasks.export_character_wallet_fixtures",
)
def export_character_wallet_fixtures_task(self, character_id):
    return export_character_wallet_fixtures(character_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True, "keys": ["corporation_id"]},
    name="corptools.tasks.export_corporation_wallet_fixtures",
)
def export_corporation_wallet_fixtures_task(self, corporation_id):
    return export_corporation_wallet_fixtures(corporation_id)


@shared_task(name="corptools.tasks.purge_old_wallet_data")
def purge_old_wallet_data():
    return purge_npc_wallet_entries()
