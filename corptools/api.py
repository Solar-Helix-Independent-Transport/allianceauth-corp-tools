from typing import List
from allianceauth import notifications
from corptools import app_settings
from django.utils.timezone import activate

from ninja import NinjaAPI, Form, main
from ninja.security import django_auth
from ninja.responses import codes_4xx

from django.core.exceptions import PermissionDenied
from django.db.models import F, Sum, Q
from allianceauth.eveonline.models import EveCharacter
from django.conf import settings

from . import models
from . import tasks
from . import schema
from . import providers

import logging

logger = logging.getLogger(__name__)


api = NinjaAPI(title="CorpTools API", version="0.0.1",
               urls_namespace='corptools:api', auth=django_auth, csrf=True,
               openapi_url=settings.DEBUG and "/openapi.json" or "")


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
    "account/{character_id}/status",
    response={200: schema.AccountStatus, 403: schema.Message},
    tags=["Account"]
)
def get_character_status(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
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
              "main": main
              }
    for character in characters:
        _o = {
            "character": character,
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
    "account/{character_id}/pubdata",
    response={200: List[schema.CharacterHistory], 403: schema.Message},
    tags=["Account"]
)
def get_character_pubdata(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id

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
            "character": character,
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
    "account/menu",
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
            "link": "/account/contact"
        })

    if app_settings.CT_CHAR_NOTIFICATIONS_MODULE:
        _inter["links"].append({
            "name": "Notifications",
            "link": "/account/notifications"
        })

    if app_settings.CT_CHAR_STANDINGS_MODULE:
        _inter["links"].append({
            "name": "Standings",
            "link": "/account/standings"
        })

    if app_settings.CT_CHAR_WALLET_MODULE:
        _finance["links"].append({
            "name": "Wallet",
            "link": "/account/wallet"
        })
        _finance["links"].append({
            "name": "Market",
            "link": "/account/market"
        })
    if app_settings.CT_CHAR_ASSETS_MODULE:
        _char["links"].append({
            "name": "Assets",
            "link": "/account/assets"
        })

    if app_settings.CT_CHAR_CLONES_MODULE:
        _char["links"].append({
            "name": "Clones",
            "link": "/account/clones"
        })

    if app_settings.CT_CHAR_ROLES_MODULE:
        _char["links"].append({
            "name": "Roles",
            "link": "/account/roles"
        })

    if app_settings.CT_CHAR_MAIL_MODULE:
        _char["links"].append({
            "name": "Mail",
            "link": "/account/mail"
        })

    if app_settings.CT_CHAR_SKILLS_MODULE:
        _char["links"].append({
            "name": "Skills",
            "link": "/account/skills"
        })

    return [_char, _finance, _inter]


