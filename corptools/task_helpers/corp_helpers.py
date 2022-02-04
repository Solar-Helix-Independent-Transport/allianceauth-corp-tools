import logging
from celery import shared_task
from corptools.task_helpers.etag_helpers import NotModifiedError, etag_results
from corptools.task_helpers.update_tasks import fetch_location_name
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.db.models.aggregates import Sum
from ..models import BridgeOzoneLevel, CorpAsset, CorporationWalletJournalEntry, CorporationAudit, CorporationWalletDivision, EveItemType, EveLocation, EveName, Structure, StructureCelestial, StructureService

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

    _current_journal = set(list(CorporationWalletJournalEntry.objects.filter(
        division=division).order_by('-date').values_list('entry_id', flat=True)[:20000]))
    _current_eve_ids = set(list(
        EveName.objects.all().values_list('eve_id', flat=True)))

    current_page = 1
    total_pages = 1
    _new_names = []
    while current_page <= total_pages:
        journal_items = providers.esi.client.Wallet.get_corporations_corporation_id_wallets_division_journal(corporation_id=audit_corp.corporation.corporation_id,
                                                                                                             division=wallet_division,
                                                                                                             page=current_page,
                                                                                                             token=token.valid_access_token())
        journal_items.request_config.also_return_response = True
        journal_items, headers = journal_items.result()
        total_pages = int(headers.headers['X-Pages'])
        logger.debug(
            f"CT: Corp {corp_id} Div {wallet_division}, Page:{current_page}/{total_pages} ({len(journal_items)})")
        _min_time = timezone.now()
        items = []
        for item in journal_items:
            if item.get('id') not in _current_journal:
                if item.get('second_party_id') not in _current_eve_ids:
                    _new_names.append(item.get('second_party_id'))
                    _current_eve_ids.add(item.get('second_party_id'))
                if item.get('first_party_id') not in _current_eve_ids:
                    _new_names.append(item.get('first_party_id'))
                    _current_eve_ids.add(item.get('first_party_id'))
                if _min_time > item.get('date'):
                    _min_time = item.get('date')
                wallet_item = CorporationWalletJournalEntry(division=division,
                                                            amount=item.get(
                                                                'amount'),
                                                            balance=item.get(
                                                                'balance'),
                                                            context_id=item.get(
                                                                'context_id'),
                                                            context_id_type=item.get(
                                                                'context_id_type'),
                                                            date=item.get(
                                                                'date'),
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
                                                            tax=item.get(
                                                                'tax'),
                                                            tax_receiver_id=item.get(
                                                                'tax_receiver_id'),
                                                            )
                items.append(wallet_item)
            else:
                # short cct
                if not full_update:
                    total_pages = 0
                    break

        current_page += 1

    created_names = EveName.objects.create_bulk_from_esi(_new_names)
    logger.info(f"OLDEST DATA! {audit_corp} {_min_time}")
    if created_names:
        CorporationWalletJournalEntry.objects.bulk_create(items)
    else:
        raise Exception("DB Fail")


def update_corp_wallet_division(corp_id, full_update=False):  # pagnated results
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
        division_names = providers.esi.client.Corporation.get_corporations_corporation_id_divisions(corporation_id=audit_corp.corporation.corporation_id,
                                                                                                    token=token.valid_access_token()).result()
        for division in division_names.get('wallet'):
            names[division.get('division')] = division.get('name')

    req_roles = ['CEO', 'Director', 'Accountant', 'Junior_Accountant']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    divisions = providers.esi.client.Wallet.get_corporations_corporation_id_wallets(corporation_id=audit_corp.corporation.corporation_id,
                                                                                    token=token.valid_access_token()).result()

    for division in divisions:
        _division_item, _created = CorporationWalletDivision.objects \
            .update_or_create(corporation=audit_corp, division=division.get('division'),
                              defaults={'balance': division.get('balance'),
                                        'name': names.get(division.get('division'), "Unknown")})

        if _division_item:
            update_corp_wallet_journal(corp_id, division.get('division'),
                                       full_update=full_update)  # inline not async

    audit_corp.last_update_wallet = timezone.now()
    audit_corp.save()

    return "Finished wallet divs for: {0}".format(audit_corp.corporation.corporation_name)


