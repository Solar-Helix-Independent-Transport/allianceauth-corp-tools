from __future__ import annotations

import hashlib
import logging
import re
from functools import wraps
from typing import List
from xmlrpc.client import boolean

from allianceauth.eveonline.models import EveCharacter
from allianceauth.eveonline.tasks import \
    update_character as eve_character_update
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, F, Q, QuerySet, Sum
from django.utils import timezone
from esi.models import Token
from ninja import Field, Form, NinjaAPI, Schema
from ninja.pagination import LimitOffsetPagination, paginate
from ninja.security import django_auth
from ninja.types import DictStrAny

from corptools import app_settings, models, providers, schema, tasks
from corptools.task_helpers.update_tasks import fetch_location_name

logger = logging.getLogger(__name__)


class Paginator(LimitOffsetPagination):
    class Input(Schema):
        limit: int = Field(app_settings.CT_PAGINATION_SIZE, ge=1)
        offset: int = Field(0, ge=0)

    def paginate_queryset(
        self,
        queryset: QuerySet,
        pagination: Input,
        **params: DictStrAny,
    ) -> Any:
        offset = pagination.offset
        limit: int = pagination.limit
        return {
            "items": queryset[offset: offset + limit],
            "count": self._items_count(queryset),
        }  # noqa: E203


api = NinjaAPI(title="CorpTools API", version="0.0.1",
               urls_namespace='corptools:api', auth=django_auth, csrf=True,
               openapi_url=settings.DEBUG and "/openapi.json" or "")


def cache_page_data(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        print(f)
        out = f(*args, **kwargs)
        print(out)
        return out
    return decorator


def get_main_character(request, character_id):
    perms = True
    main_char = EveCharacter.objects\
        .select_related('character_ownership', 'character_ownership__user__profile', 'character_ownership__user__profile__main_character', )\
        .get(character_id=character_id)
    try:
        main_char = main_char.character_ownership.user.profile.main_character
    except (ObjectDoesNotExist):
        pass

    # check access
    visible = models.CharacterAudit.objects.visible_eve_characters(
        request.user)
    if main_char not in visible:
        account_chars = request.user.profile.main_character.character_ownership.user.character_ownerships.all(
        )
        logger.warning(
            f"{request.user} Can See {list(visible)}, requested {main_char.id}")
        if main_char in account_chars:
            pass
        else:
            perms = False

    if not request.user.has_perm('corptools.view_characteraudit'):
        logger.warning(
            f"{request.user} does not have Perm requested, Requested {main_char.id}")
        perms = False

    return perms, main_char


def get_alts_queryset(main_char):
    try:
        linked_characters = main_char.character_ownership.user.character_ownerships.all(
        ).values_list('character_id', flat=True)

        return EveCharacter.objects.filter(id__in=linked_characters)
    except ObjectDoesNotExist:
        return EveCharacter.objects.filter(pk=main_char.pk)


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
        _h = {
            "corporation": {
                "corporation_name": h.corporation_name.name,
                "corporation_id": h.corporation_name.eve_id,
            },
            "start": h.start_date
        }
        if h.corporation_name.alliance:
            _h['corporation'].update({
                "alliance_id": h.corporation_name.alliance.eve_id,
                "alliance_name": h.corporation_name.alliance.name,
            })
        histories[h.character.character_id].append(_h)
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
        "name": "Characters",
        "links": []
    }

    if app_settings.CT_CHAR_CONTACTS_MODULE:
        _inter["links"].append({
            "name": "Contact",
            "link": "account/contact"
        })

    if app_settings.CT_CHAR_NOTIFICATIONS_MODULE:
        _inter["links"].append({
            "name": "Notifications",
            "link": "account/notifications"
        })

    # if app_settings.CT_CHAR_STANDINGS_MODULE:
    #    _inter["links"].append({
    #        "name": "Standings",
    #        "link": "/account/standings"
    #    })

    if app_settings.CT_CHAR_WALLET_MODULE:
        _finance["links"].append({
            "name": "Wallet",
            "link": "account/wallet"
        })
        if (request.user.has_perm("corptools.global_corp_manager") or
            request.user.has_perm("corptools.state_corp_manager") or
            request.user.has_perm("corptools.alliance_corp_manager") or
                request.user.has_perm("corptools.own_corp_manager")):
            _finance["links"].append({
                "name": "Wallet Activity",
                "link": "account/walletactivity"
            })

        _finance["links"].append({
            "name": "Market",
            "link": "account/market"
        })
    if app_settings.CT_CHAR_ASSETS_MODULE:
        _char["links"].append({
            "name": "Asset Overview",
            "link": "account/assets"
        })
        _char["links"].append({
            "name": "Asset List",
            "link": "account/listassets"
        })

    if app_settings.CT_CHAR_CLONES_MODULE:
        _char["links"].append({
            "name": "Clones",
            "link": "account/clones"
        })

    if app_settings.CT_CHAR_ROLES_MODULE:
        _char["links"].append({
            "name": "Roles",
            "link": "account/roles"
        })

    if app_settings.CT_CHAR_MAIL_MODULE:
        _char["links"].append({
            "name": "Mail",
            "link": "account/mail"
        })

    if app_settings.CT_CHAR_SKILLS_MODULE:
        _char["links"].append({
            "name": "Skills",
            "link": "account/skills"
        })
        _char["links"].append({
            "name": "Skill Queues",
            "link": "account/skillqueue"
        })
        _char["links"].append({
            "name": "Skill List Checks",
            "link": "account/doctrines"
        })
    out = []
    if len(_char['links']):
        out.append(_char)

    if len(_finance['links']):
        out.append(_finance)

    if len(_inter['links']):
        out.append(_inter)

    return out


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


