import logging
from celery import shared_task
from ..models import CorporationWalletJournalEntry, CorporationAudit, CorporationWalletDivision, EveName

from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo

from esi.models import Token
from django.utils import timezone
from django.db.models import Q
from allianceauth.services.tasks import QueueOnce
from bravado.exception import HTTPForbidden

from .. import providers

import bz2
import re
import requests
import datetime

logger = logging.getLogger(__name__)


def get_corp_token(corp_id, scopes, req_roles):
    """
    Helper method to get a token for a specific character from a specific corp with specific scopes
    :param corp_id: Corp to filter on.
    :param scopes: array of ESI scope strings to search for.
    :param req_roles: roles required on the character.
    :return: :class:esi.models.Token or False
    """
    if 'esi-characters.read_corporation_roles.v1' not in scopes:
        scopes.append("esi-characters.read_corporation_roles.v1")

    char_ids = EveCharacter.objects.filter(
        corporation_id=corp_id).values('character_id')
    tokens = Token.objects \
        .filter(character_id__in=char_ids) \
        .require_scopes(scopes)

    for token in tokens:
        roles = providers.esi.client.Character.get_characters_character_id_roles(character_id=token.character_id,
                                                                                 token=token.valid_access_token()).result()
        has_roles = False
        for role in roles.get('roles', []):
            if role in req_roles:
                has_roles = True

        if has_roles:
            return token
        else:
            pass  # TODO Maybe remove token?

    return False


# pagnated results
def update_corp_wallet_journal(corp_id, wallet_division, full_update=False):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    division = CorporationWalletDivision.objects.get(
        corporation=audit_corp, division=wallet_division)
    logger.debug("Updating wallet transactions for: {} (Div: {})".format(
        audit_corp.corporation.corporation_name, division))

    req_scopes = ['esi-wallet.read_corporation_wallets.v1',
                  'esi-characters.read_corporation_roles.v1']
    req_roles = ['CEO', 'Director', 'Accountant', 'Junior_Accountant']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    journal_items = providers.esi.client.Wallet.get_corporations_corporation_id_wallets_division_journal(corporation_id=audit_corp.corporation.corporation_id,
                                                                                                         division=wallet_division,
                                                                                                         token=token.valid_access_token()).results()

    _current_journal = CorporationWalletJournalEntry.objects.filter(
        division=division).values_list('entry_id', flat=True)  # TODO add time filter
    _current_eve_ids = list(
        EveName.objects.all().values_list('eve_id', flat=True))

    _new_names = []

    items = []
    for item in journal_items:
        if item.get('id') not in _current_journal:
            if item.get('second_party_id') not in _current_eve_ids:
                _new_names.append(item.get('second_party_id'))
                _current_eve_ids.append(item.get('second_party_id'))
            if item.get('first_party_id') not in _current_eve_ids:
                _new_names.append(item.get('first_party_id'))
                _current_eve_ids.append(item.get('first_party_id'))

            wallet_item = CorporationWalletJournalEntry(division=division,
                                                        amount=item.get(
                                                            'amount'),
                                                        balance=item.get(
                                                            'balance'),
                                                        context_id=item.get(
                                                            'context_id'),
                                                        context_id_type=item.get(
                                                            'context_id_type'),
                                                        date=item.get('date'),
                                                        description=item.get(
                                                            'description'),
                                                        first_party_id=item.get(
                                                            'first_party_id'),
                                                        first_party_name_id=item.get(
                                                            'first_party_id'),
                                                        entry_id=item.get(
                                                            'id'),
                                                        reason=item.get(
                                                            'reason'),
                                                        ref_type=item.get(
                                                            'ref_type'),
                                                        second_party_id=item.get(
                                                            'second_party_id'),
                                                        second_party_name_id=item.get(
                                                            'second_party_id'),
                                                        tax=item.get('tax'),
                                                        tax_receiver_id=item.get(
                                                            'tax_receiver_id'),
                                                        )
            items.append(wallet_item)

    created_names = EveName.objects.create_bulk_from_esi(_new_names)

    if created_names:
        CorporationWalletJournalEntry.objects.bulk_create(items)
    else:
        raise Exception("DB Fail")


def update_corp_wallet_division(corp_id, full_update=False):  # pagnated results
    # logger.debug("Started wallet divs for: %s" % str(character_id))
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    req_scopes = ['esi-wallet.read_corporation_wallets.v1',
                  'esi-characters.read_corporation_roles.v1', 'esi-corporations.read_divisions.v1']
    req_roles = ['CEO', 'Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"
    division_names = providers.esi.client.Corporation.get_corporations_corporation_id_divisions(corporation_id=audit_corp.corporation.corporation_id,
                                                                                                token=token.valid_access_token()).result()
    names = {}
    for division in division_names.get('wallet'):
        names[division.get('division')] = division.get('name')

    divisions = providers.esi.client.Wallet.get_corporations_corporation_id_wallets(corporation_id=audit_corp.corporation.corporation_id,
                                                                                    token=token.valid_access_token()).result()

    for division in divisions:
        _division_item, _created = CorporationWalletDivision.objects \
            .update_or_create(corporation=audit_corp, division=division.get('division'),
                              defaults={'balance': division.get('balance'),
                                        'name': names[division.get('division')]})

        if _division_item:
            update_corp_wallet_journal(corp_id, division.get('division'),
                                       full_update=full_update)  # inline not async

    audit_corp.last_update_wallet = timezone.now()
    audit_corp.save()

    return "Finished wallet divs for: {0}".format(audit_corp.corporation.corporation_name)
