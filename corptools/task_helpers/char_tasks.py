import logging
from celery import shared_task
from ..models import CharacterAudit, CorporationHistory, EveName, SkillQueue, Skill, EveItemType, CharacterAsset, CharacterWalletJournalEntry, SkillTotals, Implant, JumpClone, Clone, EveLocation

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


def update_corp_history(character_id):
    audit_char = CharacterAudit.objects.get(character__character_id=character_id)
    logger.debug("updating corp history for: {}".format(audit_char.character.character_name))

    corp_history = providers.esi.client.Character.get_characters_character_id_corporationhistory(character_id=character_id).result()

    for corp in corp_history:
        corp_name, created = EveName.objects.get_or_create_from_esi(corp.get('corporation_id'))
        history_item, created = CorporationHistory.objects \
                                .update_or_create(character=audit_char,
                                                  record_id=corp.get('record_id'),
                                                  defaults={'corporation_id': corp.get('corporation_id'),
                                                            'corporation_name': corp_name,
                                                            'is_deleted': corp.get('is_deleted', False),
                                                            'start_date': corp.get('start_date')})
    return "Finished pub data for: {}".format(audit_char.character.character_name)


def update_character_skill_list(character_id):
    audit_char = CharacterAudit.objects.get(character__character_id=character_id)
    logger.debug("Updating Skills and Queue for: {}".format(audit_char.character.character_name))

    req_scopes = ['esi-skills.read_skills.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    skills = providers.esi.client.Skills.get_characters_character_id_skills(character_id=character_id,
                                                                            token=token.valid_access_token()).result()

    Skill.objects.filter(character=audit_char).delete()  # Delete current SkillList
    
    SkillTotals.objects.update_or_create(character = audit_char,
                                         defaults = {
                                             'total_sp':skills.get('total_sp', 0),
                                             'unallocated_sp':skills.get('unallocated_sp', 0)
                                         })

    _check_skills = []
    _create_skills = []
    for skill in skills.get('skills', []):
        _check_skills.append(skill.get('skill_id'))
        _skill = Skill(character=audit_char, 
                        skill_id=skill.get('skill_id'),
                        skill_name_id=skill.get('skill_id'),
                        active_skill_level=skill.get('active_skill_level'),
                        skillpoints_in_skill=skill.get('skillpoints_in_skill'),
                        trained_skill_level=skill.get('trained_skill_level'))

        _create_skills.append(_skill)

    EveItemType.objects.create_bulk_from_esi(_check_skills)
    Skill.objects.bulk_create(_create_skills)
    return "Finished skills for: {}".format(audit_char.character.character_name)


def update_character_skill_queue(character_id):
    audit_char = CharacterAudit.objects.get(character__character_id=character_id)
    logger.debug("Updating Skills and Queue for: {}".format(audit_char.character.character_name))

    req_scopes = ['esi-skills.read_skillqueue.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    queue = providers.esi.client.Skills.get_characters_character_id_skillqueue(character_id=character_id,
                                                                               token=token.valid_access_token()).result()

    SkillQueue.objects.filter(character=audit_char).delete()  # Delete current SkillList
    
    items = []
    _check_skills = []
    for item in queue:
        _check_skills.append(item.get('skill_id'))
        queue_item = SkillQueue(character=audit_char,
                                finish_level=item.get('finished_level'), 
                                queue_position=item.get('queue_position'),
                                skill_id=item.get('skill_id'), 
                                skill_name_id=item.get('skill_id'),
                                finish_date=item.get('finish_date', None),
                                level_end_sp=item.get('level_end_sp', None),
                                level_start_sp=item.get('level_start_sp', None),
                                start_date=item.get('start_date', None),
                                training_start_sp=item.get('training_start_sp', None))
        items.append(queue_item)
    EveItemType.objects.create_bulk_from_esi(_check_skills)
    SkillQueue.objects.bulk_create(items)
    return "Finished skill queue for: {}".format(audit_char.character.character_name)


def update_character_assets(character_id):
    audit_char = CharacterAudit.objects.get(character__character_id=character_id)
    logger.debug("Updating Assets for: {}".format(audit_char.character.character_name))

    req_scopes = ['esi-assets.read_assets.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    assets = providers.esi.client.Assets.get_characters_character_id_assets(character_id=character_id,
                                                                            token=token.valid_access_token()).results()

    delete_query = CharacterAsset.objects.filter(character=audit_char)  # Flush Assets
    if delete_query.exists():
        delete_query._raw_delete(delete_query.db) # speed and we are not caring about f-keys or signals on these models 


    _current_type_ids = []
    items = []
    for item in assets:
        if item.get('type_id') not in _current_type_ids:
            _current_type_ids.append(item.get('type_id'))

        asset_item = CharacterAsset(character=audit_char,
                                    blueprint_copy=item.get('is_blueprint_copy'), 
                                    singleton=item.get('is_singleton'),
                                    item_id=item.get('item_id'), 
                                    location_flag=item.get('location_flag'),
                                    location_id=item.get('location_id'),
                                    location_type=item.get('location_type'),
                                    quantity=item.get('quantity'),
                                    type_id=item.get('type_id'),
                                    type_name_id=item.get('type_id')
                                    )
        items.append(asset_item)
    EveItemType.objects.create_bulk_from_esi(_current_type_ids)
    CharacterAsset.objects.bulk_create(items)
    return "Finished assets for: {}".format(audit_char.character.character_name)


