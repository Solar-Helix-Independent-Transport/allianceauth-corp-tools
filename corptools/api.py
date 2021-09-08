from typing import List
from corptools import app_settings

from ninja import NinjaAPI
from ninja.security import django_auth
from ninja.responses import codes_4xx

from django.core.exceptions import PermissionDenied
from allianceauth.eveonline.models import EveCharacter

from . import models
from . import schema

import logging

logger = logging.getLogger(__name__)


api = NinjaAPI(title="CorpTools API", version="0.0.1",
               urls_namespace='corptools:api', auth=django_auth, csrf=True)


def get_alts_queryset(request, character_id):
    perms = True
    main_char = EveCharacter.objects\
        .select_related('character_ownership', 'character_ownership__user__profile', 'character_ownership__user__profile__main_character', )\
        .get(character_id=character_id)\
        .character_ownership.user.profile.main_character

    linked_characters = main_char.character_ownership.user.character_ownerships.all(
    ).values_list('character_id', flat=True)
    # check access
    visible = models.CharacterAudit.objects.visible_to(
        request.user).values_list('character_id', flat=True)

    if main_char.id not in visible:
        account_chars = request.user.profile.main_character.character_ownership.user.character_ownerships.all(
        ).values_list('character_id', flat=True)
        logger.warning(
            f"{request.user} Can See {list(visible)}, requested {main_char.id}")
        if main_char.id in account_chars:
            pass
        else:
            perms = False

    if not request.user.has_perm('corptools.view_characteraudit'):
        logger.warning(
            f"{request.user} does not have Perm requested, Requested {main_char.id}")
        perms = False

    character_id = main_char.character_id

    return perms, EveCharacter.objects.filter(id__in=linked_characters)


@api.get(
    "characters/{character_id}/status",
    response={200: List[schema.CharacterStatus], 403: schema.Message},
)
def get_character_status(request, character_id: int):
    response, characters = get_alts_queryset(request, character_id)
    if not response:
        return 403, {"message": "Permission Denied"}
    characters = characters.select_related('characteraudit')
    output = []
    for character in characters:
        _o = {
            "character_name": character.character_name,
            "character_id": character.character_id,
            "corporation_id": character.corporation_id,
            "corporation_name": character.corporation_name,
            "alliance_id": character.alliance_id,
            "alliance_name": character.alliance_name,
            "isk": 0,
            "active": False
        }
        try:
            _updates = []
            for grp in app_settings.get_character_update_attributes():
                _updates.append({"data": grp[0], "updated": getattr(
                    character.characteraudit, grp[1])})
            _o.update({
                "isk": character.characteraudit.balance,
                "active": character.characteraudit.is_active(),
                "last_updates": _updates
            })
        except models.CharacterAudit.DoesNotExist:
            pass
        output.append(_o)
    return 200, output