def update_corp_structures(corp_id):  # pagnated results
    # logger.debug("Started structures for: %s" % (str(character_id)))

    def _structures_db_update(_corporation, _structure, _name):
        str_type, _ = EveItemType.objects.get_or_create_from_esi(
            _structure.get('type_id'))
        _structure_ob, _created = Structure.objects.update_or_create(
            structure_id=_structure.get('structure_id'),
            corporation=_corporation,
            defaults={
                'fuel_expires': _structure.get('fuel_expires', None),
                'next_reinforce_apply': _structure.get('next_reinforce_apply', None),
                'next_reinforce_weekday': _structure.get('next_reinforce_weekday', None),
                'profile_id': _structure.get('profile_id', None),
                'reinforce_hour': _structure.get('reinforce_hour', None),
                'reinforce_weekday': _structure.get('reinforce_weekday', None),
                'state': _structure.get('state', None),
                'state_timer_end': _structure.get('state_timer_end', None),
                'state_timer_start': _structure.get('state_timer_start', None),
                'system_id': _structure.get('system_id', None),
                'type_id': _structure.get('type_id', None),
                'unanchors_at': _structure.get('unanchors_at', None),
                'name': _name,
                'system_name_id': _structure.get('system_id', None),
                'type_name': str_type
            })

        if _structure_ob:
            _asset = None
            _location = None
            celestial = StructureCelestial.objects.filter(
                structure_id=_structure.get('structure_id'))

            if not celestial.exists():
                try:
                    _asset = CorpAsset.objects.get(
                        item_id=_structure.get('structure_id'), corp=_corporation)
                    _req_scopes = ['esi-assets.read_corporation_assets.v1']
                    _req_roles = ['Director']
                    _token = get_corp_token(
                        _corporation.corporation.corporation_id, _req_scopes, _req_roles)
                    if _token:
                        locations = providers.esi.client.Assets.post_corporations_corporation_id_assets_locations(
                            corporation_id=_corporation.corporation.corporation_id,
                            item_ids=[_structure.get('structure_id')],
                            token=token.valid_access_token()).result()

                        _location = locations[0]

                        url = "https://www.fuzzwork.co.uk/api/nearestCelestial.php?x=%s&y=%s&z=%s&solarsystemid=%s" \
                            % ((str(_location['position'].get('x'))),
                               (str(_location['position'].get('y'))),
                                (str(_location['position'].get('z'))),
                                (str(_structure.get('system_id')))
                               )

                        r = requests.get(url)
                        fuzz_result = r.json()

                        celestial = StructureCelestial.objects.create(
                            structure_id=_structure.get('structure_id'),
                            celestial_name=fuzz_result.get('itemName')
                        )
                except ObjectDoesNotExist as e:
                    celestial = None
                except:
                    # logging.exception("Messsage")
                    celestial = None
            else:
                celestial = celestial[0]

            if celestial is not None:
                _structure_ob.closest_celestial = celestial
                _structure_ob.save()

            if _structure.get('services'):
                db_services = StructureService.objects.filter(
                    structure=_structure_ob)
                current_services = []
                for service in _structure.get('services'):
                    db_service = db_services.filter(name=service['name'])
                    if db_service.exists():
                        if db_service.count() == 1:
                            if db_service[0].state == service['state']:
                                current_services.append(db_service[0].id)
                                pass
                            else:
                                db_service.update(state=service['state'])
                                current_services.append(db_service[0].id)
                        else:
                            StructureService.objects.filter(structure=_structure_ob,
                                                            name=service['name']).delete()
                            new_service = StructureService.objects.create(structure=_structure_ob,
                                                                          state=service['state'],
                                                                          name=service['name'])
                            current_services.append(new_service.id)

                    else:
                        new_service = StructureService.objects.create(structure=_structure_ob,
                                                                      state=service['state'],
                                                                      name=service['name'])
                        current_services.append(new_service.id)
                db_services.exclude(id__in=current_services).delete()

        return _structure_ob, _created

    req_scopes = ['esi-corporations.read_structures.v1', 'esi-universe.read_structures.v1',
                  'esi-characters.read_corporation_roles.v1']

    req_roles = ['Director', 'Station_Manager']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    structure_ids = []
    operation = providers.esi.client.Corporation.get_corporations_corporation_id_structures(
        corporation_id=_corporation.corporation.corporation_id)
    try:
        structures = etag_results(operation, token)
    except NotModifiedError:
        return "No New structure data for: {0}".format(_corporation)

    for structure in structures:
        try:
            structure_info = fetch_location_name(structure.get(
                'structure_id'), 'solar_system', token.character_id)
        except:  # if bad screw it...
            structure_info = False

        try:
            structure_ob, created = _structures_db_update(_corporation,
                                                          structure,
                                                          structure_info.location_name if structure_info else str(
                                                              structure.get('structure_id')))
        except MultipleObjectsReturned:
            id_of_first = Structure.objects.filter(
                structure_id=structure.get('structure_id')).order_by("id")[0].id
            Structure.objects.filter(structure_id=structure.get(
                'structure_id')).exclude(id=id_of_first).delete()
            structure_ob, created = _structures_db_update(_corporation,
                                                          structure,
                                                          structure_info.location_name if structure_info else str(
                                                              structure.get('structure_id')))

        structure_ids.append(structure_ob.structure_id)

    Structure.objects.filter(corporation=_corporation).exclude(
        structure_id__in=structure_ids).delete()  # structures die/leave

    _corporation.last_update_structures = timezone.now()
    _corporation.save()

    return "Updated structures for: {0}".format(_corporation)