def update_character_wallet(character_id):
    audit_char = CharacterAudit.objects.get(character__character_id=character_id)
    logger.debug("Updating wallet transactions for: {}".format(audit_char.character.character_name))

    req_scopes = ['esi-wallet.read_character_wallet.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    journal_items = providers.esi.client.Wallet.get_characters_character_id_wallet_journal(character_id=character_id,
                                                                            token=token.valid_access_token()).results()

    _current_journal = CharacterWalletJournalEntry.objects.filter(character=audit_char).values_list('entry_id', flat=True) # TODO add time filter
    _current_eve_ids = list(EveName.objects.all().values_list('eve_id', flat=True))

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
                
            asset_item = CharacterWalletJournalEntry(character=audit_char,
                                        amount=item.get('amount'), 
                                        balance=item.get('balance'),
                                        context_id=item.get('context_id'), 
                                        context_id_type=item.get('context_id_type'),
                                        date=item.get('date'),
                                        description=item.get('description'),
                                        first_party_id=item.get('first_party_id'),
                                        first_party_name_id=item.get('first_party_id'),
                                        entry_id=item.get('id'),
                                        reason=item.get('reason'),
                                        ref_type=item.get('ref_type'),
                                        second_party_id=item.get('second_party_id'),
                                        second_party_name_id=item.get('second_party_id'),
                                        tax=item.get('tax'),
                                        tax_receiver_id=item.get('tax_receiver_id'),
                                        )
            items.append(asset_item)

    created_names = EveName.objects.create_bulk_from_esi(_new_names)

    wallet_ballance = providers.esi.client.Wallet.get_characters_character_id_wallet(character_id=character_id,
                                                                            token=token.valid_access_token()).result()

    audit_char.balance=wallet_ballance
    audit_char.save()

    if created_names:
        CharacterWalletJournalEntry.objects.bulk_create(items)
    else: 
        raise Exception("ESI Fail")

    return "Finished wallet transactions for: {}".format(audit_char.character.character_name)

def update_character_clones(character_id):
    audit_char = CharacterAudit.objects.get(character__character_id=character_id)
    logger.debug("Updating Clones and Implants for: {}".format(audit_char.character.character_name))

    req_scopes = ['esi-clones.read_clones.v1', 'esi-clones.read_implants.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"
    
    jump_clones = providers.esi.client.Clones.get_characters_character_id_clones(character_id=character_id,
                                        token=token.valid_access_token()).result()
    
    active_clone = providers.esi.client.Clones.get_characters_character_id_implants(character_id=character_id,
                                        token=token.valid_access_token()).result()

    all_locations = list(EveLocation.objects.all().values_list('location_id', flat=True))
    clones = {}
    clones[0] = active_clone
    
    char_clone, created = Clone.objects.update_or_create(character=audit_char, 
                                                    defaults={
                                                        'last_clone_jump_date': jump_clones.get('last_clone_jump_date'),
                                                        'last_station_change_date': jump_clones.get('last_station_change_date'),
                                                        'location_id': jump_clones.get('home_location').get('location_id'),
                                                        'location_type': jump_clones.get('home_location').get('location_type'),
                                                    })
    
    JumpClone.objects.filter(character=audit_char).delete() # remove all
    implants = []
    type_ids = []

    for clone in jump_clones.get('jump_clones'):
        _jumpclone = JumpClone(character=audit_char, 
                                jump_clone_id=clone.get('jump_clone_id'), 
                                location_id=clone.get('location_id'), 
                                location_type=clone.get('location_type'), 
                                name=clone.get('name'))
        if clone.get('location_id') in all_locations:
            _jumpclone.location_name_id = clone.get('location_id')
        
        _jumpclone.save()
        
        for implant in clone.get('implants'):
            if implant not in type_ids:
                type_ids.append(implant)
            implants.append(Implant(clone=_jumpclone,
                                    type_name_id=implant
                                    )
                            )

    _jumpclone = JumpClone.objects.create(character=audit_char,
                                            jump_clone_id=0,
                                            name="Active Clone")

    for implant in active_clone:
        if implant not in type_ids:
            type_ids.append(implant)
        implants.append(Implant(clone=_jumpclone,
                                type_name_id=implant,
                                )
                        )

    EveItemType.objects.create_bulk_from_esi(type_ids)
    Implant.objects.bulk_create(implants)