@api.get(
    "account/{character_id}/asset/{location_id}/list",
    response={200: List[schema.CharacterAssetItem], 403: schema.Message},
    tags=["Account"]
)
def get_character_asset_list(request, character_id: int, location_id: int):
    expandable_cats = [2, 6]

    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    assets = models.CharacterAsset.objects\
        .filter((Q(blueprint_copy=None) | Q(blueprint_copy=False)),
                character__character__in=characters).select_related(
                    "character", "character__character",
                    "type_name", "location_name", "type_name__group__category"
        )

    if location_id == 2004:
        asset_locations = assets.filter(
            location_flag="AssetSafety").values_list('item_id')
        assets = assets.filter(location_id__in=asset_locations)
    elif location_id != 0:
        assets = assets.filter(Q(location_name_id=int(
            location_id)) | Q(location_id=int(location_id)))

    output = []

    for a in assets:
        if a.location_name:
            output.append({
                "character": {
                    "character_id": a.character.character.character_id,
                    "character_name": a.character.character.character_name,
                    "corporation_id": a.character.character.corporation_id,
                    "corporation_name": a.character.character.corporation_name,
                    "alliance_id": a.character.character.alliance_id,
                    "alliance_name": a.character.character.alliance_name
                },
                "item": {
                    "id": a.type_name.type_id,
                    "name": a.type_name.name,
                    "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}"
                },
                "quantity": a.quantity,
                "id": a.item_id,
                "expand": True if a.type_name.group.category.category_id in expandable_cats else False,
                "location": {
                    "id": a.location_name.location_id,
                    "name": a.location_name.location_name
                }
            })

    return output


