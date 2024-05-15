import logging
import re
import time
from locale import currency

import requests
from allianceauth.eveonline.models import EveCharacter
from allianceauth.services.tasks import QueueOnce
from celery import chain, shared_task
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.db.models import F, Q
from django.db.models.aggregates import Sum
from django.utils import timezone
from esi.errors import TokenError
from esi.models import Token

from corptools.task_helpers.etag_helpers import NotModifiedError, etag_results
from corptools.task_helpers.update_tasks import fetch_location_name

from .. import providers
from ..models import (BridgeOzoneLevel, CharacterAudit, CorpAsset,
                      CorporateContract, CorporateContractItem,
                      CorporationAudit, CorporationWalletDivision,
                      CorporationWalletJournalEntry, EveItemType, EveLocation,
                      EveName, MapJumpBridge, MapSystem, MapSystemPlanet, Poco,
                      Structure, StructureCelestial, StructureService)

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
        try:
            if req_roles:  # There are endpoints with no requirements
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
            else:
                return token
        except TokenError as e:
            logger.error(f"Token ID: {token.pk} ({e})")

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
            if _min_time > item.get('date'):
                _min_time = item.get('date')

            if item.get('id') not in _current_journal:
                if item.get('second_party_id') not in _current_eve_ids:
                    _new_names.append(item.get('second_party_id'))
                    _current_eve_ids.add(item.get('second_party_id'))
                if item.get('first_party_id') not in _current_eve_ids:
                    _new_names.append(item.get('first_party_id'))
                    _current_eve_ids.add(item.get('first_party_id'))
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
            # else:
                # short cct
                # if not full_update:
                # total_pages = 0
                # break
        logger.info(
            f"CT: Corp {corp_id} Div {wallet_division}, Page: {current_page}, New Transactions! {len(items)}, New Names {_new_names}")
        created_names = EveName.objects.create_bulk_from_esi(_new_names)

        if created_names:
            CorporationWalletJournalEntry.objects.bulk_create(items)
        else:
            raise Exception("DB Fail")

        current_page += 1

    logger.info(
        f"CT: Corp {corp_id} Div {wallet_division}, OLDEST DATA! {audit_corp} {_min_time}")


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

    try:
        journal_items_ob = providers.esi.client.Wallet.get_corporations_corporation_id_wallets_division_transactions(
            corporation_id=audit_corp.corporation.corporation_id,
            division=wallet_division)

        journal_items = etag_results(
            journal_items_ob, token, force_refresh=full_update)

        _current_journal = CharacterWalletJournalEntry.objects.filter(
            character=audit_char,
            context_id_type="market_transaction_id",
            reason__exact="").values_list('context_id', flat=True)[:2500]  # Max items from ESI

        _new_names = []

        items = []
        for item in journal_items:
            if item.get('transaction_id') in _current_journal:
                type_name, _ = EveItemType.objects.get_or_create_from_esi(
                    item.get('type_id'))

    except NotModifiedError:
        logger.info("CT: No New market transaction data for: {}".format(
            audit_char.character.character_name))
        pass

    return "CT: Finished market transactions for: {}".format(audit_char.character.character_name)


