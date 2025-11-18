import json
import xml.etree.ElementTree as ET
from datetime import timedelta

from celery.schedules import crontab
from django_celery_beat.models import CrontabSchedule, PeriodicTask

from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.shortcuts import redirect, render
from django.template import TemplateDoesNotExist
from django.urls import reverse
from django.utils import timezone

from allianceauth.crontab.utils import offset_cron
from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo
from allianceauth.services.hooks import get_extension_logger
from esi.decorators import _check_callback, token_required
from esi.views import sso_redirect

from . import __version__, app_settings
from .app_settings import CORP_REQUIRED_SCOPES
from .api.corporation import dashboards
from .forms import UploadForm
from .models import (
    CharacterAudit, CorpAsset, CorporationAudit, CorptoolsConfiguration,
    EveItemCategory, EveItemDogmaAttribute, EveItemGroup, EveItemType,
    EveLocation, EveName, InvTypeMaterials, MapConstellation, MapJumpBridge,
    MapRegion, MapSystem, MapSystemGate, SkillList, Structure,
)
from .tasks import (
    check_account, clear_all_etags, update_all_characters, update_all_corps,
    update_all_eve_names, update_all_locations, update_character, update_corp,
    update_or_create_map,
)

logger = get_extension_logger(__name__)


@login_required
@token_required(scopes=app_settings.get_character_scopes())
def add_char(request, token):
    CharacterAudit.objects.update_or_create(
        character=EveCharacter.objects.get_character_by_id(token.character_id))
    update_character.apply_async(args=[token.character_id], kwargs={
                                 "force_refresh": True}, priority=6)
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
    starbases = request.GET.get('sb', False)
    wallets = request.GET.get('w', False)
    moons = request.GET.get('m', False)
    pocos = request.GET.get('p', False)
    contracts = request.GET.get('c', False)
    industry_jobs = request.GET.get('i', False)

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

    if starbases:
        scopes += app_settings._corp_scopes_starbases

    if moons:
        scopes += app_settings._corp_scopes_moons

    if wallets:
        scopes += app_settings._corp_scopes_wallets

    if assets and not pocos:
        scopes += app_settings._corp_scopes_assets

    if pocos:
        scopes += app_settings._corp_scopes_pocos
        scopes += app_settings._corp_scopes_assets

    if contracts:
        scopes += app_settings._corp_scopes_contracts

    if industry_jobs:
        scopes += app_settings._corp_scopes_industry_jobs

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
    actives = CharacterAudit.get_oldest_qs().count()
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
        "active_chars": actives,
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
        "ct_config": CorptoolsConfiguration.get_solo(),
        "app_settings": app_settings
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
            update_all_corps.apply_async(
                priority=6, kwargs={"force_refresh": True})
        if request.POST.get('run_locations'):
            messages.info(request, "Queued update_all_locations")
            update_all_locations.apply_async(priority=6)
        if request.POST.get('run_clear_etag'):
            messages.info(request, "Queued clear_all_etags")
            clear_all_etags.apply_async(priority=1)

    return redirect('corptools:admin')


@login_required
@permission_required('corptools.admin')
def admin_create_tasks(request):

    schedule_a = CrontabSchedule.from_schedule(
        offset_cron(crontab(minute='15,45')))
    schedule_char, created = CrontabSchedule.objects.get_or_create(
        minute=schedule_a.minute,
        hour=schedule_a.hour,
        day_of_month=schedule_a.day_of_month,
        month_of_year=schedule_a.month_of_year,
        day_of_week=schedule_a.day_of_week,
        timezone=schedule_a.timezone,
    )

    schedule_b = CrontabSchedule.from_schedule(
        offset_cron(crontab(minute='30')))
    schedule_corp, schedule_corp_created = CrontabSchedule.objects.get_or_create(
        minute=schedule_b.minute,
        hour=schedule_b.hour,
        day_of_month=schedule_b.day_of_month,
        month_of_year=schedule_b.month_of_year,
        day_of_week=schedule_b.day_of_week,
        timezone=schedule_b.timezone,
    )

    PeriodicTask.objects.update_or_create(
        task='corptools.tasks.update_subset_of_characters',
        defaults={
            'crontab': schedule_char,
            'name': 'Character Audit Rolling Update',
            'enabled': True
        }
    )

    PeriodicTask.objects.update_or_create(
        task='corptools.tasks.update_all_corps',
        defaults={
            'crontab': schedule_corp,
            'name': 'Corporation Audit Update',
            'enabled': True
        }
    )

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
    return redirect('corptools:reactlegacymain', request.user.profile.main_character.character_id)


@login_required
def react_menu_v4(request):
    if request.path.startswith('/audit/r_beta/corp/glance'):
        return render(request, 'corptools/base_bs5.html', context={"version": __version__, "app_name": "corptools/bs5", "page_title": "Audit"})
    return redirect('corptools:reactmain', request.user.profile.main_character.character_id)


@login_required
def react_corp_beta(request):
    return render(request, 'corptools/base_bs5.html', context={"version": __version__, "app_name": "corptools/bs5", "page_title": "Audit"})


@login_required
def react_main(request, character_id):
    try:
        return render(request, 'corptools/base_bs5.html', context={"version": __version__, "app_name": "corptools/bs5", "page_title": "Audit"})
    except TemplateDoesNotExist:
        pass

    return render(request, 'corptools/character/react_base.html', context={"version": __version__, "app_name": "corptools/char", "page_title": "Character Audit"})


