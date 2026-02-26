# Django
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools.models import (
    CorporationAudit,
    CorporationWalletDivision,
    CorporationWalletJournalEntry,
    EveItemType,
    EveName,
)

from .. import providers
from .utils import get_corp_token, get_eve_ids, update_corp_audit

logger = get_extension_logger(__name__)


@update_corp_audit(update_field="last_update_wallet")
def update_corp_wallet_divisions(corp_id, full_update=False):  # pagnated results
    # logger.debug("Started wallet divs for: %s" % str(character_id))
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    req_scopes = ['esi-wallet.read_corporation_wallets.v1',
                  'esi-characters.read_corporation_roles.v1',
                  'esi-corporations.read_divisions.v1']
    req_roles = ['CEO', 'Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)
    names = {}
    if token:
        division_names = providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdDivisions(
            corporation_id=audit_corp.corporation.corporation_id,
            token=token
        ).result(use_etag=False)

        for division in division_names.wallet:
            names[division.division] = division.name

    req_roles = ['CEO', 'Director', 'Accountant', 'Junior_Accountant']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    divisions = providers.esi_openapi.client.Wallet.GetCorporationsCorporationIdWallets(
        corporation_id=audit_corp.corporation.corporation_id,
        token=token
    ).result(
        force_refresh=full_update
    )

    for division in divisions:
        _division_item, _created = CorporationWalletDivision.objects.update_or_create(
            corporation=audit_corp,
            division=division.division,
            defaults={
                'balance': division.balance,
                'name': names.get(division.division, "Unknown")
            }
        )

        if _division_item:
            update_corp_wallet_journal(
                corp_id,
                division.division,
                full_update=full_update
            )

    return f"Finished wallet divs for: {audit_corp.corporation.corporation_name}"


@update_corp_audit(update_field="last_update_wallet")
def update_corp_wallet_journal(corp_id, wallet_division, full_update=False):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id
    )

    division = CorporationWalletDivision.objects.get(
        corporation=audit_corp,
        division=wallet_division
    )

    logger.debug(
        "Updating wallet transactions for: {} (Div: {})".format(
            audit_corp.corporation.corporation_name,
            division
        )
    )

    req_scopes = [
        'esi-wallet.read_corporation_wallets.v1',
        'esi-characters.read_corporation_roles.v1'
    ]

    req_roles = [
        'CEO',
        'Director',
        'Accountant',
        'Junior_Accountant'
    ]

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    current_page = 1
    total_pages = 1
    _new_names = set()

    # Loop pages one at a time to reduce ram use.
    while current_page <= total_pages:
        journal_items, headers = providers.esi_openapi.client.Wallet.GetCorporationsCorporationIdWalletsDivisionJournal(
            corporation_id=audit_corp.corporation.corporation_id,
            division=wallet_division,
            page=current_page,
            token=token
        ).result(
            return_response=True,
            force_refresh=full_update
        )

        _current_journal = set(
            list(
                CorporationWalletJournalEntry.objects.filter(
                    entry_id__in=[ji.id for ji in journal_items],
                    division=division
                ).values_list(
                    'entry_id',
                    flat=True
                )
            )
        )

        _current_eve_ids = set()

        for ji in journal_items:
            _current_eve_ids.add(ji.second_party_id)
            _current_eve_ids.add(ji.first_party_id)

        _current_eve_ids = get_eve_ids(_current_eve_ids)

        total_pages = int(headers.headers['X-Pages'])

        logger.debug(
            f"CT: Corp {corp_id} Div {wallet_division}, Page:{current_page}/{total_pages} ({len(journal_items)})")

        _min_time = timezone.now()

        items = []
        for item in journal_items:
            if _min_time > item.date:
                _min_time = item.date
            if item.id not in _current_journal:
                if item.second_party_id not in _current_eve_ids:
                    _new_names.add(item.second_party_id)
                    _current_eve_ids.add(item.second_party_id)
                if item.first_party_id not in _current_eve_ids:
                    _new_names.add(item.first_party_id)
                    _current_eve_ids.add(item.first_party_id)
                wallet_item = CorporationWalletJournalEntry.from_esi_model(
                    division, item)
                items.append(wallet_item)

        logger.info(
            f"CT: Corp {corp_id} Div {wallet_division}, Page: {current_page}, New Transactions! {len(items)}, New Names {_new_names}")

        created_names = EveName.objects.create_bulk_from_esi(list(_new_names))

        if created_names:
            CorporationWalletJournalEntry.objects.bulk_create(items)
        else:
            raise Exception("DB Fail")

        current_page += 1

    logger.info(
        f"CT: Corp {corp_id} Div {wallet_division}, OLDEST DATA! {audit_corp} {_min_time}"
    )


@update_corp_audit(update_field="last_update_wallet")
def update_corporation_transactions(corp_id, wallet_division, full_update=False):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    division = CorporationWalletDivision.objects.get(
        corporation=audit_corp, division=wallet_division)

    logger.debug("Updating market transactions for: {} (Div: {})".format(
        audit_corp.corporation.corporation_name, division))

    req_scopes = ['esi-wallet.read_corporation_wallets.v1',
                  'esi-characters.read_corporation_roles.v1']

    req_roles = ['CEO', 'Director', 'Accountant', 'Junior_Accountant']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    journal_items = providers.esi_openapi.client.Wallet.GetCorporationsCorporationIdWalletsDivisionTransactions(
        corporation_id=audit_corp.corporation.corporation_id,
        division=wallet_division,
        token=token
    ).results(
        force_refresh=full_update
    )

    _current_journal = CorporationWalletJournalEntry.objects.filter(
        character=audit_corp,
        context_id_type="market_transaction_id",
        # Max items from ESI
        reason__exact=""
    ).values_list(
        'context_id',
        flat=True
    )[:2500]

    for item in journal_items:
        if item.transaction_id in _current_journal:
            # what is this doing???
            type_name, _ = EveItemType.objects.get_or_create_from_esi(
                item.type_id
            )

    return f"CT: Finished market transactions for: {audit_corp.corporation.corporation_name}"