def update_corporation_pocos(corp_id, full_update=False):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    logger.debug("Updating Pocos for: {}".format(
        audit_corp.corporation.corporation_name))

    req_scopes = ['esi-planets.read_customs_offices.v1']

    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

    try:
        poco_ob = providers.esi.client.Planetary_Interaction.get_corporations_corporation_id_customs_offices(
            corporation_id=audit_corp.corporation.corporation_id)

        poco_data = etag_results(
            poco_ob, token, force_refresh=full_update)

        # Get all Poco Names ( planet name here )
        _all_ids = [p.get("office_id") for p in poco_data]

        token_assets = get_corp_token(
            corp_id, ['esi-assets.read_corporation_assets.v1'], req_roles)

        _all_names = []

        for id_chunk in providers.esi.chunk_ids(_all_ids):
            _all_names += providers.esi.client.Assets.post_corporations_corporation_id_assets_names(
                corporation_id=corp_id,
                item_ids=id_chunk,
                token=token_assets.valid_access_token()
            ).result()

        _planets = []
        _office_to_names = {}
        _planet_to_office = {}
        for n in _all_names:
            pn = n['name'][16: -1]
            _office_to_names[n['item_id']] = {"n": n['name'], "p": None}
            _planet_to_office[pn] = n['item_id']
            _planets += pn

        # Ensure all planets are in DB
        _all_system_ids = [p.get("system_id") for p in poco_data]

        _pids = []
        for system_id in _all_system_ids:
            _s = providers.esi.client.Universe.get_universe_systems_system_id(
                system_id=system_id).results()
            _pids += [_p['planet_id'] for _p in _s.get('planets', [])]

        for _p in _pids:
            p, _ = MapSystemPlanet.objects.get_or_create_from_esi(_p)
            if p.name in _planet_to_office:
                _office_to_names[_planet_to_office[p.name]]["p"] = p.planet_id

        for poco in poco_data:
            Poco.objects.update_or_create(
                office_id=poco.get('office_id'),
                corporation=audit_corp,
                defaults={
                    "alliance_tax_rate": poco.get('alliance_tax_rate'),
                    "allow_access_with_standings": poco.get('allow_access_with_standings'),
                    "allow_alliance_access": poco.get('allow_alliance_access'),
                    "bad_standing_tax_rate": poco.get('bad_standing_tax_rate'),
                    "corporation_tax_rate": poco.get('corporation_tax_rate'),
                    "excellent_standing_tax_rate": poco.get('excellent_standing_tax_rate'),
                    "good_standing_tax_rate": poco.get('good_standing_tax_rate'),
                    "neutral_standing_tax_rate": poco.get('neutral_standing_tax_rate'),
                    "office_id": poco.get('office_id'),
                    "reinforce_exit_end": poco.get('reinforce_exit_end'),
                    "reinforce_exit_start": poco.get('reinforce_exit_start'),
                    "standing_level": poco.get('standing_level'),
                    "system_id": poco.get('system_id'),
                    "system_name_id": poco.get('system_id'),
                    "name": _office_to_names.get(poco.get('office_id'))['n'],
                    "planet_id": _office_to_names.get(poco.get('office_id'))['p'],
                    "terrible_standing_tax_rate": poco.get('terrible_standing_tax_rate')
                }
            )

        Poco.objects.filter(corporation=audit_corp).exclude(
            office_id__in=_all_ids).delete()

    except NotModifiedError:
        logger.info("CT: No New Poco data for: {}".format(
            audit_corp.corporation.corporation_name))
        pass

    return "CT: Finished Pocos for: {}".format(audit_corp.corporation.corporation_name)


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
        _corporation.last_update_structures = timezone.now()
        _corporation.save()
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

    _corporation.last_change_structures = timezone.now()
    _corporation.last_update_structures = timezone.now()
    _corporation.save()

    return "Updated structures for: {0}".format(_corporation)


