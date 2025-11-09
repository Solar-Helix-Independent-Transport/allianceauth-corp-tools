import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from allianceauth.eveonline.models import EveCharacter

logger = logging.getLogger(__name__)


@receiver(post_save, sender=EveCharacter)
def my_post_save_handler(sender, instance, created, **kwargs):
    # need to invalidate the roles on character corp swaps
    # we can pull new data on next refresh when the esi give it to us.
    # this will not fix issues were the data is in cache after a corp swap happened

    if not created:
        try:
            if hasattr(instance, "characteraudit"):
                ca = instance.characteraudit
                if hasattr(ca, "characterroles"):
                    roles = ca.characterroles
                    roles.director = False
                    roles.accountant = False
                    roles.station_manager = False
                    roles.personnel_manager = False
                    roles.titles.clear()
                    roles.save()
        except Exception as e:
            logger.error(e)