@login_required
def v3_ui_render(request, character_id):
    return render(request, 'corptools/character/react_base.html', context={"version": __version__, "app_name": "corptools/char", "page_title": "Character Audit"})


@login_required
def react_corp(request):
    return render(request, 'corptools/corporation/react_base.html', context={"version": __version__, "app_name": "corptools/corp", "page_title": "Corporation Audit"})


@login_required
def fuel_levels(request):
    if not (request.user.has_perm('corptools.own_corp_manager')
            or request.user.has_perm('corptools.alliance_corp_manager')
            or request.user.has_perm('corptools.state_corp_manager')
            or request.user.has_perm('corptools.global_corp_manager')
            or request.user.has_perm('corptools.holding_corp_structures')):
        raise PermissionDenied("No perms to view")

    # hourly fuel reqs [ cit, eng, ref, flex ]
    citadel_service_mods = {
        'Clone Bay': [7.5, 10, 10, 10],
        'Market': [30, 40, 40, 40],
        'Manufacturing (Capitals)': [24, 18, 24, 24],
        # how to detect this
        'Standup Hyasyoda Research Lab': [10, 7.5, 10, 10],
        'Invention': [12, 9, 12, 12],
        'Manufacturing (Standard)': [12, 9, 12, 12],
        'Blueprint Copying': [12, 9, 12, 12],
        'Material Efficiency Research': [0, 0, 0, 0],  # part of above
        'Time Efficiency Research': [0, 0, 0, 0],  # part of above
        'Manufacturing (Super Capitals)': [36, 27, 36, 36],
        'Composite Reactions': [15, 15, 12, 15],
        'Hybrid Reactions': [15, 15, 12, 15],
        'Moon Drilling': [5, 5, 5, 5],
        'Biochemical Reactions': [15, 15, 12, 15],
        'Reprocessing': [10, 10, 7.5, 10],
        'Jump Access': [0, 0, 0, 15],  # large to show errors
        'Cynosural Jammer': [0, 0, 0, 40],
        'Jump Gate Access': [0, 0, 0, 30],
        'Jump Bridge Access': [0, 0, 0, 30],
        'Automatic Moon Drilling': [0, 0, 0, 5]
    }

    cit = [35833, 47516, 47512, 47513, 47514, 47515, 35832, 35834]
    eng = [35827, 35826, 35825]
    ref = [35835, 35836]
    fle = [37534, 35841, 35840, 81826]

    flex_fuel_types = [81143]

    all_structures = Structure.get_visible(request.user).select_related(
        'corporation', 'corporation__corporation', 'system_name', 'type_name',
        'system_name__constellation', 'system_name__constellation__region'
    ).prefetch_related('structureservice_set')

    structure_tree = []
    total_hourly_fuel = 0
    for s in all_structures:
        structure_hourly_fuel = 0
        structure_type = 99

        if s.type_id in cit:
            structure_type = 0
        elif s.type_id in eng:
            structure_type = 1
        elif s.type_id in ref:
            structure_type = 2
        elif s.type_id in fle:
            structure_type = 3

        for service in s.structureservice_set.all():
            if service.state == 'online':
                fuel_use = citadel_service_mods[service.name][structure_type]
                total_hourly_fuel += fuel_use
                structure_hourly_fuel += fuel_use

        hours = 0

        if s.fuel_expires is not None:
            hours = (s.fuel_expires - timezone.now()).total_seconds() // 3600

        extras = None

        if s.type_id == 81826:
            fuels = CorpAsset.objects.filter(
                type_id__in=flex_fuel_types,
                location_id=s.structure_id
            ).select_related(
                'type_name'
            )
            out = {
                "qty": 0,
            }
            for itm in fuels:
                out["name"] = itm.type_name.name
                out["qty"] += itm.quantity

            out["expires"] = timezone.now() + timedelta(hours=out["qty"] /
                                                        app_settings.CT_CHAR_METENOX_GAS_USE_HOURLY)
            if out['qty'] > 0:
                extras = out

        structure_tree.append(
            {
                'structure': s,
                'fuel_req': structure_hourly_fuel,
                "current_blocks": int(hours * structure_hourly_fuel),
                "extra_fuel_info": extras,
                "90day": max(
                    int(
                        (
                            structure_hourly_fuel * 90 * 24
                        ) - (
                            hours * structure_hourly_fuel
                        )
                    ),
                    0
                )
            }
        )

    context = {
        'structures': structure_tree,
        'total_hourly_fuel': total_hourly_fuel,
    }
    return render(request, 'corptools/dashboards/fuel_dash.html', context=context)


@login_required
def metenox_levels(request):
    if not (request.user.has_perm('corptools.own_corp_manager')
            or request.user.has_perm('corptools.alliance_corp_manager')
            or request.user.has_perm('corptools.state_corp_manager')
            or request.user.has_perm('corptools.global_corp_manager')
            or request.user.has_perm('corptools.holding_corp_structures')):
        raise PermissionDenied("No perms to view")

    context = {
        'structures': dashboards.DashboardApiEndpoints.get_dashboard_drills_levels(request),
    }
    return render(request, 'corptools/dashboards/metenox_dash.html', context=context)
