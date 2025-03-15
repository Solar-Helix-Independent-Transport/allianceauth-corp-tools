from typing import List

from ninja import NinjaAPI

from django.db.models import F

from corptools import models
from corptools.api import schema

# from ninja.decorators import decorate_view

# from django.views.decorators.cache import cache_page

# from corptools.api.decorators import cache_page_data


class ListApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/list",
            response={200: List[schema.AccountStatus], 403: str},
            tags=self.tags
        )
        # @decorate_view(cache_page(300))
        def get_account_list(request, orphans=False):
            characters = models.CharacterAudit.objects.visible_eve_characters(
                request.user
            ).filter(
                character_id=F(
                    "character_ownership__user__profile__main_character__character_id")
            ).select_related(
                'character_ownership',
                'character_ownership__user__profile',
                'character_ownership__user__profile__main_character',
                'characteraudit'
            ).prefetch_related(
                'character_ownership__user__character_ownerships',
                'character_ownership__user__character_ownerships__character',
                'character_ownership__user__character_ownerships__character__characteraudit'
            )

            character_ids = []
            output = {}
            for char in characters:
                main = char.character_ownership.user.profile.main_character
                for c in char.character_ownership.user.character_ownerships.all():
                    if char.character_id not in output:
                        output[main.character_id] = {
                            "main": main,
                            "characters": []
                        }
                    active = False
                    try:
                        # active = c.character.characteraudit.is_active()
                        active = c.character.characteraudit.active
                    except models.CharacterAudit.DoesNotExist:
                        pass
                    character_ids.append(c.character.character_id)
                    output[main.character_id]["characters"].append(
                        {
                            "character": c.character,
                            "active": active
                        }
                    )

            if orphans:
                orphans = models.CharacterAudit.objects.visible_to(
                    request.user).exclude(character__character_id__in=character_ids)\
                    .select_related('character__character_ownership',
                                    'character__character_ownership__user__profile',
                                    'character__character_ownership__user__profile__main_character',
                                    'character__characteraudit')\
                    .prefetch_related('character__character_ownership__user__character_ownerships')\
                    .prefetch_related('character__character_ownership__user__character_ownerships__character')\
                    .prefetch_related('character__character_ownership__user__character_ownerships__character__characteraudit')\

                for char in orphans:
                    try:
                        main = char.character.character_ownership.user.profile.main_character
                        if main.character_id not in output:
                            output[main.character_id] = {
                                "main": main,
                                "characters": [{
                                    "character": main,
                                    "active": False
                                }]
                            }
                        active = False
                        try:
                            # active = char.character.characteraudit.is_active()
                            active = char.character.characteraudit.active
                        except models.CharacterAudit.DoesNotExist:
                            pass
                        output[main.character_id]["characters"].append(
                            {
                                "character": char.character,
                                "active": active
                            }
                        )
                    except Exception:
                        main = char.character
                        active = False
                        try:
                            active = char.character.characteraudit.is_active()
                        except models.CharacterAudit.DoesNotExist:
                            pass
                        output[main.character_id] = {
                            "main": main,
                            "orphan": True,
                            "characters": [{
                                "character": char.character,
                                "active": active
                            }]
                        }

            return list(output.values())
