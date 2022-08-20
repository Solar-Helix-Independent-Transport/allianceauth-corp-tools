import copy
import csv
import os
import re

from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo
from bravado.exception import HTTPError
from django.contrib import messages
from django.contrib.auth.decorators import (login_required,
                                            permission_required,
                                            user_passes_test)
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError
from django.db.models import Count, F, FloatField, Max, Q, Sum
from django.db.models.query import prefetch_related_objects
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.translation import gettext_lazy as _
from esi.decorators import token_required

from .. import providers
from ..models import *


def get_alts(request, character_id):
    if character_id is None:
        main_char = request.user.profile.main_character
    else:
        main_char = EveCharacter.objects\
            .select_related('character_ownership', 'character_ownership__user__profile', 'character_ownership__user__profile__main_character', )\
            .get(character_id=int(character_id))\
            .character_ownership.user.profile.main_character

    linked_characters = main_char.character_ownership.user.character_ownerships.all(
    ).values_list('character_id', flat=True)
    # check access
    visible = CharacterAudit.objects.visible_to(
        request.user).values_list('character_id', flat=True)
    if main_char.id not in visible:
        account_chars = request.user.profile.main_character.character_ownership.user.character_ownerships.all(
        ).values_list('character_id', flat=True)
        logger.warning(
            f"{request.user} Can See {list(visible)}, requested {main_char.id}")
        if main_char.id in account_chars:
            pass
        else:
            raise PermissionDenied(
                "You do not have access to view this character")

    if not request.user.has_perm('corptools.view_characteraudit'):
        logger.warning(
            f"{request.user} doesnot have Perm requested, Requested {main_char.id}")
        raise PermissionDenied("You do not have access to view this character")

    character_id = main_char.character_id
    characters = EveCharacter.objects\
        .select_related('character_ownership__user', 'character_ownership__character')\
        .prefetch_related('character_ownership')\
        .filter(id__in=linked_characters).select_related('characteraudit')

    net_worth = 0
    for character in characters:
        try:
            net_worth += character.characteraudit.balance
        except:
            pass
    return main_char, characters, net_worth


@login_required
def assets(request, character_id=None):
    main_char, characters, net_worth = get_alts(request, character_id)
    asset_locations = {0: "Everywhere"}

    asset_locs = CharacterAsset.objects.filter(character__character__character_id__in=characters.values_list('character_id', flat=True),
                                               location_name__isnull=False).values_list('location_name').distinct()
    asset_locs = EveLocation.objects.filter(
        location_id__in=asset_locs).order_by('location_name')

    for loc in asset_locs:
        asset_locations[loc.location_id] = loc.location_name

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "asset_locations": asset_locations
    }

    return render(request, 'corptools/character/assets.html', context=context)


@login_required
def assets_lists(request, character_id=None, location_id=None):
    # get available models
    main_char, characters, net_worth = get_alts(request, character_id)

    capital_groups = [30, 547, 659, 1538, 485, 902, 513, 883]
    subcap_cat = [6]
    noteable_cats = [4, 20, 23, 25, 34, 35, 87, 91]
    structure_cats = [22, 24, 40, 41, 46, 65, 66, ]
    bpo_cats = [9]

    assets = CharacterAsset.objects\
        .filter((Q(blueprint_copy=None) | Q(blueprint_copy=False)),
                character__character__character_id__in=characters.values_list('character_id', flat=True))

    if location_id != '0':
        asset_locations = assets.filter(
            location_name_id=int(location_id)).values_list('item_id')
        assets = assets.filter(Q(location_name_id=int(location_id)) | Q(
            location_id__in=asset_locations))

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
        if grp['grp_id'] in capital_groups:
            capital_asset_groups.append(grp)
        elif grp['cat_id'] in subcap_cat:
            subcap_asset_groups.append(grp)
        elif grp['cat_id'] in noteable_cats:
            noteable_asset_groups.append(grp)
        elif grp['cat_id'] in structure_cats:
            structure_asset_groups.append(grp)
        elif grp['cat_id'] in bpo_cats:
            bpo_asset_groups.append(grp)
        else:
            remaining_asset_groups.append(grp)

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "capital_asset_groups": capital_asset_groups,
        "noteable_asset_groups": noteable_asset_groups,
        "subcap_asset_groups": subcap_asset_groups,
        "structure_asset_groups": structure_asset_groups,
        "bpo_asset_groups": bpo_asset_groups,
        "remaining_asset_groups": remaining_asset_groups
    }

    return render(request, 'corptools/character/assets_lists.html', context=context)


