from django.db import models
from django.core.exceptions import ObjectDoesNotExist
import logging

from esi.clients import esi_client_factory
from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo, EveAllianceInfo
from . import providers

logger = logging.getLogger(__name__)


class EveNameManager(models.Manager):
    
    def get_or_create_from_esi(self, eve_id):
        """gets or creates with ESI"""
        try:
            entity = self.get(eve_id=eve_id)
            created = False
        except ObjectDoesNotExist:
            entity, created = self.update_or_create_from_esi(eve_id)
        return entity, created
        
    def update_or_create_from_esi(self, eve_id):
        """updates or create with ESI"""        
        try:
            response = providers.esi.client.Universe.post_universe_names(
                        ids=[eve_id]
                    ).result()
            entity, created = self.update_or_create(
                eve_id=response[0]['id'],
                defaults={
                    'name': response[0]['name'],
                    'category': response[0]['category'],
                }
            ) 
        except Exception as e:
            logger.exception('ESI Error id {} - {}'.format(eve_id, e))
            raise e
        return entity, created

    def update_or_create_from_eve_model(self, eve_id):
        """updates or create character/corporation/alliancename models from an EveCharacter or falls over to ESI to do so"""
        
        try:
            character = EveCharacter.objects.get_character_by_id(eve_id)
            alliance = None
            if not character.alliance_id:
                alliance, created_alli = self.update_or_create(
                    eve_id=character.alliance_id,
                    defaults={
                        'name': character.alliance_name,
                        'category': self.ALLIANCE,
                    }
                )

            corporation, created_corp = self.update_or_create(
                eve_id=character.corporation_id,
                defaults={
                    'name': character.corporation_name,
                    'category': self.CORPORATION,
                    'alliance':alliance
                }
            )

            character, created = self.update_or_create(
                eve_id=character.character_id,
                defaults={
                    'name': character.character_name,
                    'category': self.CHARACTER,
                    'corporation': corporation,
                    'alliance': alliance
                }
            )
        
        except ObjectDoesNotExist as e:
            logger.exception('Failed to create name: {} - {}'.format(eve_id, e)) # TODO Fallback to ESI
            raise e

        return character, created