def update_corp_assets(corp_id):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Assets for: {}".format(
        audit_corp.corporation))

    req_scopes = ['esi-assets.read_corporation_assets.v1',
                  'esi-characters.read_corporation_roles.v1']
    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"
    try:
        assets_op = providers.esi.client.Assets.get_corporations_corporation_id_assets(
            corporation_id=corp_id)
        assets = etag_results(assets_op, token)

        location_names = list(
            EveLocation.objects.all().values_list('location_id', flat=True))
        _current_type_ids = []
        item_ids = []
        items = []
        for item in assets:
            if item.get('type_id') not in _current_type_ids:
                _current_type_ids.append(item.get('type_id'))
            item_ids.append(item.get('item_id'))
            asset_item = CorpAsset(corporation=audit_corp,
                                   blueprint_copy=item.get(
                                       'is_blueprint_copy'),
                                   singleton=item.get('is_singleton'),
                                   item_id=item.get('item_id'),
                                   location_flag=item.get(
                                       'location_flag'),
                                   location_id=item.get('location_id'),
                                   location_type=item.get(
                                       'location_type'),
                                   quantity=item.get('quantity'),
                                   type_id=item.get('type_id'),
                                   type_name_id=item.get('type_id')
                                   )
            if item.get('location_id') in location_names:
                asset_item.location_name_id = item.get('location_id')
            items.append(asset_item)

        EveItemType.objects.create_bulk_from_esi(_current_type_ids)

        delete_query = CorpAsset.objects.filter(
            corporation=audit_corp)  # Flush Assets
        if delete_query.exists():
            # speed and we are not caring about f-keys or signals on these models
            delete_query._raw_delete(delete_query.db)

        CorpAsset.objects.bulk_create(items)
        run_ozone_levels.apply_async(args=[corp_id], priority=7)
    except NotModifiedError:
        logger.info("CT: No New assets for: {}".format(
            audit_corp.corporation))
        pass

    audit_corp.last_update_assets = timezone.now()
    audit_corp.save()

    return "Finished assets for: {}".format(audit_corp.corporation)


@shared_task(bind=True, base=QueueOnce)
def run_ozone_levels(self, corp_id):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Ozone for: %s" % (_corporation.corporation))
    _structures = Structure.objects.filter(
        type_id=35841, corporation=_corporation)

    for structure in _structures:
        _quantity = \
            CorpAsset.objects.filter(corporation=_corporation, location_id=structure.structure_id,
                                     type_id=16273).aggregate(ozone=Sum('quantity'))['ozone']
        _used = 0

        try:
            last_ozone = BridgeOzoneLevel.objects.filter(
                station_id=structure.structure_id).order_by('-date')[:1][0].quantity
            delta = last_ozone - _quantity
            _used = (delta if _quantity < last_ozone else 0)
        except:
            pass
        try:
            BridgeOzoneLevel.objects.create(
                station_id=structure.structure_id, quantity=_quantity, used=_used)
        except:
            pass  # dont fail for now
    return "Finished Ozone for: {}".format(_corporation.corporation)
