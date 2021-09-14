from typing import List
from corptools import app_settings

from ninja import NinjaAPI
from ninja.security import django_auth
from ninja.responses import codes_4xx

from django.core.exceptions import PermissionDenied
from django.db.models import F, Sum
from allianceauth.eveonline.models import EveCharacter

from . import models
from . import schema

import logging

logger = logging.getLogger(__name__)


api = NinjaAPI(title="CorpTools API", version="0.0.1",
               urls_namespace='corptools:api', auth=django_auth, csrf=True)


def get_main_character(request, character_id):
    perms = True
    main_char = EveCharacter.objects\
        .select_related('character_ownership', 'character_ownership__user__profile', 'character_ownership__user__profile__main_character', )\
        .get(character_id=character_id)\
        .character_ownership.user.profile.main_character

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

    return perms, main_char


def get_alts_queryset(main_char):
    linked_characters = main_char.character_ownership.user.character_ownerships.all(
    ).values_list('character_id', flat=True)

    return EveCharacter.objects.filter(id__in=linked_characters)


@api.get(
    "characters/{character_id}/status",
    response={200: schema.AccountStatus, 403: schema.Message},
    tags=["Character"]
)
def get_character_status(request, character_id: int):
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    char_skill_total = models.Skill.objects\
        .filter(character__character__in=characters)\
        .values('character')\
        .annotate(char=F('character__character__character_id'))\
        .annotate(total_sp=Sum('skillpoints_in_skill'))

    skills = {}

    for c in char_skill_total:
        skills[c.get('char')] = c.get('total_sp')

    characters = characters.select_related('characteraudit')
    output = {"characters": [],
              "main": {  # Todo map model to fields
        "character_name": main.character_name,
        "character_id": main.character_id,
        "corporation_id": main.corporation_id,
        "corporation_name": main.corporation_name,
        "alliance_id": main.alliance_id,
        "alliance_name": main.alliance_name,
    }}
    for character in characters:
        _o = {
            "character": {  # Todo map model to fields
                "character_name": character.character_name,
                "character_id": character.character_id,
                "corporation_id": character.corporation_id,
                "corporation_name": character.corporation_name,
                "alliance_id": character.alliance_id,
                "alliance_name": character.alliance_name,
            },
            "isk": 0,
            "sp": skills.get(character.character_id, 0),
            "active": False,
            "last_updates": None
        }
        try:
            _updates = {}
            for grp in app_settings.get_character_update_attributes():
                _updates[grp[0]] = getattr(
                    character.characteraudit, grp[1])
            _o.update({
                "isk": character.characteraudit.balance,
                "active": character.characteraudit.is_active(),
                "last_updates": _updates
            })
        except models.CharacterAudit.DoesNotExist:
            pass
        output["characters"].append(_o)
    return 200, output


@api.get(
    "characters/{character_id}/pubdata",
    response={200: List[schema.CharacterHistory], 403: schema.Message},
    tags=["Character"]
)
def get_character_pubdata(request, character_id: int):
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    corp_histories = models.CorporationHistory.objects\
        .filter(character__character__in=characters)\
        .select_related('character__character', 'corporation_name')

    histories = {}
    for h in corp_histories:
        if h.character.character_id not in histories:
            histories[h.character.character_id] = []
        histories[h.character.character_id].append({
            "corporation": {
                "corporation_name": h.corporation_name.name,
                "corporation_id": h.corporation_name.eve_id,
            },
            "start": h.start_date
        })
        if h.corporation_name.alliance:
            histories[h.character.character_id]['corporation'].update({
                "alliance_id": h.corporation_name.alliance.eve_id,
                "alliance_name": h.corporation_name.alliance.alliance_name,
            })

    char_skill_total = models.Skill.objects\
        .filter(character__character__in=characters)\
        .values('character')\
        .annotate(char=F('character__character__character_id'))\
        .annotate(total_sp=Sum('skillpoints_in_skill'))

    skills = {}

    for c in char_skill_total:
        skills[c.get('char')] = c.get('total_sp')

    characters = characters.select_related('characteraudit')
    output = []

    for character in characters:
        _o = {
            "character": {  # Todo map model to fields
                "character_name": character.character_name,
                "character_id": character.character_id,
                "corporation_id": character.corporation_id,
                "corporation_name": character.corporation_name,
                "alliance_id": character.alliance_id,
                "alliance_name": character.alliance_name,
            },
        }
        try:
            _o.update({
                "history": histories[character.id],
            })
        except KeyError:
            pass
        output.append(_o)
    return 200, output


@api.get(
    "characters/menu",
    response=List[schema.MenuCategory],
    tags=["Helpers"]

)
def get_character_menu(request):
    _inter = {
        "name": "Interactions",
        "links": []
    }
    _finance = {
        "name": "Finances",
        "links": []
    }
    _char = {
        "name": "Character",
        "links": []
    }

    if app_settings.CT_CHAR_CONTACTS_MODULE:
        _inter["links"].append({
            "name": "Contact",
            "link": "/character/contact"
        })

    if app_settings.CT_CHAR_STANDINGS_MODULE:
        _inter["links"].append({
            "name": "Standings",
            "link": "/character/standings"
        })

    if app_settings.CT_CHAR_WALLET_MODULE:
        _finance["links"].append({
            "name": "Wallet",
            "link": "/character/wallet"
        })
        _finance["links"].append({
            "name": "Market",
            "link": "/character/market"
        })
    if app_settings.CT_CHAR_ASSETS_MODULE:
        _char["links"].append({
            "name": "Assets",
            "link": "/character/assets"
        })

    if app_settings.CT_CHAR_CLONES_MODULE:
        _char["links"].append({
            "name": "Clones",
            "link": "/character/clones"
        })

    if app_settings.CT_CHAR_ROLES_MODULE:
        _char["links"].append({
            "name": "Roles",
            "link": "/character/roles"
        })

    if app_settings.CT_CHAR_MAIL_MODULE:
        _char["links"].append({
            "name": "Mail",
            "link": "/character/mail"
        })

    if app_settings.CT_CHAR_SKILLS_MODULE:
        _char["links"].append({
            "name": "Skills",
            "link": "/character/skills"
        })

    return [_char, _finance, _inter]
