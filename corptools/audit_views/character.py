import os

from bravado.exception import HTTPError
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required, user_passes_test
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError
from django.db.models import Count, F, Sum, Max
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.translation import ugettext_lazy as _
from esi.decorators import token_required
from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo
from django.http import HttpResponse
import csv
import re
import copy

from ..models import *

def get_alts(request, character_id):
    if character_id is None:
        main_char = request.user.profile.main_character
    else:
        main_char = EveCharacter.objects\
            .select_related('character_ownership','character_ownership__user__profile','character_ownership__user__profile__main_character', )\
            .get(character_id=int(character_id))\
            .character_ownership.user.profile.main_character
    
    linked_characters = main_char.character_ownership.user.character_ownerships.all().values_list('character_id', flat=True)
    #check access
    visible = CharacterAudit.objects.visible_to(request.user).values_list('character_id', flat=True)
    if main_char.id not in visible:
        logger.warning(f"{request.user} Can See {list(visible)}, requested {main_char.id}")
        if main_char.id in linked_characters:
            pass
        else:
            raise PermissionDenied("You do not have access to view this character")
    
    if not request.user.has_perm('corptools.view_characteraudit'):
        logger.warning(f"{request.user} doesnot have Perm requested, Requested {main_char.id}")
        raise PermissionDenied("You do not have access to view this character")

    character_id = main_char.character_id
    characters = EveCharacter.objects\
                .select_related('character_ownership__user','character_ownership__character')\
                .prefetch_related('character_ownership')\
                .filter(id__in=linked_characters).select_related('characteraudit')

    net_worth = 0
    for character in characters:
        try:
            net_worth+=character.characteraudit.balance
        except:
            pass
    return main_char, characters, net_worth

@login_required
def assets(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts(request, character_id)

    capital_groups = [30, 547, 659, 1538, 485, 902, 513, 944, 941]
    subcap_cat = [6]
    noteable_cats = [4, 20, 23, 25, 34, 35, 87, 91]
    structure_cats = [22, 24, 40, 41, 46, 65, 66,]
    bpo_cats = [9]

    assets = CharacterAsset.objects\
                .filter(character__character__character_id__in=characters.values_list('character_id', flat=True))\
                .values('type_name__group__group_id')\
                .annotate(grp_total=Sum('quantity'))\
                .annotate(grp_name=F('type_name__group__name'))\
                .annotate(grp_id=F('type_name__group_id'))\
                .annotate(cat_id=F('type_name__group__category_id'))\
                .annotate(is_bpc=F('blueprint_copy'))\
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
        elif grp['cat_id'] in bpo_cats and not grp['is_bpc']:
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

    return render(request, 'corptools/character/assets.html', context=context)

@login_required
def wallet(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts (request, character_id)

    wallet_journal = CharacterWalletJournalEntry.objects\
                        .filter(character__character__character_id__in=characters.values_list('character_id', flat=True))\
                        .select_related('first_party_name', 'second_party_name', 'character__character')
    
    graph_data_model = {"0000":{},"0100":{},"0200":{},"0300":{},"0400":{},"0500":{},"0600":{},"0700":{},"0800":{},"0900":{},"1000":{},"1100":{},"1200":{},"1300":{},"1400":{},"1500":{},"1600":{},"1700":{},"1800":{},"1900":{},"2000":{},"2100":{},"2200":{},"2300":{}}
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

        wallet_type_tracking = ['corporation_account_withdrawal', 'player_trading', 'player_donation']
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
                    chord_data[fp][sp] = {"a":0,"c":0}

                transactions.append(wd.entry_id)
                chord_data[fp][sp]["a"] += am
                chord_data[fp][sp]["c"] += 1

    context = {
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
def pub_data(request, character_id=None):
    # get available models

    main_char, characters, net_worth = get_alts (request, character_id)
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
        table_data[char.character_name] = {"character":char,"history":{},"bio":"Nothing of value is here"}

    for h in corp_histories:
        table_data[h.character.character.character_name]["history"][str(h.record_id)] = {"name": h.corporation_name.name, "id":h.corporation_id, "started":h.start_date, "open": h.is_deleted}

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

    main_char, characters, net_worth = get_alts (request, character_id)
    character_ids = characters.values_list('character_id', flat=True)

    queues = SkillQueue.objects.filter(character__character__character_id__in=character_ids)\
                .select_related('skill_name', 'character__character')
    skills = Skill.objects.filter(character__character__character_id__in=character_ids)\
                .select_related('skill_name', 'skill_name__group', 'character__character')\
                .order_by('skill_name__name')

    totals = SkillTotals.objects.filter(character__character__character_id__in=character_ids)\
                .select_related('character__character')

    skill_tables = {}
    for skill in skills:
        char =  skill.character.character.character_name
        grp = skill.skill_name.group.name
        if char not in skill_tables:
            skill_tables[char] = {"character":skill.character, "omega": True, "skills":{}, "queue":[]}
        if grp not in skill_tables[char]["skills"]:
            skill_tables[char]["skills"][grp] = {}

        skill_tables[char]["skills"][grp][skill.skill_name.name] = {
                            "sp_total":skill.skillpoints_in_skill,
                            "active_level":skill.active_skill_level,
                            "trained_level":skill.trained_skill_level,
                        }
        if skill.alpha:
            skill_tables[char]["omega"] = False
    
    for que in queues:
        char = que.character.character.character_name
        if char not in skill_tables:
            skill_tables[char] = {"character":que.character, "omega": True, "skills":{}, "queue":[]}
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
            skill_tables[char] = {"character":total.character, "omega": True, "skills":{}, "queue":[]}
        skill_tables[char]["total_sp"] = total.total_sp
        skill_tables[char]["unallocated_sp"] = total.unallocated_sp

    context = {
        "main_char": main_char,
        "alts": characters,
        "net_worth": net_worth,

        "skill_tables": skill_tables,
    }

    return render(request, 'corptools/character/skills.html', context=context)