@login_required
def wallet(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)

    wallet_journal = CharacterWalletJournalEntry.objects\
        .filter(character__character__character_id__in=characters.values_list('character_id', flat=True))\
        .select_related('first_party_name', 'second_party_name', 'character__character').order_by('-date')[:5000]

    graph_data_model = {"0000": {}, "0100": {}, "0200": {}, "0300": {}, "0400": {}, "0500": {}, "0600": {}, "0700": {}, "0800": {}, "0900": {}, "1000": {
    }, "1100": {}, "1200": {}, "1300": {}, "1400": {}, "1500": {}, "1600": {}, "1700": {}, "1800": {}, "1900": {}, "2000": {}, "2100": {}, "2200": {}, "2300": {}}
    # %-H
    graph_people = []
    chord_data = {}
    transactions = []
    for wd in wallet_journal:
        dt = wd.date.strftime("%H") + "00"
        cn = wd.character.character.character_name
        if cn not in graph_people:
            graph_people.append(cn)
        if cn not in graph_data_model[dt]:
            graph_data_model[dt][cn] = 0
        graph_data_model[dt][cn] += 1

        wallet_type_tracking = [
            'corporation_account_withdrawal', 'player_trading', 'player_donation']
        if wd.ref_type in wallet_type_tracking:
            if wd.entry_id not in transactions:
                if wd.amount > 0:
                    fp = wd.first_party_name.name
                    sp = wd.second_party_name.name
                    am = wd.amount
                else:
                    sp = wd.first_party_name.name
                    fp = wd.second_party_name.name
                    am = wd.amount * -1

                if fp not in chord_data:
                    chord_data[fp] = {}
                if sp not in chord_data[fp]:
                    chord_data[fp][sp] = {"a": 0, "c": 0}

                transactions.append(wd.entry_id)
                chord_data[fp][sp]["a"] += am
                chord_data[fp][sp]["c"] += 1

    has_perms = request.user.has_perm('corptools.global_hr') or \
        request.user.has_perm('corptools.alliance_hr') or \
        request.user.has_perm('corptools.corp_hr')

    context = {
        "manager_perms": has_perms,
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "wallet": wallet_journal,
        "graphs": graph_data_model,
        "graph_people": graph_people,
        "chords": chord_data,
    }

    return render(request, 'corptools/character/wallet.html', context=context)


@login_required
def status(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)
    char_skill_total = Skill.objects\
        .filter(character__character__character_id__in=character_ids)\
        .values('character')\
        .annotate(char=F('character__character__character_name'))\
        .annotate(total_sp=Sum('skillpoints_in_skill'))

    bios = None

    table_data = {}
    for char in characters:
        table_data[char.character_name] = {
            "character": char, "history": {}, "bio": "Nothing of value is here"}

    for c in char_skill_total:
        table_data[c.get('char')]["total_sp"] = c.get('total_sp')

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "table_data": table_data,
    }

    return render(request, 'corptools/character/status.html', context=context)


@login_required
def pub_data(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)
    corp_histories = CorporationHistory.objects\
        .filter(character__character__character_id__in=character_ids)\
        .select_related('character__character', 'corporation_name')
    char_skill_total = Skill.objects\
        .filter(character__character__character_id__in=character_ids)\
        .values('character')\
        .annotate(char=F('character__character__character_name'))\
        .annotate(total_sp=Sum('skillpoints_in_skill'))

    bios = None

    table_data = {}
    for char in characters:
        table_data[char.character_name] = {
            "character": char, "history": {}, "bio": "Nothing of value is here"}

    for h in corp_histories:
        table_data[h.character.character.character_name]["history"][str(h.record_id)] = {
            "name": h.corporation_name.name, "id": h.corporation_id, "started": h.start_date, "open": h.is_deleted}

    for c in char_skill_total:
        table_data[c.get('char')]["total_sp"] = c.get('total_sp')

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "table_data": table_data,
    }

    return render(request, 'corptools/character/public.html', context=context)


