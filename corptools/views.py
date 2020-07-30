import os

from bravado.exception import HTTPError
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required, user_passes_test
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError
from django.db.models import Count
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.translation import ugettext_lazy as _
from esi.decorators import token_required
from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo
from django.http import HttpResponse
import csv
import re
from itertools import chain
from .models import * 
from .tasks import update_character, update_all_characters, update_ore_comp_table, update_or_create_map, process_ores_from_esi

CHAR_REQUIRED_SCOPES = [
    'esi-calendar.read_calendar_events.v1',
    'esi-universe.read_structures.v1',
    'esi-fittings.read_fittings.v1',
    'esi-mail.read_mail.v1',
    'esi-characters.read_standings.v1',
    'esi-assets.read_assets.v1',
    'esi-characters.read_contacts.v1',
    'esi-characters.read_corporation_roles.v1',
    'esi-characters.read_notifications.v1',
    'esi-characters.read_opportunities.v1',
    'esi-characters.read_titles.v1',
    'esi-clones.read_clones.v1',
    'esi-clones.read_implants.v1',
    'esi-contracts.read_character_contracts.v1',
    'esi-fleets.read_fleet.v1',
    'esi-industry.read_character_jobs.v1',
    'esi-industry.read_character_mining.v1',
    'esi-killmails.read_killmails.v1',
    'esi-location.read_location.v1',
    'esi-location.read_online.v1',
    'esi-location.read_ship_type.v1',
    'esi-markets.read_character_orders.v1',
    'esi-search.search_structures.v1',
    'esi-skills.read_skillqueue.v1',
    'esi-skills.read_skills.v1',
    'esi-ui.open_window.v1',
    'esi-ui.write_waypoint.v1',
    'esi-universe.read_structures.v1',
    'esi-wallet.read_character_wallet.v1'
    ]

CORP_REQUIRED_SCOPES = [
    'esi-assets.read_corporation_assets.v1',
    'esi-characters.read_corporation_roles.v1',
    'esi-corporations.read_corporation_membership.v1',
    'esi-corporations.read_divisions.v1',
    'esi-corporations.read_starbases.v1',
    'esi-corporations.read_structures.v1',
    'esi-corporations.read_titles.v1',
    'esi-corporations.track_members.v1',
    'esi-industry.read_corporation_jobs.v1',
    'esi-industry.read_corporation_mining.v1',
    'esi-killmails.read_corporation_killmails.v1',
    'esi-markets.read_corporation_orders.v1',
    'esi-planets.read_customs_offices.v1',
    'esi-search.search_structures.v1',
    'esi-universe.read_structures.v1',
    'esi-wallet.read_corporation_wallets.v1'
]

@login_required
@token_required(scopes=CHAR_REQUIRED_SCOPES)
def add_char(request, token):
    CharacterAudit.objects.update_or_create(character=EveCharacter.objects.get_character_by_id(token.character_id))
    update_character.apply_async(args=[token.character_id], priority=6)
    return redirect('corptools:view')

@login_required
@token_required(scopes=CORP_REQUIRED_SCOPES)
def add_corp(request, token):
    corp, created = EveCorporationInfo.objects.get_or_create(corporation_id=EveCharacter.objects.get_character_by_id(token.character_id).corporation_id)
    CorporationAudit.objects.update_or_create(corporation=corp)
    
    return redirect('corptools:view')

@login_required
@permission_required('corptools.view_characteraudit')
def corptools_menu(request):
    # get available models
    cas = CharacterAudit.objects.visible_to(request.user).select_related('character__character_ownership__user__profile__main_character').prefetch_related('character__character_ownership__user__character_ownerships').prefetch_related('character__character_ownership__user__character_ownerships__character')

    chars = {}
    orphans = []
    for char in cas:
        try:
            main = char.character.character_ownership.user.profile.main_character
            if main:
                if main.character_name not in chars:
                    chars[str(main.character_id)] = {'main':main, 'audit':char}
            else:
                orphans.append(char)
        except ObjectDoesNotExist:
            orphans.append(char)

    if len(chars) == 1:
        return redirect('corptools:overview', chars[list(chars.keys())[0]]['main'].character_id)

    return render(request, 'corptools/menu.html', context={'characters':chars, 'orphans':orphans})

@login_required
@permission_required('corptools.admin')
def admin(request):
    # get available models
    names = EveName.objects.all().count()
    types = EveItemType.objects.all().count()
    dogma = EveItemDogmaAttribute.objects.all().count()
    groups = EveItemGroup.objects.all().count()
    categorys = EveItemCategory.objects.all().count()
    characters = CharacterAudit.objects.all().count()
    corpations = CorporationAudit.objects.all().count()
    type_mets = InvTypeMaterials.objects.count()
    regions = MapRegion.objects.all().count()
    constellations = MapConstellation.objects.all().count()
    systems = MapSystem.objects.all().count()

    context = {
        "names": names,
        "types": types,
        "dogma": dogma,
        "groups": groups,
        "categorys": categorys,
        "characters": characters,
        "corpations": corpations,
        "type_mets": type_mets,
        "regions": regions,
        "constellations": constellations,
        "systems": systems,
    }
    return render(request, 'corptools/admin.html', context=context)

@login_required
@permission_required('corptools.admin')
def admin_run_tasks(request):
    if request.method == 'POST':
        if request.POST.get('run_universe'):
            update_or_create_map.apply_async(priority=6)
        if request.POST.get('run_update_all'):
            update_all_characters.apply_async(priority=6)
        if request.POST.get('run_update_eve_models'):
            update_ore_comp_table.apply_async(priority=6)
            process_ores_from_esi.apply_async(priority=6)
        if request.POST.get('run_corp_updates'):
            pass  # no task yet
    return redirect('corptools:admin')