def update_character_logins_from_corp(corp_id):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Logins for: {}".format(
        audit_corp.corporation))

    req_scopes = ['esi-corporations.track_members.v1',
                  'esi-characters.read_corporation_roles.v1']
    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"
    try:
        tracking_op = providers.esi.client.Corporation.get_corporations_corporation_id_membertracking(
            corporation_id=corp_id)
        tracking = etag_results(tracking_op, token)

        for c in tracking:
            try:
                ca = CharacterAudit.objects.get(
                    character__character_id=c['character_id'])
                ca.last_known_login = c.get('logon_date', None)
                ca.last_known_logoff = c.get('logoff_date', None)
                ca.save()
            except CharacterAudit.DoesNotExist:
                pass

    except NotModifiedError:
        logger.info("CT: No New Logins for: {}".format(
            audit_corp.corporation))
        pass

    all_chars = CharacterAudit.objects.filter(
        character__corporation_id=corp_id)
    all_chars.update(last_update_login=timezone.now())

    return "Finished Logins for: {}".format(audit_corp.corporation)


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
        failed_locations = []

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
            if item.get('location_id') not in location_names:
                try:
                    if item.get('location_id') not in failed_locations:
                        new_name = fetch_location_name(
                            item.get('location_id'), item.get('location_flag'), token.character_id)
                        if new_name:
                            new_name.save()
                            location_names.append(item.get('location_id'))
                            asset_item.location_name_id = item.get(
                                'location_id')
                        else:
                            failed_locations.append(item.get('location_id'))
                except:
                    pass  # TODO
            else:
                asset_item.location_name_id = item.get('location_id')

            items.append(asset_item)

        EveItemType.objects.create_bulk_from_esi(_current_type_ids)

        delete_query = CorpAsset.objects.filter(
            corporation=audit_corp)  # Flush Assets
        if delete_query.exists():
            # speed and we are not caring about f-keys or signals on these models
            delete_query._raw_delete(delete_query.db)

        CorpAsset.objects.bulk_create(items)
        que = []
        que.append(run_ozone_levels.si(corp_id))
        que.append(build_managed_asset_locations.si(corp_id))
        chain(que).apply_async(priority=7)
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


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


@shared_task(bind=True)
def build_managed_asset_locations(self, corp_id):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Corporate Hangar Locations for: %s" %
                 (_corporation.corporation))

    req_scopes = ['esi-corporations.read_divisions.v1',
                  'esi-characters.read_corporation_roles.v1']
    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    divisions = {}
    if token:
        divs = providers.esi.client.Corporation.get_corporations_corporation_id_divisions(
            corporation_id=_corporation.corporation.corporation_id,
            token=token.valid_access_token()
        ).result()
        for d in divs['hangar']:
            divisions[f"CorpSAG{d['division']}"] = d['name']

    existing_locations = set(list(EveLocation.objects.filter(
        managed=True, managed_corp=_corporation).values_list("location_id", flat=True)))
    current = []
    new = []
    updates = []
    # get office folders and name them
    folders = CorpAsset.objects.filter(corporation=_corporation,
                                       location_flag="OfficeFolder"
                                       ).select_related("location_name")
    names = {}

    grp_ids = [
        12,
        340,
        448,
        649,
    ]

    cat_ids = [
        6
    ]

    corp_hangars = {}
    hangar_ids = []
    for i in folders:
        if i.location_name:
            names[i.item_id] = i.location_name.location_name
        else:
            names[i.item_id] = i.location_id
        corp_hangars[i.item_id] = {}
        for j in range(1, 7):

            # Build the Managed Location for hangars
            id = -int(f"{i.item_id}{j}")
            sag = f"CorpSAG{j}"
            name = f"{names[i.item_id]} > {divisions.get(sag, sag)}"
            hangar_ids.append(id)

            # store for later?
            corp_hangars[i.item_id][sag] = (id, name)

            # update or create the location
            EveLocation.objects.update_or_create(
                location_id=id,
                defaults={
                    "location_name": name,
                    "managed": True,
                    "managed_corp": _corporation
                }
            )

            # update all the assets.
            CorpAsset.objects.filter(
                corporation=_corporation,
                location_id=i.item_id,
                location_flag=sag
            ).update(location_name_id=id)
    # get Containers in office folders and assign the names

    containers = CorpAsset.objects.filter(
        (Q(type_name__group_id__in=grp_ids) | Q(
            type_name__group__category_id__in=cat_ids))
    ).filter(
        corporation=_corporation,
        singleton=True,
        location_id__in=folders.values_list(
            "item_id", flat=True),
    ).select_related("location_name", "type_name")

    req_scopes = ['esi-assets.read_corporation_assets.v1',
                  'esi-characters.read_corporation_roles.v1']

    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)
    if token:
        ids = list(set(list(containers.values_list("item_id", flat=True))))
        for c in chunks(ids, 250):
            items = providers.esi.client.Assets.post_corporations_corporation_id_assets_names(
                item_ids=c,
                corporation_id=_corporation.corporation.corporation_id,
                token=token.valid_access_token()
            ).result()
            for n in items:
                names[n['item_id']] = n['name']

    # each container gets a location name Station > Hangar > Type
    for c in containers:
        current.append(c.item_id)
        name = names.get(c.item_id, c.type_name.name)
        hangar = divisions.get(c.location_flag, c.location_flag)
        station = names.get(c.location_id, c.location_id)
        item_loc = f"{station} > {hangar} > {name}"
        loc = EveLocation(
            location_id=c.item_id,
            location_name=item_loc,
            managed=True,
            managed_corp=_corporation
        )
        if c.item_id in existing_locations:
            updates.append(loc)
        else:
            new.append(loc)

    if len(new):
        EveLocation.objects.bulk_create(new)

    if len(updates):
        EveLocation.objects.bulk_update(
            updates, ["location_name", "managed", "managed_corp"])

    EveLocation.objects.filter(managed=True, managed_corp=_corporation).exclude(
        location_id__in=current+hangar_ids).delete()

    CorpAsset.objects.filter(location_id__in=current).update(
        location_name_id=F("location_id"))


