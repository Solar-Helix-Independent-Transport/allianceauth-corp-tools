import csv
import json
import os
import re
import xml.etree.ElementTree as ET
from itertools import chain

from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo
from bravado.exception import HTTPError
from django.contrib import messages
from django.contrib.auth.decorators import (login_required,
                                            permission_required,
                                            user_passes_test)
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError
from django.db.models import Count
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django_celery_beat.models import CrontabSchedule, PeriodicTask
from esi.decorators import _check_callback, token_required
from esi.views import sso_redirect

from . import __version__, app_settings
from .forms import UploadForm
from .models import *
from .tasks import (check_account, process_ores_from_esi,
                    update_all_characters, update_all_corps,
                    update_all_eve_names, update_character, update_corp,
                    update_or_create_map, update_ore_comp_table)

CORP_REQUIRED_SCOPES = [

    # Tracking
    'esi-corporations.track_members.v1',
    'esi-corporations.read_titles.v1',
    'esi-corporations.read_corporation_membership.v1',
    'esi-killmails.read_corporation_killmails.v1',

    # Moons
    'esi-industry.read_corporation_mining.v1',

    # Structures
    'esi-planets.read_customs_offices.v1',
    'esi-corporations.read_starbases.v1',
    'esi-corporations.read_structures.v1',

    # Wallets
    'esi-wallet.read_corporation_wallets.v1',
    'esi-markets.read_corporation_orders.v1',
    'esi-industry.read_corporation_jobs.v1',
    'esi-corporations.read_divisions.v1',

    # Assets
    'esi-assets.read_corporation_assets.v1',

    # All...
    'esi-search.search_structures.v1',
    'esi-universe.read_structures.v1',
    'esi-characters.read_corporation_roles.v1',

]


@login_required
@token_required(scopes=app_settings.get_character_scopes())
def add_char(request, token):
    CharacterAudit.objects.update_or_create(
        character=EveCharacter.objects.get_character_by_id(token.character_id))
    update_character.apply_async(args=[token.character_id], priority=6)
    return redirect('corptools:reactmain', character_id=token.character_id)


@login_required
@token_required(scopes=CORP_REQUIRED_SCOPES)
def add_corp(request, token):
    char = EveCharacter.objects.get_character_by_id(token.character_id)
    corp, created = EveCorporationInfo.objects.get_or_create(corporation_id=char.corporation_id,
                                                             defaults={'member_count': 0,
                                                                       'corporation_ticker': char.corporation_ticker,
                                                                       'corporation_name': char.corporation_name
                                                                       })
    CorporationAudit.objects.update_or_create(corporation=corp)
    update_all_corps.apply_async(priority=6)
    return redirect('corptools:corp_react')


@login_required
def add_corp_section(request, *args, **kwargs):

    tracking = request.GET.get('t', False)
    assets = request.GET.get('a', False)
    structures = request.GET.get('s', False)
    wallets = request.GET.get('w', False)
    moons = request.GET.get('m', False)

    # if we're coming back from SSO with a new token, return it
    token = _check_callback(request)
    if token:
        logger.debug(
            "Got new token from %s session %s. Returning to view.",
            request.user,
            request.session.session_key[:5]
        )
        char = EveCharacter.objects.get_character_by_id(token.character_id)
        corp, created = EveCorporationInfo.objects.get_or_create(corporation_id=char.corporation_id,
                                                                 defaults={'member_count': 0,
                                                                           'corporation_ticker': char.corporation_ticker,
                                                                           'corporation_name': char.corporation_name
                                                                           })
        CorporationAudit.objects.update_or_create(corporation=corp)
        update_corp.apply_async(priority=6, args=[char.corporation_id])

        return redirect("{}#status".format(reverse('corptools:corp_react')))

    scopes = app_settings._corp_scopes_base

    if tracking:
        scopes += app_settings._corp_scopes_tracking

    if structures:
        scopes += app_settings._corp_scopes_structures

    if moons:
        scopes += app_settings._corp_scopes_moons

    if wallets:
        scopes += app_settings._corp_scopes_wallets

    if assets:
        scopes += app_settings._corp_scopes_assets

    # user has selected to add a new token
    return sso_redirect(request, scopes=scopes)


@login_required
@permission_required('corptools.view_characteraudit')
def corptools_menu(request):
    # get available models
    cas = CharacterAudit.objects.visible_to(request.user)\
        .select_related('character__character_ownership__user__profile__main_character',
                        'character__characteraudit')\
        .prefetch_related('character__character_ownership__user__character_ownerships')\
        .prefetch_related('character__character_ownership__user__character_ownerships__character')\
        .prefetch_related('character__character_ownership__user__character_ownerships__character__characteraudit')\


    chars = {}
    orphans = []
    for char in cas:
        try:
            main = char.character.character_ownership.user.profile.main_character
            if main:
                if main.character_name not in chars:
                    chars[str(main.character_id)] = {'main': main,
                                                     'audit': char}
            else:
                orphans.append(char)
        except ObjectDoesNotExist:
            orphans.append(char)

    if len(chars) == 1:
        return redirect('corptools:overview', chars[list(chars.keys())[0]]['main'].character_id)

    return render(request, 'corptools/menu.html', context={'characters': chars, 'orphans': orphans})


