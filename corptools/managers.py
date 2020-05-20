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

    def create_bulk_from_esi(self, eve_ids):
        """gets bulk names with ESI"""
        if len(eve_ids) > 0:
            from corptools.models import EveName
            response = providers.esi.client.Universe.post_universe_names(
                        ids=eve_ids
                    ).result_all_pages()
            new_names = []
            for entity in response:
                new_names.append(EveName(
                                eve_id=entity['id'],
                                name=entity['name'],
                                category=entity['category']
                            ))
            self.bulk_create(new_names, ignore_conflicts=True)
            return True
        return True

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


class EveItemTypeManager(models.Manager):
    
    def get_or_create_from_esi(self, eve_id):
        """gets or creates with ESI"""
        try:
            entity = self.get(type_id=eve_id)
            created = False
        except ObjectDoesNotExist:
            entity, created = self.update_or_create_from_esi(eve_id)
        return entity, created

    def create_bulk_from_esi(self, eve_ids):
        """gets or creates with ESI"""
        from corptools.task_helpers.update_tasks import process_bulk_types_from_esi
        created = process_bulk_types_from_esi(eve_ids)       
        return created

    def update_or_create_from_esi(self, eve_id):
        """updates or create with ESI"""        
        from corptools.models import EveItemGroup

        try:
            response = providers.esi._get_eve_type(eve_id, False)
            group, created = EveItemGroup.objects.get_or_create_from_esi(response.group_id)
            entity, created = self.update_or_create(
                type_id=response.type_id,
                defaults={
                    'name': response.name,
                    'group': group,
                    'description': response.description,
                    'mass': response.mass,
                    'packaged_volume': response.packaged_volume,
                    'portion_size': response.portion_size,
                    'volume': response.volume,
                    'published': response.published,
                    'radius': response.radius,
                }
            ) 
        except Exception as e:
            logger.exception('ESI Error id {} - {}'.format(eve_id, e))
            raise e
        return entity, created

class EveGroupManager(models.Manager):
    
    def get_or_create_from_esi(self, eve_id):
        """gets or creates with ESI"""
        try:
            entity = self.get(group_id=eve_id)
            created = False
        except ObjectDoesNotExist:
            entity, created = self.update_or_create_from_esi(eve_id)
        return entity, created
        
    def update_or_create_from_esi(self, eve_id):
        """updates or create with ESI"""        
        from corptools.models import EveItemCategory

        try:
            response = providers.esi._get_group(eve_id, False)
            category, created = EveItemCategory.objects.get_or_create_from_esi(response.category_id)
            entity, created = self.update_or_create(
                group_id=response.group_id,
                defaults={
                    'name': response.name,
                    'category': category,
                }
            ) 
        except Exception as e:
            logger.exception('ESI Error id {} - {}'.format(eve_id, e))
            raise e
        return entity, created

class EveCategoryManager(models.Manager):
    
    def get_or_create_from_esi(self, eve_id):
        """gets or creates with ESI"""
        try:
            entity = self.get(category_id=eve_id)
            created = False
        except ObjectDoesNotExist:
            entity, created = self.update_or_create_from_esi(eve_id)
        return entity, created
        
    def update_or_create_from_esi(self, eve_id):
        """updates or create with ESI"""        
        try:
            response = providers.esi._get_category(eve_id, False)
            entity, created = self.update_or_create(
                category_id=response.category_id,
                defaults={
                    'name': response.name,
                }
            ) 
        except Exception as e:
            logger.exception('ESI Error id {} - {}'.format(eve_id, e))
            raise e
        return entity, created