@shared_task(bind=True, base=QueueOnce)
def build_jb_network(self):
    structures = Structure.objects.filter(type_id=35841).select_related(
        "corporation__corporation", "system_name"
    ).prefetch_related('structureservice_set')

    second_systems = set()
    output = {}
    regex = r"^(.*) » ([^ - ]*) - (.*)"
    for s in structures:
        matches = re.findall(regex, s.name)
        matches = matches[0]
        output[matches[0]] = {}
        output[matches[0]]["start"] = {"system": s.system_name,
                                       "structure_id": s.structure_id,
                                       "owner": s.corporation.corporation.alliance.alliance_id,
                                       "name": s.name}
        _exit = MapSystem.objects.get(name=matches[1])
        output[matches[0]]["end"] = {"system": _exit,
                                     "name": _exit.name}

    new_jbs = []
    for k, m in output.items():
        new_jbs.append(
            MapJumpBridge(
                structure_id=m["start"]["structure_id"],
                from_solar_system=m["start"]["system"],
                to_solar_system=m["end"]["system"],
                owner_id=m["start"]["owner"]
            )
        )

    MapJumpBridge.objects.filter(manually_input=False).delete()
    MapJumpBridge.objects.bulk_create(new_jbs)

    return f"Created {len(new_jbs)} new JB links"