@login_required
@permission_required('corptools.admin')
def admin(request):
    # get available models
    names = EveName.objects.all().count()
    types = EveItemType.objects.all().count()
    dogma = EveItemDogmaAttribute.objects.all().count()
    groups = EveItemGroup.objects.all().count()
    categorys = EveItemCategory.objects.all().count()
    type_mets = InvTypeMaterials.objects.count()
    regions = MapRegion.objects.all().count()
    constellations = MapConstellation.objects.all().count()
    systems = MapSystem.objects.all().count()
    gates = MapSystemGate.objects.all().count()
    location = EveLocation.objects.all().count()
    bridges = MapJumpBridge.objects.all().count()

    characters = CharacterAudit.objects.all().count()
    skilllists = SkillList.objects.all().count()
    corpations = CorporationAudit.objects.all().count()

    char_tasks = PeriodicTask.objects.filter(
        task='corptools.tasks.update_subset_of_characters', enabled=True).count()
    corp_tasks = PeriodicTask.objects.filter(
        task='corptools.tasks.update_all_corps', enabled=True).count()

    context = {
        "names": names,
        "types": types,
        "dogma": dogma,
        "groups": groups,
        "categorys": categorys,
        "characters": characters,
        "skilllists": skilllists,
        "corpations": corpations,
        "type_mets": type_mets,
        "regions": regions,
        "constellations": constellations,
        "systems": systems,
        "location": location,
        "bridges": bridges,
        "gates": gates,
        "char_tasks": char_tasks,
        "corp_tasks": corp_tasks,
        "form": UploadForm(),
    }

    return render(request, 'corptools/admin.html', context=context)


@login_required
@permission_required('corptools.admin')
def admin_run_tasks(request):
    if request.method == 'POST':
        if request.POST.get('run_universe'):
            messages.info(request, "Queued update_or_create_map")
            update_or_create_map.apply_async(priority=6)
        if request.POST.get('run_update_all'):
            messages.info(request, "Queued update_all_characters")
            update_all_characters.apply_async(priority=6)
        if request.POST.get('run_update_eve_models'):
            messages.info(request, "Queued update_all_eve_names")
            update_all_eve_names.apply_async(priority=6)
        if request.POST.get('run_corp_updates'):
            messages.info(request, "Queued update_all_corps")
            update_all_corps.apply_async(priority=6)

    return redirect('corptools:admin')


@login_required
@permission_required('corptools.admin')
def admin_create_tasks(request):
    schedule_char, _ = CrontabSchedule.objects.get_or_create(minute='15,45',
                                                             hour='*',
                                                             day_of_week='*',
                                                             day_of_month='*',
                                                             month_of_year='*',
                                                             timezone='UTC'
                                                             )

    schedule_corp, _ = CrontabSchedule.objects.get_or_create(minute='30',
                                                             hour='*',
                                                             day_of_week='*',
                                                             day_of_month='*',
                                                             month_of_year='*',
                                                             timezone='UTC'
                                                             )

    task_char = PeriodicTask.objects.update_or_create(
        task='corptools.tasks.update_subset_of_characters',
        defaults={
            'crontab': schedule_char,
            'name': 'Character Audit Rolling Update',
            'enabled': True
        }
    )
    # if created:
    #    messages.info(request, "Created Character Task")
    # else:
    #    messages.info(request, "Reset Character Task to defaults")

    task_corp = PeriodicTask.objects.update_or_create(
        task='corptools.tasks.update_all_corps',
        defaults={
            'crontab': schedule_corp,
            'name': 'Corporation Audit Update',
            'enabled': True
        }
    )
    # if created:
    #    messages.info(request, "Created Corporation Task")
    # else:
    #    messages.info(request, "Reset Corporation Task to defaults")

    # https://github.com/celery/django-celery-beat/issues/106
    messages.info(
        request, "Created/Reset Character and Corporation Task to defaults")

    return redirect('corptools:admin')


@login_required
@permission_required('corptools.admin')
def admin_add_pyfa_xml(request):
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            xml_file = form.files.get('file')
            if xml_file.content_type == 'text/xml':
                skills = {}
                tree = ET.parse(xml_file)
                root = tree.getroot()
                if root.tag == "plan":
                    for child in root:
                        if child.tag == "entry":
                            skill = child.attrib.get('skill')
                            level = child.attrib.get('level')
                            if skill in skills:
                                if level > skills[skill]:
                                    skills[skill] = level
                            else:
                                skills[skill] = level
                sl, created = SkillList.objects.update_or_create(name=request.POST["name"],
                                                                 defaults={
                    "skill_list": json.dumps(skills)
                })

                messages.success(request, "File Uploaded and Processed! {}: {}".format(
                    ("Created" if created else "Updated"),
                    request.POST["name"]
                ))
            else:
                messages.error(
                    request, "File Upload Failed! Must be XML Exported from PYFA!")
        else:
            messages.error(request, "File Upload Failed! Invalid Form")
    else:
        messages.error(
            request, "File Upload Failed! What are you doing your not meant to be here?")

    return redirect('corptools:admin')


@login_required
@permission_required('corptools.admin')
def skill_list_editor(request):
    pass


@login_required
def update_account(request, character_id):
    check_account.apply_async(args=[character_id], priority=6)
    messages.success(request, "Requested an update task.")
    return redirect('corptools:view')


@login_required
def react_menu(request):
    # get available models
    return redirect('corptools:reactmain', request.user.profile.main_character.character_id)


@login_required
def react_main(request, character_id):
    # get available models
    return render(request, 'corptools/character/react_base.html', context={"version": __version__, "app_name": "corptools/char", "page_title": "Character Audit"})


@login_required
def react_corp(request):
    # get available models
    return render(request, 'corptools/corporation/react_base.html')