@api.get(
    "account/{character_id}/asset/locations",
    response={200: List[schema.ValueLabel], 403: schema.Message},
    tags=["Account"]
)
def get_character_asset_locations(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    asset_locs = models.CharacterAsset.objects.filter(character__character__in=characters,
                                                      location_name__isnull=False).values_list('location_name').distinct()
    asset_locs = models.EveLocation.objects.filter(
        location_id__in=asset_locs).order_by('location_name')

    asset_locations = [{"label": "Everywhere", "value": 0},
                       {"label": "AssetSafety", "value": 2004}, ]
    for loc in asset_locs:
        asset_locations.append({
            "label": loc.location_name,
            "value": loc.location_id
        })

    return asset_locations


"""
@api.get(
    "account/{character_id}/asset/{location_id}/list",
    response={200: List[schema.CharacterAssetGroups], 403: schema.Message},
    tags=["Account"]
)
def get_character_asset_list(request, character_id: int, location_id: int):
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)
"""


@api.get(
    "account/{character_id}/asset/{location_id}/groups",
    response={200: List[schema.CharacterAssetGroups], 403: schema.Message},
    tags=["Account"]
)
def get_character_asset_groups(request, character_id: int, location_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    capital_groups = [30, 547, 659, 1538, 485, 902, 513, 883]
    subcap_cat = [6]
    noteable_cats = [4, 20, 23, 25, 34, 35, 87, 91]
    structure_cats = [22, 24, 40, 41, 46, 65, 66, ]
    bpo_cats = [9]

    assets = models.CharacterAsset.objects\
        .filter((Q(blueprint_copy=None) | Q(blueprint_copy=False)),
                character__character__in=characters)

    if location_id == 2004:
        asset_locations = assets.filter(
            location_flag="AssetSafety").values_list('item_id')
        assets = assets.filter(location_id__in=asset_locations)
    elif location_id != 0:
        asset_locations = assets.filter(
            location_name_id=int(location_id)).values_list('item_id')
        assets = assets.filter(Q(location_name_id=int(location_id)) | Q(
            location_id__in=asset_locations) | Q(location_id=int(location_id)))

    assets = assets.values('type_name__group__group_id')\
        .annotate(grp_total=Sum('quantity'))\
        .annotate(grp_name=F('type_name__group__name'))\
        .annotate(grp_id=F('type_name__group_id'))\
        .annotate(cat_id=F('type_name__group__category_id'))\
        .order_by('-grp_total')

    capital_asset_groups = []
    subcap_asset_groups = []
    noteable_asset_groups = []
    structure_asset_groups = []
    bpo_asset_groups = []
    remaining_asset_groups = []

    for grp in assets:
        _grp = {
            "label": grp['grp_name'],
            "value": grp['grp_total'],
        }
        if grp['grp_id'] in capital_groups:
            capital_asset_groups.append(_grp)
        elif grp['cat_id'] in subcap_cat:
            subcap_asset_groups.append(_grp)
        elif grp['cat_id'] in noteable_cats:
            noteable_asset_groups.append(_grp)
        elif grp['cat_id'] in structure_cats:
            structure_asset_groups.append(_grp)
        elif grp['cat_id'] in bpo_cats:
            bpo_asset_groups.append(_grp)
        else:
            remaining_asset_groups.append(_grp)

    return [
        {"name": "Capital Ships",
         "items": capital_asset_groups},
        {"name": "Subcaps Ships",
         "items": subcap_asset_groups},
        {"name": "Noteable Assets",
         "items": noteable_asset_groups},
        {"name": "Structures",
         "items": structure_asset_groups},
        {"name": "BPO",
         "items": bpo_asset_groups},
        {"name": "Remaining",
         "items": remaining_asset_groups},
    ]


@api.get(
    "account/{character_id}/clones",
    response={200: List[schema.CharacterClones], 403: schema.Message},
    tags=["Account"]
)
def get_character_clones(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    jump_clones = models.JumpClone.objects\
        .filter(character__character__in=characters)\
        .select_related('character__character', 'location_name').prefetch_related('implant_set', 'implant_set__type_name')
    clones = models.Clone.objects\
        .filter(character__character__in=characters)\
        .select_related('character__character', 'location_name')

    table_data = {}
    for char in characters:
        table_data[char.character_name] = {
            "character": char,
            "clones": [],
            "home": None,
            "last_station_change": None,
            "last_clone_jump": None
        }

    for j in jump_clones:
        implants = []
        for i in j.implant_set.all():
            implants.append({
                "id": i.type_name_id,
                "name": i.type_name.name
            })
        loc = None
        if j.location_name:
            loc = {"id": j.location_name_id,
                   "name": j.location_name.location_name}
        table_data[j.character.character.character_name]["clones"].append({
            "name": j.name,
            "location": loc,
            "implants": implants
        }
        )

    for c in clones:
        table_data[c.character.character.character_name]["home"] = {
            "id": c.location_id,
            "name": c.location_name.location_name
        }
        table_data[c.character.character.character_name]["last_station_change"] = c.last_station_change_date
        table_data[c.character.character.character_name]["last_clone_jump"] = c.last_clone_jump_date

    return list(table_data.values())


@api.get(
    "account/{character_id}/roles",
    response={200: List[schema.CharacterRoles], 403: schema.Message},
    tags=["Account"]
)
def get_character_roles(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    roles_data = models.CharacterRoles.objects\
        .filter(character__character__in=characters)\
        .select_related('character__character').prefetch_related('titles')

    output = []
    for r in roles_data:
        titles = []
        for t in r.titles.all():
            titles.append({
                "id": t.title_id,
                "name": t.title
            })
        output.append({
            "character": r.character.character,
            "director": r.director,
            "station_manager": r.station_manager,
            "personnel_manager": r.personnel_manager,
            "accountant": r.accountant,
            "titles": titles
        })
    return output


@api.get(
    "account/{character_id}/wallet",
    response={200: List[schema.CharacterWalletEvent], 403: schema.Message},
    tags=["Account"]
)
def get_character_wallet(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    wallet_journal = models.CharacterWalletJournalEntry.objects\
        .filter(character__character__in=characters)\
        .select_related('first_party_name', 'second_party_name', 'character__character').order_by('-date')

    output = []
    for w in wallet_journal:
        output.append(
            {
                "character": w.character.character,
                "id": w.entry_id,
                "date": w.date,
                "first_party": {
                    "id": w.first_party_id,
                    "name": w.first_party_name.name,
                    "cat": w.first_party_name.category,
                },
                "second_party":  {
                    "id": w.second_party_id,
                    "name": w.second_party_name.name,
                    "cat": w.second_party_name.category,
                },
                "ref_type": w.ref_type,
                "amount": w.amount,
                "balance": w.balance,
                "reason": w.reason,
            })

    return output


@api.get(
    "account/{character_id}/orders",
    response={200: List[schema.CharacterOrder], 403: schema.Message},
    tags=["Account"]
)
def get_character_orders(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    orders = models.CharacterMarketOrder.objects\
        .filter(character__character__in=characters)\
        .select_related('type_name', 'location_name', 'character__character')

    output = []
    for w in orders:
        output.append(
            {
                "character": w.character.character,
                "date": w.issued,
                "duration": w.duration,
                "volume_min": w.min_volume,
                "volume_remain": w.volume_remain,
                "volume_total": w.volume_total,
                "item": {
                    "id": w.type_id,
                    "name": w.type_name.name
                },
                "price": w.price,
                "escrow": w.escrow,
                "buy_order": w.is_buy_order,
                "location": {
                    "id": w.location_id,
                    "name": w.location_name.location_name
                }
            }
        )

    return output


@api.get(
    "account/{character_id}/contacts",
    response={200: List[schema.Contact], 403: schema.Message},
    tags=["Account"]
)
def get_character_contacts(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    contacts = models.CharacterContact.objects\
        .filter(character__character__in=characters)\
        .select_related('character__character', 'contact_name') \
        .prefetch_related('labels')

    output = []

    for c in contacts:
        labels = []
        for l in c.labels.all():
            labels.append({
                "value": l.label_id,
                "label": l.label_name
            })
        output.append({
            "character": c.character.character,
            "contact": {
                "id": c.contact_id,
                "name": c.contact_name.name,
                "cat": c.contact_type
            },
            "standing": c.standing,
            "labels": labels
        })

    return output


"""
@api.get(
    "account/{character_id}/contracts",
    response={200: List[schema.CharacterAssetGroups], 403: schema.Message},
    tags=["Account"]
)
def get_character_contracts(request, character_id: int):
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)
"""
"""
@api.get(
    "account/{character_id}/standings",
    response={200: List[schema.CharacterAssetGroups], 403: schema.Message},
    tags=["Account"]
)
def get_character_standings(request, character_id: int):
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    contacts = models.CharacterStandings.objects\
        .filter(character__character__in=characters)\
        .select_related('character__character', 'contact_name') \
        .prefetch_related('labels')

    output = []

    for c in contacts:
        labels = []
        for l in c.labels.all():
            labels.append({
                "value": l.label_id,
                "label": l.label_name
            })
        output.append({
            "character": c.character.character,
            "contact": {
                "id": c.contact_id,
                "name": c.contact_name.name,
                "cat": c.contact_type
            },
            "standing": c.standing,
            "labels": labels
        })

    return output
"""


@api.get(
    "account/{character_id}/notifications",
    response={200: List[schema.CharacterNotification], 403: schema.Message},
    tags=["Account"]
)
def get_character_notifications(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    notes = models.Notification.objects\
        .filter(character__character__in=characters)\
        .select_related('character__character', 'notification_text').order_by('-timestamp')[:1000]

    output = []

    for n in notes:
        output.append({
            "character": n.character.character,
            "notification_text": n.notification_text.notification_text,
            "notification_type": n.notification_type,
            "timestamp": n.timestamp,
            "is_read": n.is_read,
        })

    return output


@api.get(
    "account/{character_id}/skills",
    response={200: List[schema.CharacterSkills], 403: schema.Message},
    tags=["Account"]
)
def get_character_skills(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    skills = models.Skill.objects.filter(character__character__in=characters)\
        .select_related('character__character', 'skill_name', "skill_name__group")

    totals = models.SkillTotals.objects.filter(character__character__in=characters)\
        .select_related('character__character')

    output = {}

    for s in skills:
        if s.character_id not in output:
            output[s.character_id] = {
                "character": s.character.character,
                "skills": [],
                "total_sp": 0,
                "unallocated_sp": 0
            }
        output[s.character_id]["skills"].append(
            {
                "group": s.skill_name.group.name,
                "skill": s.skill_name.name,
                "sp": s.skillpoints_in_skill,
                "level": s.trained_skill_level,
                "active": s.active_skill_level,
            }
        )

    for t in totals:
        if t.character_id in output:
            output[t.character_id]["unallocated_sp"] = t.unallocated_sp
            output[t.character_id]["total_sp"] = t.total_sp

    return list(output.values())


@api.get(
    "account/{character_id}/skillqueues",
    response={200: List[schema.CharacterQueue], 403: schema.Message},
    tags=["Account"]
)
def get_character_skillqueues(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    skills = models.SkillQueue.objects.filter(character__character__in=characters)\
        .select_related('character__character', 'skill_name', "skill_name__group")

    output = {}

    for s in skills:
        if s.character_id not in output:
            output[s.character_id] = {
                "character": s.character.character,
                "queue": [],
            }
        output[s.character_id]["queue"].append(
            {
                "skill": s.skill_name.group.name,
                "group": s.skill_name.name,
                "end_level": s.finish_level,
                "start_sp": s.level_start_sp,
                "end_sp": s.level_end_sp,
                "start": s.start_date,
                "end": s.finish_date,
            }
        )

    return list(output.values())


@api.post(
    "characters/refresh",
    response={200: schema.Message, 403: schema.Message},
    tags=["Characters"]
)
def post_characters_refresh(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    audits_visible = models.CharacterAudit.objects.visible_to(
        request.user).values_list('character_id', flat=True)
    if character_id in audits_visible:
        tasks.update_character.apply_async(args=[character_id], priority=4)
    return 200, {"message": "Requested Update!"}


@api.post(
    "account/refresh",
    response={200: schema.Message, 403: schema.Message},
    tags=["Characters"]
)
def post_acccount_refresh(request, character_id: int):
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    for cid in characters.values_list('character_id', flat=True):
        tasks.update_character.apply_async(args=[cid], priority=4)
    return 200, {"message": "Requested Update!"}


@api.get(
    "account/list",
    response={200: List[schema.AccountStatus], 403: schema.Message},
    tags=["Account"]
)
def get_account_list(request):
    characters = models.CharacterAudit.objects.visible_to(
        request.user).select_related('character__character_ownership',
                                     'character__character_ownership__user__profile',
                                     'character__character_ownership__user__profile__main_character', )

    output = {}
    for c in characters:
        m_cid = c.character.character_ownership.user.profile.main_character.character_id
        if m_cid not in output:
            output[m_cid] = {
                "main": c.character.character_ownership.user.profile.main_character,
                "characters": []
            }
        output[m_cid]["characters"].append(
            {
                "character": c.character,
                "active": c.is_active()
            }
        )

    return list(output.values())