def update_corporate_contracts(corp_id, force_refresh=False):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("updating corporate contracts for: %s" %
                 str(_corporation.corporation.corporation_name))

    req_scopes = ['esi-contracts.read_corporation_contracts.v1',
                  'esi-characters.read_corporation_roles.v1']

    token = get_corp_token(corp_id, req_scopes, False)

    new_contract_ids = []

    if not token:
        return False, []
    try:
        contracts_op = providers.esi.client.Contracts.get_corporations_corporation_id_contracts(
            corporation_id=corp_id)

        contracts = etag_results(
            contracts_op, token, force_refresh=force_refresh)

        contract_models_new = []
        contract_models_old = []
        eve_names = set()
        contract_ids = list(CorporateContract.objects.filter(
            corporation=_corporation).values_list("contract_id", flat=True))
        for c in contracts:  # update labels
            _contract_item = CorporateContract(
                id=CorporateContract.build_pk(
                    _corporation.id, c.get('contract_id')),
                corporation=_corporation,
                assignee_id=c.get('assignee_id'),
                assignee_name_id=c.get('assignee_id'),
                acceptor_id=c.get('acceptor_id'),
                acceptor_name_id=c.get('acceptor_id'),
                contract_id=c.get('contract_id'),
                availability=c.get('availability'),
                buyout=c.get('buyout'),
                collateral=c.get('collateral'),
                date_accepted=c.get('date_accepted'),
                date_completed=c.get('date_completed'),
                date_expired=c.get('date_expired'),
                date_issued=c.get('date_issued'),
                days_to_complete=c.get('days_to_complete'),
                end_location_id=c.get('end_location_id'),
                for_corporation=c.get('for_corporation'),
                issuer_corporation_name_id=c.get('issuer_corporation_id'),
                issuer_name_id=c.get('issuer_id'),
                price=c.get('price'),
                reward=c.get('reward'),
                start_location_id=c.get('start_location_id'),
                status=c.get('status'),
                title=c.get('title'),
                contract_type=c.get('type'),
                volume=c.get('volume')
            )

            eve_names.add(c.get('assignee_id'))
            eve_names.add(c.get('issuer_corporation_id'))
            eve_names.add(c.get('issuer_id'))
            eve_names.add(c.get('acceptor_id'))

            if c.get('contract_id') in contract_ids:
                contract_models_old.append(_contract_item)
            else:
                contract_models_new.append(_contract_item)

        EveName.objects.create_bulk_from_esi(list(eve_names))

        if len(contract_models_new) > 0:
            CorporateContract.objects.bulk_create(
                contract_models_new, batch_size=1000, ignore_conflicts=True)

        if len(contract_models_old) > 0:
            CorporateContract.objects.bulk_update(contract_models_old, batch_size=1000,
                                                  fields=['date_accepted', 'date_completed', 'acceptor_id', 'date_expired', 'status',
                                                          'assignee_name', 'acceptor_name', 'issuer_corporation_name', 'issuer_name'])

        new_contract_ids = [c.contract_id for c in contract_models_new]
        if force_refresh:
            new_contract_ids += [c.contract_id for c in contract_models_old]

    except NotModifiedError:
        logger.info("CT: No New Contracts for: {}".format(
            _corporation.corporation.corporation_name))
        pass

    _corporation.last_update_contracts = timezone.now()
    _corporation.save()

    return "CT: Completed corporate contracts for: %s" % str(_corporation.corporation.corporation_name), new_contract_ids


@shared_task(bind=True, base=QueueOnce)
def update_corporate_contract_items(self, corp_id, contract_id, force_refresh=False):
    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    logger.debug("updating contract items for: %s (%s)" %
                 (str(_corporation.corporation.corporation_name), str(contract_id)))

    contract = CorporateContract.objects.get(
        corporation=_corporation,
        contract_id=contract_id)

    if contract.status != "deleted":
        req_scopes = ['esi-contracts.read_corporation_contracts.v1',
                      'esi-characters.read_corporation_roles.v1']

        token = get_corp_token(corp_id, req_scopes, False)

        if not token:
            return False
        try:
            contracts_op = providers.esi.client.Contracts.get_corporations_corporation_id_contracts_contract_id_items(
                corporation_id=corp_id,
                contract_id=contract_id)

            try:
                contracts = etag_results(
                    contracts_op, token, force_refresh=force_refresh)
            except NotModifiedError as e:
                raise e
            except Exception as e:
                if e.status_code == 404:
                    logger.warning("CT: Contract items %s (%s) NOT FOUND ERROR" % (
                        str(_corporation.corporation.corporation_name), str(contract_id)))
                    return
                else:
                    self.retry()

            contract_models_new = []
            _types = set()
            for c in contracts:  # update labels
                _contract_item = CorporateContractItem(
                    contract=contract,
                    is_included=c.get('is_included'),
                    is_singleton=c.get('is_singleton'),
                    quantity=c.get('quantity'),
                    raw_quantity=c.get('raw_quantity'),
                    record_id=c.get('record_id'),
                    type_name_id=c.get('type_id'),
                )
                _types.add(c.get('type_id'))
                contract_models_new.append(_contract_item)
            EveItemType.objects.create_bulk_from_esi(list(_types))
            CorporateContractItem.objects.bulk_create(
                contract_models_new, batch_size=1000, ignore_conflicts=True)
        except NotModifiedError:
            logger.info("CT: No New Corporate Contract items for: {} ({})".format(
                _corporation.corporation.corporation_name, contract_id))
            pass

    return "CT: Completed Corporate Contract items %s (%s)" % (str(_corporation.corporation.corporation_name), str(contract_id))