@api.get(
    "account/{character_id}/asset/{item_id}/contents",
    response={200: List[schema.CharacterAssetItem], 403: schema.Message},
    tags=["Account"]
)
def get_character_asset_contents(request, character_id: int, item_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    assets = models.CharacterAsset.objects\
        .filter(character__character__in=characters).select_related(
            "character", "character__character",
            "type_name", "location_name", "type_name__group__category"
        )
    assets = assets.filter(location_id=item_id)
    output = []

    for a in assets:
        output.append({
            "character": {
                "character_id": a.character.character.character_id,
                "character_name": a.character.character.character_name,
                "corporation_id": a.character.character.corporation_id,
                "corporation_name": a.character.character.corporation_name,
                "alliance_id": a.character.character.alliance_id,
                "alliance_name": a.character.character.alliance_name
            },
            "item": {
                "id": a.type_name.type_id,
                "name": a.type_name.name,
                "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}"
            },
            "quantity": a.quantity,
            "id": a.item_id,
            "expand": False,
            "location": {
                "id": item_id,
                "name": a.location_flag
            }
        })

    return output


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
@paginate(Paginator)
def get_character_wallet(request, character_id: int, **kwargs):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    wallet_journal = models.CharacterWalletJournalEntry.objects\
        .filter(character__character__in=characters)\
        .select_related('first_party_name', 'second_party_name', 'character__character').order_by('-date')[:35000]

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
    "account/{character_id}/market",
    response={200: schema.CharacterMarket, 403: schema.Message},
    tags=["Account"]
)
def get_character_market(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    market_data_current = models.CharacterMarketOrder.objects\
        .filter(character__character__in=characters, state="active")\
        .select_related('character__character', 'type_name', 'location_name')

    market_data_old = models.CharacterMarketOrder.objects\
        .filter(character__character__in=characters, duration__gt=0)\
        .select_related('character__character', 'type_name', 'location_name')\
        .exclude(state="active")

    output = {"active": [], "expired": [],
              "total_active": 0, "total_expired": 0}
    for w in market_data_current:
        output['total_active'] += w.price*w.volume_remain
        o = {
            "character": w.character.character,
            "date": w.issued,
            "duration": w.duration,
            "volume_min": w.min_volume,
            "volume_remain": w.volume_remain,
            "volume_total": w.volume_total,
            "item": {
                "id": w.type_name.type_id,
                "name": w.type_name.name
            },
            "price": w.price,
            "escrow": w.escrow,
            "buy_order": w.is_buy_order,
        }
        if w.location_name:
            o['location'] = {
                "id": w.location_name.location_id,
                "name": w.location_name.location_name
            }
        output["active"].append(o)

    for w in market_data_old:
        output['total_expired'] += w.price*w.volume_total
        o = {
            "character": w.character.character,
            "date": w.issued,
            "duration": w.duration,
            "volume_min": w.min_volume,
            "volume_remain": w.volume_remain,
            "volume_total": w.volume_total,
            "item": {
                "id": w.type_name.type_id,
                "name": w.type_name.name
            },
            "price": w.price,
            "escrow": w.escrow,
            "buy_order": w.is_buy_order,
        }
        if w.location_name:
            o['location'] = {
                "id": w.location_name.location_id,
                "name": w.location_name.location_name
            }
        output["expired"].append(o)

    return output


@api.get(
    "account/{character_id}/wallet/activity",
    tags=["Account"]
)
def get_character_wallet_activity(request, character_id: int):
    if not (request.user.has_perm("corptools.global_corp_manager") or
            request.user.has_perm("corptools.state_corp_manager") or
            request.user.has_perm("corptools.alliance_corp_manager") or
            request.user.has_perm("corptools.own_corp_manager")):
        return []

    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)
    ref_types = ["player_donation", "player_trading",
                 "contract_price", "corporation_account_withdrawal"]
    wallet_journal = models.CharacterWalletJournalEntry.objects\
        .filter(character__character__in=characters, ref_type__in=ref_types)\
        .select_related('first_party_name', 'second_party_name', 'character__character')\
        .values('first_party_name__name', 'second_party_name__name')\
        .annotate(total_isk=Sum('amount'))\
        .annotate(interactions=Count('amount'))\
        .annotate(fpcat=F('first_party_name__category'))\
        .annotate(spcat=F('second_party_name__category'))\
        .annotate(fpid=F('first_party_name__eve_id'))\
        .annotate(spid=F('second_party_name__eve_id'))\
        .annotate(fpcrp=F('first_party_name__corporation__name'))\
        .annotate(spcrp=F('second_party_name__corporation__name'))\
        .annotate(fpcid=F('first_party_name__corporation__eve_id'))\
        .annotate(spcid=F('second_party_name__corporation__eve_id'))\
        .annotate(fpali=F('first_party_name__alliance__name'))\
        .annotate(spali=F('second_party_name__alliance__name'))\
        .annotate(fpaid=F('first_party_name__alliance__eve_id'))\
        .annotate(spaid=F('second_party_name__alliance__eve_id'))

    output = []
    for w in wallet_journal:
        output.append(
            {
                "fpn": w['first_party_name__name'],
                "firstParty": {
                    "cat": w['fpcat'],
                    "id": w['fpid'],
                    "cid": w['fpcid'],
                    "cn": w['fpcrp'],
                    "aid": w['fpali'],
                    "an": w['fpaid']
                },
                "spn": w['second_party_name__name'],
                "secondParty": {
                    "cat": w['spcat'],
                    "id": w['spid'],
                    "cid": w['spcid'],
                    "cn": w['spcrp'],
                    "aid": w['spali'],
                    "an": w['spaid']
                },
                "value": abs(int(w['total_isk'])),
                "interactions": w['interactions']
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
            "labels": labels,
            "blocked": c.blocked,
            "watched": c.watched,

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
    for c in characters:
        output[c.character_id] = {
            "character": c,
            "queue": [],
        }

    for s in skills:
        if s.character.character.character_id not in output:
            output[s.character.character.character_id] = {
                "character": s.character.character,
                "queue": [],
            }
        output[s.character.character.character_id]["queue"].append(
            {
                "position": s.queue_position,
                "group": s.skill_name.group.name,
                "skill": s.skill_name.name,
                "end_level": s.finish_level,
                "start_sp": s.level_start_sp,
                "end_sp": s.level_end_sp,
                "start": s.start_date,
                "end": s.finish_date,
            }
        )

    return list(output.values())


@api.get(
    "account/{character_id}/doctrines",
    response={200: List[schema.CharacterDoctrines], 403: schema.Message},
    tags=["Account"]
)
def get_character_doctrines(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    skilllists = providers.skills.get_and_cache_user(
        main.character_ownership.user_id)

    output = {}
    for c in characters:
        output[c.character_id] = {
            "character": c,
            "doctrines": {},
            "skills": {},
        }

    for k, s in skilllists['skills_list'].items():
        output[s['character_id']]["doctrines"] = s["doctrines"]
        output[s['character_id']]["skills"] = s["skills"]

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
        tasks.update_character.apply_async(args=[character_id], kwargs={
                                           "force_refresh": True}, priority=4)
    return 200, {"message": "Requested Update!"}


@api.post(
    "account/refresh",
    response={200: schema.Message, 403: schema.Message},
    tags=["Characters"]
)
def post_acccount_refresh(request, character_id: int):
    if character_id == 0:
        character_id = request.user.profile.main_character.character_id
    response, main = get_main_character(request, character_id)

    if not response:
        return 403, {"message": "Permission Denied"}

    characters = get_alts_queryset(main)

    for cid in characters.values_list('character_id', flat=True):
        tasks.update_character.apply_async(
            args=[cid], kwargs={"force_refresh": True}, priority=4)
        eve_character_update.apply_async(
            args=[cid], priority=4)
    return 200, {"message": "Requested Updates!"}


@api.get(
    "account/list",
    response={200: List[schema.AccountStatus], 403: schema.Message},
    tags=["Account"]
)
def get_account_list(request):
    characters = models.CharacterAudit.objects.visible_to(
        request.user).filter(character=F("character__character_ownership__user__profile__main_character"))\
        .select_related('character__character_ownership',
                        'character__character_ownership__user__profile',
                        'character__character_ownership__user__profile__main_character',
                        'character__characteraudit')\
        .prefetch_related('character__character_ownership__user__character_ownerships')\
        .prefetch_related('character__character_ownership__user__character_ownerships__character')\
        .prefetch_related('character__character_ownership__user__character_ownerships__character__characteraudit')\

    character_ids = []
    output = {}
    for char in characters:
        main = char.character.character_ownership.user.profile.main_character
        for c in char.character.character_ownership.user.character_ownerships.all():
            if char.character.character_id not in output:
                output[main.character_id] = {
                    "main": main,
                    "characters": []
                }
            active = False
            try:
                active = c.character.characteraudit.is_active()
            except models.CharacterAudit.DoesNotExist:
                pass
            character_ids.append(c.character.character_id)
            output[main.character_id]["characters"].append(
                {
                    "character": c.character,
                    "active": active
                }
            )

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
                active = char.character.characteraudit.is_active()
            except models.CharacterAudit.DoesNotExist:
                pass
            output[main.character_id]["characters"].append(
                {
                    "character": char.character,
                    "active": active
                }
            )
        except:
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


@api.get(
    "corp/structures",
    response={200: List[schema.Structure], 403: schema.Message},
    tags=["Corporation"]
)
def get_visible_structures(request):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_structures')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view structures!")
        return 403, {"message": "Permission Denied!"}

    output = []
    for s in models.Structure.get_visible(request.user).select_related(
        'type_name', "corporation__corporation", "system_name"
    ).prefetch_related('structureservice_set'):
        _ss = list()
        for __s in s.structureservice_set.all():
            _ss.append({
                "name": __s.name,
                "state": __s.state
            })
        _s = {
            "id": s.structure_id,
            "owner": s.corporation.corporation,
            "name": s.name,
            "type": {"id": s.type_id,
                     "name": s.type_name.name},
            "services": _ss,
            "location": {"id": s.system_name.system_id,
                         "name": s.system_name.name},
            "fuel_expiry": s.fuel_expires,
            "state": s.state,
            "state_expiry": s.state_timer_end
        }
        output.append(_s)
    return list(output)


@api.get(
    "corp/structures/{structure_id}",
    response={200: List[schema.FittingItem], 403: schema.Message},
    tags=["Corporation"]
)
def get_corporation_structure_fitting(request, corporation_id, structure_id):
    output = []
    return output


@api.get(
    "corp/list",
    response={200: List[schema.CorpStatus], 403: schema.Message},
    tags=["Corporation"]
)
def get_visible_corporation_status(request):
    corps = models.CorporationAudit.objects.visible_to(request.user)

    if (request.user.has_perm("corptools.holding_corp_wallets") or
        request.user.has_perm("corptools.holding_corp_assets") or
            request.user.has_perm("corptools.holding_corp_structures")):
        corps_holding = models.CorptoolsConfiguration.objects.get(
            id=1).holding_corp_qs()
        corps = corps | corps_holding

    chars = models.CharacterAudit.objects.filter(
        character__corporation_id__in=corps.values_list("corporation__corporation_id", flat=True), active=True)
    chars = chars.select_related("characterroles", "character").filter(
        Q(characterroles__accountant=True) or
        Q(characterroles__director=True) or
        Q(characterroles__station_manager=True)
    )

    corp_chars = {}

    for c in corps:
        corp_chars[c.corporation.corporation_id] = {
            "a": {
                "c": 0,
                "t": 0
            },
            "w": {
                "c": 0,
                "t": 0
            },
            "s": {
                "c": 0,
                "t": 0
            },
            "m": {
                "c": 0,
                "t": 0
            },
        }

    _c = {}
    for c in chars:
        _c[c.character.character_id] = c.character.corporation_id
        if c.characterroles.director:
            corp_chars[c.character.corporation_id]["a"]["c"] += 1
            corp_chars[c.character.corporation_id]["w"]["c"] += 1
            corp_chars[c.character.corporation_id]["s"]["c"] += 1
            corp_chars[c.character.corporation_id]["m"]["c"] += 1
        else:
            if c.characterroles.station_manager:
                corp_chars[c.character.corporation_id]["s"]["c"] += 1
            if c.characterroles.accountant:
                corp_chars[c.character.corporation_id]["w"]["c"] += 1
                corp_chars[c.character.corporation_id]["m"]["c"] += 1

    tokens = Token.objects.filter(character_id__in=chars.values_list(
        "character__character_id", flat=True))

    def token_scope_filter(qs, scopes):
        for s in scopes:
            qs = qs.filter(scopes__name=s)
        return qs

    def filter_token(qs, grp):
        for t in qs:
            corp_chars[_c[t.character_id]][grp]["t"] += 1

    a_tokens = token_scope_filter(
        tokens, app_settings._corp_scopes_base+app_settings._corp_scopes_assets)
    filter_token(a_tokens, "a")
    w_tokens = token_scope_filter(
        tokens, app_settings._corp_scopes_base+app_settings._corp_scopes_wallets)
    filter_token(w_tokens, "w")
    s_tokens = token_scope_filter(
        tokens, app_settings._corp_scopes_base+app_settings._corp_scopes_structures)
    filter_token(s_tokens, "s")
    m_tokens = token_scope_filter(
        tokens, app_settings._corp_scopes_base+app_settings._corp_scopes_moons)
    filter_token(m_tokens, "m")

    output = []
    for c in corps:
        _updates = {}
        for grp in app_settings.get_corp_update_attributes():
            _updates[grp[0]] = {"update": getattr(c, grp[1]),
                                "chars": corp_chars[c.corporation.corporation_id][grp[2]]["c"],
                                "tokens": corp_chars[c.corporation.corporation_id][grp[2]]["t"]}
        all_id = None
        all_nm = None
        if c.corporation.alliance:
            all_id = c.corporation.alliance.alliance_id
            all_nm = c.corporation.alliance.alliance_name

        _out = {"corporation": {"corporation_id": c.corporation.corporation_id,
                                "corporation_name": c.corporation.corporation_name,
                                "alliance_id": all_id,
                                "alliance_name": all_nm},
                "characters": c.corporation.member_count,
                "active": True,
                "last_updates": _updates}
        output.append(_out)
    return output


@api.get(
    "corp/{corporation_id}/status",
    response={200: schema.CorpStatus, 403: schema.Message},
    tags=["Corporation"]
)
def get_corporation_status(request, corporation_id: int):
    if not corporation_id:
        corporation_id = request.user.profile.main_character.corporation_id
    corp = models.CorporationAudit.objects.visible_to(
        request.user).filter(corporation__corporation_id=corporation_id)
    if corp.exists():

        c = corp.first()
        _updates = {}
        for grp in app_settings.get_corp_update_attributes():
            _updates[grp[0]] = getattr(c, grp[1])
        all_id = None
        all_nm = None
        if c.corporation.alliance:
            all_id = c.corporation.alliance.alliance_id
            all_nm = c.corporation.alliance.alliance_name

        _out = {"corporation": {"corporation_id": c.corporation.corporation_id,
                                "corporation_name": c.corporation.corporation_name,
                                "alliance_id": all_id,
                                "alliance_name": all_nm},
                "characters": c.corporation.member_count,
                "active": True,
                "last_updates": _updates}
        return 200, _out
    return 403, {"message": "Not Found"}


@api.get(
    "corporation/wallettypes",
    tags=["Corporation"]
)
def get_corporation_wallet_types(request):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_wallets')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view wallets!")
        return 403, {"message": "Permission Denied!"}

    ref_types = models.CorporationWalletJournalEntry.objects.values_list(
        "ref_type", flat=True).distinct()

    return 200, list(ref_types)


@api.get(
    "corporation/{corporation_id}/wallet",
    response={200: List[schema.CorporationWalletEvent], 403: schema.Message},
    tags=["Corporation"]
)
def get_corporation_wallet(request, corporation_id: int, type_refs: str = "", page: int = 1):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_wallets')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view wallets!")
        return 403, {"message": "Permission Denied!"}

    wallet_journal = models.CorporationWalletJournalEntry.get_visible(request.user)\
        .filter(division__corporation__corporation__corporation_id=corporation_id)\
        .select_related('first_party_name', 'second_party_name', 'division')\
        .order_by("-date")

    start_count = (page-1)*10000
    end_count = page*10000

    if type_refs:
        refs = type_refs.split(",")
        if len(refs) == 0:
            return 200, []
        wallet_journal = wallet_journal.filter(ref_type__in=refs)

    wallet_journal = wallet_journal[start_count:end_count]

    output = []
    for w in wallet_journal:
        output.append(
            {
                "division": f"{w.division.division} {w.division.name}",
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
    "corporation/{corporation_id}/asset/locations",
    response={200: List[schema.ValueLabel], 403: schema.Message},
    tags=["Corporation"]
)
def get_corporation_asset_locations(request, corporation_id: int):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_assets')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view wallets!")
        return 403, {"message": "Permission Denied!"}

    asset_locs = models.CorpAsset.get_visible(request.user).filter(corporation__corporation__corporation_id=corporation_id,
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


@api.get(
    "corporation/{corporation_id}/asset/{location_id}/list",
    response={200: List[schema.CorporationAssetItem], 403: schema.Message},
    tags=["Corporation"]
)
def get_corporation_asset_list(request, corporation_id: int, location_id: int, new_asset_tree: boolean = False):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_assets')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view wallets!")
        return 403, {"message": "Permission Denied!"}

    if new_asset_tree:
        expandable_cats = []

        if corporation_id == 0:
            corporation_id = request.user.profile.main_character.corporation_id

        assets = models.CorpAsset.get_visible(request.user).filter(
            corporation__corporation__corporation_id=corporation_id).select_related(
            "type_name", "location_name", "type_name__group__category"
        )

        asset_locations = []
        if location_id == 2004:
            asset_locations = assets.filter(
                location_flag="AssetSafety")
            assets = assets.filter(
                location_id__in=asset_locations.values_list('item_id'))
        elif location_id != 0:
            asset_locations = assets.filter(
                location_name_id=int(location_id))
            assets = assets.filter(Q(location_name_id=int(location_id)) | Q(
                location_id__in=asset_locations.values_list('item_id')) | Q(location_id=int(location_id)))
        else:
            asset_locations = assets.filter(
                location_name__isnull=False)

        output = []
        location_names = {}

        for a in assets:
            loc = f"{a.location_id} ({a.location_flag})"
            if a.location_name:
                loc = a.location_name.location_name
            output.append({
                "item": {
                    "id": a.type_name.type_id,
                    "name": a.type_name.name,
                    "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}"
                },
                "quantity": a.quantity,
                "id": a.item_id,
                "expand": False,
                "location": {
                    "id": a.location_id,
                    "name": loc
                }
            })

        return output

    expandable_cats = [2, 6, 29]
    everywhere_flags = ["CorpSAG1", "CorpSAG2", "CorpSAG3", "CorpSAG4",
                        "CorpSAG5", "CorpSAG6", "CorpSAG7", "CorpDeliveries", "AssetSafety"]

    if corporation_id == 0:
        corporation_id = request.user.profile.main_character.corporation_id

    assets = models.CorpAsset.get_visible(request.user).filter(
        corporation__corporation__corporation_id=corporation_id).select_related(
        "type_name", "location_name", "type_name__group__category"
    )

    asset_locations = []
    if location_id == 2004:
        asset_locations = assets.filter(
            location_flag="AssetSafety")
        assets = assets.filter(
            location_id__in=asset_locations.values_list('item_id'))
    elif location_id != 0:
        asset_locations = assets.filter(
            location_name_id=int(location_id))
        assets = assets.filter(Q(location_name_id=int(location_id)) | Q(
            location_id__in=asset_locations.values_list('item_id')) | Q(location_id=int(location_id)))
    else:
        asset_locations = assets.filter(
            location_name__isnull=False)
        assets = assets.filter(location_flag__in=everywhere_flags)

    output = []
    location_names = {}
    for l in asset_locations:
        if l.location_name:
            location_names[l.item_id] = l.location_name.location_name

    for a in assets:
        loc = a.location_flag
        if a.location_id in location_names:
            loc = f"{location_names[a.location_id]} ({a.location_flag})"

        output.append({
            "item": {
                "id": a.type_name.type_id,
                "name": a.type_name.name,
                "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}"
            },
            "quantity": a.quantity,
            "id": a.item_id,
            "expand": True if a.type_name.group.category.category_id in expandable_cats else False,
            "location": {
                "id": a.location_id,
                "name": loc
            }
        })

    return output


@api.get(
    "corporation/asset/{item_id}/contents",
    response={200: List[schema.CorporationAssetItem], 403: schema.Message},
    tags=["Corporation"]
)
def get_corporation_asset_contents(request, item_id: int):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_assets')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view wallets!")
        return 403, {"message": "Permission Denied!"}

    assets = models.CorpAsset.get_visible(request.user)\
        .select_related(
            "type_name", "location_name", "type_name__group__category"
    )
    assets = assets.filter(location_id=item_id)

    output = []

    for a in assets:
        output.append({
            "item": {
                "id": a.type_name.type_id,
                "name": a.type_name.name,
                "cat": f"{a.type_name.group.category.name} - {a.type_name.group.name}"
            },
            "quantity": a.quantity,
            "id": a.item_id,
            "expand": False,
            "location": {
                "id": item_id,
                "name": a.location_flag
            }
        })

    return output


@api.get(
    "corporation/{corporation_id}/asset/{location_id}/groups",
    response={200: List[schema.CharacterAssetGroups], 403: schema.Message},
    tags=["Corporation"]
)
def get_corporation_asset_groups(request, corporation_id: int, location_id: int):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_assets')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view wallets!")
        return 403, {"message": "Permission Denied!"}

    capital_groups = [30, 547, 659, 1538, 485, 902, 513, 883]
    subcap_cat = [6]
    noteable_cats = [4, 20, 23, 25, 34, 35, 87, 91]
    structure_cats = [22, 24, 40, 41, 46, 65, 66, ]
    bpo_cats = [9]

    assets = models.CorpAsset.get_visible(request.user)\
        .filter((Q(blueprint_copy=None) | Q(blueprint_copy=False)),
                corporation__corporation__corporation_id=corporation_id)

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
        {"name": "Subcap Ships",
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
    "corp/gates",
    response={200: List, 403: schema.Message},
    tags=["Corporation"]
)
def get_visible_gates(request):
    perms = (
        request.user.has_perm('corptools.corp_hr') |
        request.user.has_perm('corptools.alliance_hr') |
        request.user.has_perm('corptools.state_hr') |
        request.user.has_perm('corptools.global_hr') |
        request.user.has_perm('corptools.holding_corp_structures')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view structures!")
        return 403, {"message": "Permission Denied!"}

    output = []
    structures = models.Structure.get_visible(request.user).select_related(
        "corporation__corporation", "system_name"
    ).prefetch_related('structureservice_set').filter(type_id=35841)

    second_systems = set()
    output = {}
    regex = r"^(.*) » ([^ - ]*) - (.*)"
    now = timezone.now()
    for s in structures:
        matches = re.findall(regex, s.name)
        matches = matches[0]
        days = 0
        if s.fuel_expires:
            days = (s.fuel_expires - now).days
        active = False
        for ss in s.structureservice_set.all():
            if ss.name == "Jump Gate Access" and ss.state == "online":
                active = True

        if matches[0] in second_systems:
            output[matches[1]]["end"] = {"system_name": s.system_name.name,
                                         "system_id": s.system_name_id,
                                         "ozone": s.ozone_level,
                                         "known": True,
                                         "active": active,
                                         "expires": days,
                                         "name": s.name}
        else:
            output[matches[0]] = {}
            output[matches[0]]["start"] = {"system_name": s.system_name.name,
                                           "system_id": s.system_name_id,
                                           "ozone": s.ozone_level,
                                           "known": True,
                                           "active": active,
                                           "expires": days,
                                           "name": s.name}
            output[matches[0]]["end"] = {"known": False, "active": False}
            second_systems.add(matches[1])

    return list(output.values())


@api.get(
    "alliance/sov",
    response={200: List, 403: schema.Message},
    tags=["Alliance"]
)
def get_alliance_sov(request):
    perms = (
        request.user.has_perm('corptools.holding_corp_assets')
    )

    if not perms:
        logging.error(
            f"Permission Denied for {request.user} to view Sov Structures!")
        return 403, {"message": "Permission Denied!"}

    types = [32458]

    assets = models.CorpAsset.get_visible(request.user).filter(
        type_id__in=types,
        location_type="solar_system").select_related(
        "type_name",
        "location_name",
        "location_name__system",
        "location_name__system__constellation",
        "location_name__system__constellation__region",
        "type_name__group__category"
    )

    asset_locations = models.CorpAsset.get_visible(request.user).filter(
        location_id__in=assets.values("item_id")).select_related(
        "type_name"
    )

    location_names = {}

    for a in assets:
        if not a.location_name_id:
            location = fetch_location_name(a.location_id, a.location_type, 0)
            a.location_name = location
        loc_id = a.item_id
        if loc_id not in location_names:
            location_names[loc_id] = {
                "system": {
                    "name": a.location_name.location_name,
                    "const": a.location_name.system.constellation.name,
                    "rgn": a.location_name.system.constellation.region.name
                },
                "upgrades": []
            }

    for a in asset_locations:
        location_names[a.location_id]["upgrades"].append({
            "id": a.type_name.type_id,
            "name": a.type_name.name,
            "active": a.location_flag
        })

    return list(location_names.values())


@api.get(
    "/search/system/{search_text}",
    response={200: List[schema.EveName]},
    tags=["Search"]
)
def get_system_search(request, search_text: str, limit: int = 10):
    if not request.user.is_superuser:
        return 403, {"message": "Hard no pall!"}
    return models.MapSystem.objects.filter(name__icontains=search_text).values("name", id=F("system_id"))[:limit]


@api.get(
    "/search/location/{search_text}",
    response={200: List[schema.EveName]},
    tags=["Search"]
)
def get_location_search(request, search_text: str, limit: int = 10):
    if not request.user.is_superuser:
        return 403, {"message": "Hard no pall!"}

    return models.EveLocation.objects.filter(location_name__icontains=search_text).exclude(location_id__lte=0).values(name=F("location_name"), id=F("location_id"))[:limit]


@api.get(
    "/search/item/group/{search_text}",
    response={200: List[schema.EveName]},
    tags=["Search"]
)
def get_group_search(request, search_text: str, limit: int = 10):
    if not request.user.is_superuser:
        return 403, {"message": "Hard no pall!"}

    return models.EveItemGroup.objects.filter(name__icontains=search_text).values("name", id=F("group_id"))[:limit]


def build_ping_list(systems, structures, ignore_groups, message, filter_charges=False, ships_only=False, capitals_only=False):
    pingers = {}
    ammo_exclusions_cat = [8]
    filter_charges = True
    assets = models.CharacterAsset.objects.filter(
        Q(location_name_id__in=systems +
          structures) | Q(location_name__system_id__in=systems+structures)
    ).exclude(
        type_name__group_id__in=ignore_groups
    ).select_related(
        'type_name',
        'character',
        'character__character',
        'character__character__character_ownership',
        'character__character__character_ownership__user',
        'character__character__character_ownership__user__discord',
        'character__character__character_ownership__user__profile__main_character',
        'location_name'
    ).order_by("-type_name__volume"
               )

    if filter_charges:
        assets = assets.exclude(
            type_name__group__category_id__in=ammo_exclusions_cat)

    if ships_only:
        assets = assets.filter(
            type_name__group__category_id__in=[6]
        )

    if capitals_only:
        assets = assets.filter(
            type_name__group_id__in=[30, 485, 513, 547, 659, 883, 902, 1538]
        )

    for a in assets:
        try:
            uid = a.character.character.character_ownership.user.discord.uid
            char = a.character.character.character_name
            main = a.character.character.character_ownership.user.profile.main_character.character_name
            if uid not in pingers:
                pingers[uid] = {"c": set(), "a": list(), "s": set(), "m": main}
            if char not in pingers[uid]:
                pingers[uid]["c"].add(char)
            if a.type_name.name not in pingers[uid]["a"]:
                pingers[uid]["a"].append(a.type_name.name)
            pingers[uid]["s"].add(a.location_name.location_name)
        except:
            pass

    return pingers


@api.post(
    "pingbot/assets/send",
    response={200: schema.Message, 403: schema.Message},
    tags=["Utilities"]
)
def post_send_pings_assets(request, message: str, systems: str = "", structures: str = "", ignore_groups: str = "", filter_charges: boolean = False, ships_only: boolean = False, capitals_only: boolean = False):
    if not request.user.is_superuser:
        return 403, {"message": "Hard no pall!"}

    from aadiscordbot.tasks import send_message
    from discord import Embed

    systems = systems.split(",") if len(systems) else []
    structures = structures.split(",") if len(structures) else []
    ignore_groups = ignore_groups.split(",") if len(ignore_groups) else []
    pingers = build_ping_list(
        systems, structures, ignore_groups, message, filter_charges, ships_only, capitals_only)

    for id, chars in pingers.items():
        embed = Embed(title="Asset Alert!")
        embed.description = message.replace("\\n", "\n")
        _ = embed.add_field(name="Characters",
                            value=", ".join(list(chars['c'])),
                            inline=False)
        _ = embed.add_field(name="Structures",
                            value=", ".join(list(chars['s'])),
                            inline=False)
        _ = embed.add_field(name="Assets",
                            value=", ".join(list(chars['a'])[:20]),
                            inline=False)
        send_message(user_id=id, embed=embed)

    return 200, {"message": "Pings Sent!"}


@api.post(
    "pingbot/assets/counts",
    response={200: schema.PingStats, 403: schema.Message},
    tags=["Utilities"]
)
def post_test_pings_assets(request, systems: str = "", structures: str = "", ignore_groups: str = "", filter_charges: boolean = False, ships_only: boolean = False, capitals_only: boolean = False):
    if not request.user.is_superuser:
        return 403, {"message": "Hard no pall!"}

    systems = systems.split(",") if len(systems) else []
    structures = structures.split(",") if len(structures) else []
    ignore_groups = ignore_groups.split(",") if len(ignore_groups) else []
    pingers = build_ping_list(
        systems, structures, ignore_groups, "", filter_charges, ships_only, capitals_only)

    locations = set()

    for id, chars in pingers.items():
        locations.update(list(chars['s']))

    locations = list(locations)
    locations.sort()

    return 200, {"members": len(pingers), "structures": locations}