@login_required
def skills(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)

    user = main_char.character_ownership.user.id
    skills_list = providers.skills.get_and_cache_user(user)

    skill_tables = skills_list.get("skills_list")

    queues = SkillQueue.objects.filter(character__character__in=characters)\
        .select_related('skill_name', 'character__character')
    totals = SkillTotals.objects.filter(character__character__in=characters)\
        .select_related('character__character')

    for que in queues:
        char = que.character.character.character_name
        if char not in skill_tables:
            skill_tables[char] = {"character": que.character,
                                  "omega": True, "skills": {}, "queue": []}
        skill_tables[char]["queue"].append(
            {
                "queue_position": que.queue_position,
                "skill_name": que.skill_name.name,
                "finish_date": que.finish_date,
                "finish_level": que.finish_level
            }
        )

    for total in totals:
        char = total.character.character.character_name
        if char not in skill_tables:
            skill_tables[char] = {"character": total.character,
                                  "omega": True, "skills": {}, "queue": []}
        skill_tables[char]["total_sp"] = total.total_sp
        skill_tables[char]["unallocated_sp"] = total.unallocated_sp

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "skill_tables": skill_tables,
    }

    return render(request, 'corptools/character/skills.html', context=context)


@login_required
def clones(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)
    jump_clones = JumpClone.objects\
        .filter(character__character__character_id__in=character_ids)\
        .select_related('character__character', 'location_name').prefetch_related('implant_set', 'implant_set__type_name')
    clones = Clone.objects\
        .filter(character__character__character_id__in=character_ids)\
        .select_related('character__character')

    table_data = {}
    for char in characters:
        table_data[char.character_name] = {
            "character": char, "clones": {}, "home": None, "cooldown": 0}

    for j in jump_clones:
        table_data[j.character.character.character_name]["clones"][j.jump_clone_id] = {
            "name": j.name, "location": j.location_name, "implants": j.implant_set.all()}

    # for c in clones:
    #    table_data[c.get('char')]["total_sp"] = c.get('total_sp')

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "table_data": table_data,
    }

    return render(request, 'corptools/character/clones.html', context=context)


@login_required
def roles(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)
    roles_data = CharacterRoles.objects\
        .filter(character__character__character_id__in=character_ids)\
        .select_related('character__character')

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "char_data": roles_data,
    }

    return render(request, 'corptools/character/roles.html', context=context)


@login_required
def market(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)

    market_data_current = CharacterMarketOrder.objects\
        .filter(character__character__character_id__in=character_ids, state="active")\
        .select_related('character__character', 'type_name', 'location_name')

    market_data_old = CharacterMarketOrder.objects\
        .filter(character__character__character_id__in=character_ids, duration__gt=0)\
        .select_related('character__character', 'type_name', 'location_name')\
        .exclude(state="active")

    total_buy = market_data_current.filter(is_buy_order=True).aggregate(
        total_buy=Sum(F('price')*F('volume_remain'), output_field=FloatField()))
    total_sell = market_data_current.filter(is_buy_order=None).aggregate(
        total_sell=Sum(F('price')*F('volume_remain'), output_field=FloatField()))

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "char_data": market_data_current,
        "old_data": market_data_old,
        "total_sell": total_sell['total_sell'],
        "total_buy": total_buy['total_buy'],
    }

    return render(request, 'corptools/character/market.html', context=context)


@login_required
def notifications(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)
    notifications = Notification.objects\
        .filter(character__character__character_id__in=character_ids)\
        .select_related('character__character', 'notification_text')

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "table_data": notifications,
    }

    return render(request, 'corptools/character/notifications.html', context=context)


@login_required
def contacts(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)
    contacts = CharacterContact.objects\
        .filter(character__character__character_id__in=character_ids)\
        .select_related('character__character', 'contact_name') \
        .prefetch_related('labels')

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "table_data": contacts,
    }

    return render(request, 'corptools/character/contacts.html', context=context)


@login_required
def mail_menu(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)
    character_ids = characters.values_list('character_id', flat=True)
    notifications = Notification.objects\
        .filter(character__character__character_id__in=character_ids)\
        .select_related('character__character')

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,
        "table_data": notifications,
    }

    return render(request, 'corptools/character/mail_menu.html', context=context)
