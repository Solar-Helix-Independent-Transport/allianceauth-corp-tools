import logging
from celery import shared_task
from ..models import CharacterAudit, CorporationHistory, EveName, Token  # Todo 

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

@shared_task
def update_character_skills(character_id):
    audit_char = CharacterAudit.objects.get(character__character_id=character_id)
    logger.debug("Updating Skills and Queue for: {}".format(audit_char.character.character_name))

    req_scopes = ['esi-skills.read_skills.v1', 'esi-skills.read_skillqueue.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return "No Tokens"

    skills = providers.esi.client.Skills.get_characters_character_id_skills(character_id=character_id,
                                                                            token=token.valid_access_token()).result()

    # Update SeatCharacter model with correct SP values.
    #seat_char.total_sp = skills.get('total_sp', 0)
    #seat_char.unallocated_sp = skills.get('unallocated_sp', 0)
    #seat_char.save()

    for skill in skills.get('skills', []):

        skill_item, created = Skill.objects \
            .update_or_create(character=seat_char, skill_id=skill.get('skill_id'),
                              defaults={
                                  'active_skill_level': skill.get('active_skill_level'),
                                  'skillpoints_in_skill': skill.get('skillpoints_in_skill'),
                                  'trained_skill_level': skill.get('trained_skill_level')})

    # ----- Skill Queue -----
    SkillQueue.objects.filter(character=seat_char).delete()  # Delete current SkillQueue

    queue = c.Skills.get_characters_character_id_skillqueue(character_id=character_id).result()

    items = []
    for item in queue:
        queue_item = SkillQueue(character=seat_char,
                                finish_level=item.get('finished_level'), 
                                queue_position=item.get('queue_position'),
                                skill_id=item.get('skill_id'), 
                                finish_date=item.get('finish_date', None),
                                level_end_sp=item.get('level_end_sp', None),
                                level_start_sp=item.get('level_start_sp', None),
                                start_date=item.get('start_date', None),
                                training_start_sp=item.get('training_start_sp', None))
        items.append(queue_item)
    SkillQueue.objects.bulk_create(items)

    