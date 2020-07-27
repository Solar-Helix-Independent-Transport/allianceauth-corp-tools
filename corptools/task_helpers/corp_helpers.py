import logging
from celery import shared_task
from ..models import CorporationWalletJournalEntry

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

@shared_task
def update_corp_wallet_journal(character_id, wallet_division, full_update=False):  # pagnated results
    
    def journal_db_update(_transaction, _division, existing_id, name_ids):
        """ Build Wallet Database Model """
        first_name = False
        second_name = False

        if not _transaction.get('id') in existing_id:
            try:
                if _transaction.get('second_party_id') and _transaction.get('second_party_id') not in name_ids:
                    _get_new_eve_name(_transaction.get('second_party_id'))
                    name_ids.append(_transaction.get('second_party_id'))
                    second_name = True
                elif _transaction.get('second_party_id') and _transaction.get('second_party_id') in name_ids:
                    second_name = True
            except Exception as e:
                print(e)

            try:
                if _transaction.get('first_party_id') and _transaction.get('first_party_id') not in name_ids:
                    _get_new_eve_name(_transaction.get('first_party_id'))
                    name_ids.append(_transaction.get('first_party_id'))
                    first_name = True
                elif _transaction.get('first_party_id') and _transaction.get('first_party_id') in name_ids:
                    first_name = True
            except Exception as e:
                print(e)

            _journal_item = CorporationWalletJournalEntry(
                division=_division,
                entry_id=_transaction.get('id'),
                amount=_transaction.get('amount'),
                balance=_transaction.get('balance'),
                context_id=_transaction.get('context_id'),
                context_id_type=_transaction.get('context_id_type'),
                date=_transaction.get('date'),
                description=_transaction.get('description'),
                first_party_id=_transaction.get('first_party_id'),
                reason=_transaction.get('reason'),
                ref_type=_transaction.get('ref_type'),
                second_party_id=_transaction.get('second_party_id'),
                tax=_transaction.get('tax'),
                tax_reciever_id=_transaction.get('tax_reciever_id'))

            if first_name:
                _journal_item.first_party_name_id=_transaction.get('first_party_id')
            if second_name:
                _journal_item.second_party_name_id=_transaction.get('second_party_id')


            return _journal_item
        else:
            return False

    req_scopes = ['esi-wallet.read_corporation_wallets.v1', 'esi-characters.read_corporation_roles.v1']

    req_roles = ['CEO', 'Director', 'Accountant', 'Junior_Accountant']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    # check roles!
    operation = providers.esi.client.Character.get_characters_character_id_roles(character_id=character_id, 
                                                    token=token.valid_access_token())
    operation.request_config.also_return_response = True
    roles, result = operation.result()
    _character = AllianceToolCharacter.objects.get(character__character_id=character_id)

    has_roles = False
    for role in roles.get('roles', []):
        if role in req_roles:
            has_roles = True

    if not has_roles:
        _character.update_wallet = False
        _character.save()
        return "No Roles on Character"


    _corporation = EveCorporationInfo.objects.get(corporation_id=_character.character.corporation_id)
    _division = CorporationWalletDivision.objects.get(corporation=_corporation, division=wallet_division)

    bulk_wallet_items = []
    name_ids = []
    cache_expires = 0
    wallet_page = 1
    total_pages = 1
    name_ids = list(EveName.objects.all().values_list('eve_id', flat=True))
    last_thrity = list(CorporationWalletJournalEntry.objects.filter( division=_division,
        date__gt=(datetime.datetime.utcnow().replace(tzinfo=timezone.utc) - datetime.timedelta(days=60))).values_list(
        'entry_id', flat=True))

    while wallet_page <= total_pages:
        # logger.info("{0}: Wallet Page{1}/{2}".format(_character.character.character_name, wallet_page, total_pages))
        operation = providers.esi.client.Wallet.get_corporations_corporation_id_wallets_division_journal(
                        corporation_id=_corporation.corporation_id,
                        division=wallet_division,
                        page=wallet_page,
                        token=token.valid_access_token())

        operation.request_config.also_return_response = True
        journal, result = operation.result()
        total_pages = int(result.headers['X-Pages'])
        cache_expires = datetime.datetime.strptime(result.headers['Expires'], '%a, %d %b %Y %H:%M:%S GMT').replace(
            tzinfo=timezone.utc)

        for transaction in journal:
            _j_ob = journal_db_update(transaction, _division, last_thrity, name_ids)
            if _j_ob:
                bulk_wallet_items.append(_j_ob)  # return'd values not needed
            else:
                # old!
                if not full_update:
                    wallet_page = total_pages
                    break

        wallet_page += 1

    CorporationWalletJournalEntry.objects.bulk_create(bulk_wallet_items, batch_size=500)

    AllianceToolCharacter.objects.filter(character__character_id=character_id).update(
        next_update_wallet=cache_expires,
        last_update_wallet=datetime.datetime.utcnow().replace(tzinfo=timezone.utc))

    return "Finished wallet trans for: {0}".format(_character.character.character_name)


@shared_task
def update_corp_wallet_division(character_id, full_update=False):  # pagnated results
    # logger.debug("Started wallet divs for: %s" % str(character_id))

    req_scopes = ['esi-wallet.read_corporation_wallets.v1', 'esi-characters.read_corporation_roles.v1']
    req_roles = ['CEO', 'Director', 'Accountant', 'Junior_Accountant']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"


    # check roles!
    roles = providers.esi.client.Character.get_characters_character_id_roles(character_id=character_id,
                                                    token=token.valid_access_token()).result()
    _character = AllianceToolCharacter.objects.get(character__character_id=character_id)

    has_roles = False
    for role in roles.get('roles', []):
        if role in req_roles:
            has_roles = True

    if not has_roles:
        _character.update_wallet = False
        _character.save()
        return "No Roles on Character"

    _corporation = EveCorporationInfo.objects.get(corporation_id=_character.character.corporation_id)

    _divisions = providers.esi.client.Wallet.get_corporations_corporation_id_wallets(corporation_id=_corporation.corporation_id,
                                                    token=token.valid_access_token()).result()

    for division in _divisions:
        _division_item, _created = CorporationWalletDivision.objects \
            .update_or_create(corporation=_corporation, division=division.get('division'),
                              defaults={'balance': division.get('balance')})

        if _division_item:
            update_corp_wallet_journal(character_id, division.get('division'),
                                       full_update=full_update)  # inline not async

    return "Finished wallet divs for: {0}".format(_character.character.character_name)
