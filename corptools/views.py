# Standard Library
import json
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from datetime import timezone as dt_timezone
from math import ceil
from pathlib import Path

# Third Party
from celery.schedules import crontab
from django_celery_beat.models import CrontabSchedule, PeriodicTask

# Django
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.http import FileResponse, Http404, JsonResponse
from django.shortcuts import redirect, render
from django.template import TemplateDoesNotExist
from django.template.defaultfilters import filesizeformat
from django.urls import reverse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

# Alliance Auth
from allianceauth.crontab.utils import offset_cron
from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo
from allianceauth.framework.datatables import DataTablesView
from allianceauth.services.hooks import get_extension_logger
from esi.decorators import _check_callback, token_required
from esi.views import sso_redirect

from . import __version__, app_settings
from .api.corporation import dashboards
from .api.helpers import format_hours_as_duration
from .forms import UploadForm
from .models import (
    CharacterAudit,
    CharacterWalletJournalEntry,
    CorpAsset,
    CorporationAudit,
    CorporationWalletJournalEntry,
    CorptoolsConfiguration,
    EveLocation,
    EveName,
    MapJumpBridge,
    SkillList,
    Structure,
)
from .tasks import (
    ETAG_CLEAR_GROUPS,
    check_account,
    clear_etags_for_operation,
    update_all_characters,
    update_all_corps,
    update_all_eve_names,
    update_all_locations,
    update_character,
    update_corp,
)

logger = get_extension_logger(__name__)

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
    'esi-corporations.read_blueprints.v1',

    # All...
    'esi-search.search_structures.v1',
    'esi-universe.read_structures.v1',
    'esi-characters.read_corporation_roles.v1',

]


@login_required
@token_required(scopes=app_settings.get_character_scopes())
def add_char(request, token):
    ca, _ = CharacterAudit.objects.update_or_create(
        character=EveCharacter.objects.get_character_by_id(token.character_id))
    update_character.apply_async(args=[token.character_id], kwargs={
                                 "force_refresh": True}, priority=6)
    messages.success(
        request, f"Update Tasks for `{ca.character.character_name}` added to queue.")
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
    messages.success(
        request, f"Update Tasks for `{corp.corporation_name}` added to queue.")

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
    sovereignty = request.GET.get('sov', False)

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
        messages.success(
            request, f"Update Tasks for `{corp.corporation_name}` added to queue.")
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

    if sovereignty:
        scopes += app_settings._corp_scopes_sov

    # user has selected to add a new token
    return sso_redirect(request, scopes=scopes)


@login_required
@permission_required('corptools.admin')
def admin(request):
    # Django
    from django.apps import apps
    fittings_installed = apps.is_installed('fittings')
    available_fittings = []
    if fittings_installed:
        # Third Party
        from fittings.models import Fitting
        available_fittings = list(Fitting.objects.select_related(
            'ship_type').order_by('ship_type__name', 'name'))

    names = EveName.objects.all().count()
    location = EveLocation.objects.all().count()
    bridges = MapJumpBridge.objects.all().count()

    characters = CharacterAudit.objects.all().count()
    actives = len(CharacterAudit.get_oldest_qs())
    skilllists = SkillList.objects.all().count()
    corpations = CorporationAudit.objects.all().count()

    char_tasks = PeriodicTask.objects.filter(
        task='corptools.tasks.update_subset_of_characters', enabled=True).count()
    corp_tasks = PeriodicTask.objects.filter(
        task='corptools.tasks.update_all_corps', enabled=True).count()

    context = {
        "names": names,
        "location": location,
        "bridges": bridges,
        "characters": characters,
        "active_chars": actives,
        "skilllists": skilllists,
        "corpations": corpations,
        "char_tasks": char_tasks,
        "corp_tasks": corp_tasks,
        "form": UploadForm(),
        "ct_config": CorptoolsConfiguration.get_solo(),
        "app_settings": app_settings,
        "etag_clear_groups": ETAG_CLEAR_GROUPS,
        "fittings_installed": fittings_installed,
        "available_fittings": available_fittings,
    }

    return render(request, 'corptools/admin.html', context=context)


@login_required
@permission_required('corptools.admin')
def admin_run_tasks(request):
    if request.method == 'POST':
        if request.POST.get('run_update_all'):
            messages.info(request, "Queued update_all_characters")
            update_all_characters.apply_async(
                priority=6,
                kwargs={
                    "force_refresh": False,
                    "now": True
                }
            )
        if request.POST.get('run_update_eve_models'):
            messages.info(request, "Queued update_all_eve_names")
            update_all_eve_names.apply_async(priority=6)
        if request.POST.get('run_corp_updates'):
            messages.info(request, "Queued update_all_corps")
            update_all_corps.apply_async(
                priority=6,
                kwargs={
                    "force_refresh": False
                }
            )
        if request.POST.get('run_locations'):
            messages.info(request, "Queued update_all_locations")
            update_all_locations.apply_async(priority=6)
        etag_groups = request.POST.getlist('etag_groups')
        if etag_groups:
            valid_groups = [g for g in etag_groups if g in ETAG_CLEAR_GROUPS]
            if valid_groups:
                labels = ", ".join(
                    ETAG_CLEAR_GROUPS[g]["label"] for g in valid_groups)
                messages.info(request, f"Queued etag clear for: {labels}")
                clear_etags_for_operation.apply_async(
                    priority=1, kwargs={"group_keys": valid_groups})

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
def admin_add_fitting(request):
    if request.method != 'POST':
        messages.error(request, "Invalid request method.")
        return redirect('corptools:admin')

    try:
        # Third Party
        from eve_sde.models import ItemType, TypeDogma
        from fittings.models import Fitting, FittingItem
    except (ImportError, RuntimeError):
        messages.error(request, "Fittings module is not installed.")
        return redirect('corptools:admin')

    fitting_id = request.POST.get('fitting_id', '').strip()
    name = request.POST.get('name', '').strip()

    if not fitting_id or not name:
        messages.error(request, "Fitting and name are required.")
        return redirect('corptools:admin')

    try:
        fitting = Fitting.objects.get(id=int(fitting_id))
    except (Fitting.DoesNotExist, ValueError):
        messages.error(request, "Fitting not found.")
        return redirect('corptools:admin')

    _skill_ids = [182, 183, 184, 1285, 1289, 1290]
    _level_ids = [277, 278, 279, 1286, 1287, 1288]

    item_type_ids = list(FittingItem.objects.filter(
        fit=fitting).values_list("type_id", flat=True))
    type_dogma = TypeDogma.objects.filter(
        item_type_id__in=item_type_ids + [fitting.ship_type_type_id],
        dogma_attribute_id__in=_skill_ids + _level_ids
    )

    required = {}
    for t in type_dogma:
        if t.item_type_id not in required:
            required[t.item_type_id] = {
                i: {"skill": 0, "level": 0} for i in range(6)}
        a = t.dogma_attribute_id
        v = int(t.value)
        if a in _skill_ids:
            required[t.item_type_id][_skill_ids.index(a)]["skill"] = v
        elif a in _level_ids:
            idx = _level_ids.index(a)
            if required[t.item_type_id][idx]["level"] < v:
                required[t.item_type_id][idx]["level"] = v

    skill_max_levels = {}
    for item_skills in required.values():
        for s in item_skills.values():
            if s["skill"]:
                sid = s["skill"]
                if sid not in skill_max_levels or s["level"] > skill_max_levels[sid]:
                    skill_max_levels[sid] = s["level"]

    skills = {
        t.name: skill_max_levels[t.id]
        for t in ItemType.objects.filter(id__in=list(skill_max_levels.keys()))
    }

    sl, created = SkillList.objects.update_or_create(
        name=name,
        defaults={"skill_list": json.dumps(skills)}
    )
    messages.success(
        request,
        "{}: {} ({} skills from {})".format(
            "Created" if created else "Updated",
            name,
            len(skills),
            fitting.name,
        )
    )
    return redirect('corptools:admin')


@login_required
@permission_required('corptools.admin')
def skill_list_editor(request):
    pass


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


# @login_required
# def v3_ui_render(request, character_id):
#     return render(request, 'corptools/character/react_base.html', context={"version": __version__, "app_name": "corptools/char", "page_title": "Character Audit"})


# @login_required
# def react_corp(request):
#     return render(request, 'corptools/corporation/react_base.html', context={"version": __version__, "app_name": "corptools/corp", "page_title": "Corporation Audit"})


def _get_char_update_ts_columns():
    ct_conf = CorptoolsConfiguration.get_solo()
    cols = []
    if not ct_conf.disable_update_pub_data:
        cols.append(('pub_data', _('Public Data')))
    if app_settings.CT_CHAR_ASSETS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_ASSETS_MODULE and not ct_conf.disable_update_assets:
        cols.append(('assets', _('Assets')))
    if app_settings.CT_CHAR_CLONES_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_CLONES_MODULE and not ct_conf.disable_update_clones:
        cols.append(('clones', _('Clones')))
    if app_settings.CT_CHAR_SKILLS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE and not ct_conf.disable_update_skills:
        cols.append(('skills', _('Skills')))
        cols.append(('skill_que', _('Skill Queue')))
    if app_settings.CT_CHAR_WALLET_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_WALLET_MODULE and not ct_conf.disable_update_wallet:
        cols.append(('wallet', _('Wallet')))
        cols.append(('orders', _('Orders')))
    if app_settings.CT_CHAR_NOTIFICATIONS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_NOTIFICATIONS_MODULE and not ct_conf.disable_update_notif:
        cols.append(('notif', _('Notifications')))
    if app_settings.CT_CHAR_ROLES_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_ROLES_MODULE and not ct_conf.disable_update_roles:
        cols.append(('roles', _('Roles')))
    if app_settings.CT_CHAR_MAIL_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_MAIL_MODULE and not ct_conf.disable_update_mails:
        cols.append(('mails', _('Mail')))
    if app_settings.CT_CHAR_LOYALTYPOINTS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_LOYALTYPOINTS_MODULE and not ct_conf.disable_update_loyaltypoints:
        cols.append(('loyaltypoints', _('Loyalty Points')))
    if app_settings.CT_CHAR_MINING_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_MINING_MODULE and not ct_conf.disable_update_mining:
        cols.append(('mining', _('Mining')))
    return cols


@method_decorator(login_required, name='dispatch')
@method_decorator(permission_required('corptools.admin'), name='dispatch')
class CharacterUpdateDashData(DataTablesView):
    model = CharacterAudit

    _FIXED_COLUMNS = [
        ('character__character_name', 'corptools/stubs/char_updates/character.html'),
        ('character__character_ownership__user__profile__main_character__character_name',
         'corptools/stubs/char_updates/main.html'),
        ('character__character_ownership__user__profile__main_character__corporation_name',
         'corptools/stubs/char_updates/corporation.html'),
        ('character__character_ownership__user__profile__main_character__alliance_name',
         'corptools/stubs/char_updates/alliance.html'),
        ('active', 'corptools/stubs/char_updates/active.html'),
    ]

    @property
    def columns(self):
        cols = list(self._FIXED_COLUMNS)
        for key, _ in _get_char_update_ts_columns():
            ts_tmpl = (
                '{{% if row.update_timestamps.{key} %}}'
                '<span class="ts-cell" data-ts="{{{{ row.update_timestamps.{key} }}}}"></span>'
                '{{% else %}}—{{% endif %}}'
            ).format(key=key)
            cols.append(('update_timestamps__' + key, ts_tmpl))
        return cols

    def get_model_qs(self, request, *args, **kwargs):
        qs = CharacterAudit.objects.visible_to(request.user).filter(
            character__character_ownership__isnull=False,
        ).select_related(
            'character',
            'character__character_ownership',
            'character__character_ownership__user',
            'character__character_ownership__user__profile',
            'character__character_ownership__user__profile__main_character',
        )
        filter_active = request.GET.get('filter_active', '')
        if filter_active != '':
            qs = qs.filter(active=(filter_active == '1'))
        return qs


@login_required
@permission_required('corptools.admin')
def character_update_dashboard(request):
    headers = [display for _, display in _get_char_update_ts_columns()]
    return render(request, 'corptools/dashboards/character_updates_dash.html', {'headers': headers})


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

    all_structures = Structure.get_visible(
        request.user
    ).select_related(
        'corporation', 'corporation__corporation', 'system_name', 'type_name',
        'system_name__constellation', 'system_name__constellation__region'
    ).prefetch_related('structureservice_set')

    structure_tree = []
    metenox_hourly_gas = app_settings.CT_CHAR_METENOX_GAS_USE_HOURLY
    total_hourly_fuel = 0
    # Builds fuel consumption tree for visible structures with metenox projections
    for s in all_structures:
        structure_hourly_fuel = 0
        structure_type = 99
        current_metenox_gas = 0
        current_metenox_gas_hourly = 0
        current_metenox_gas_hours = 0

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

        rounded_hourly_fuel = ceil(structure_hourly_fuel)
        hours = 0

        if s.fuel_expires is not None:
            hours = max(
                ceil((s.fuel_expires - timezone.now()).total_seconds() / 3600),
                0
            )

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

            current_metenox_gas = out["qty"]
            current_metenox_gas_hourly = metenox_hourly_gas
            current_metenox_gas_hours = max(
                ceil(current_metenox_gas / current_metenox_gas_hourly),
                0
            )
            out["expires"] = timezone.now() + timedelta(hours=out["qty"] /
                                                        metenox_hourly_gas)
            if out['qty'] > 0:
                extras = out

        current_blocks = max(hours * rounded_hourly_fuel, 0)
        structure_tree.append(
            {
                'structure': s,
                # Expose hourly/day/month usage so the dashboard can total
                # filtered rows client-side without re-querying the server.
                'fuel_req': rounded_hourly_fuel,
                'fuel_req_day': rounded_hourly_fuel * 24,
                'fuel_req_30d': rounded_hourly_fuel * 720,
                'gas_req': current_metenox_gas_hourly,
                'gas_req_day': current_metenox_gas_hourly * 24,
                'gas_req_30d': current_metenox_gas_hourly * 720,
                "current_blocks": current_blocks,
                "extra_fuel_info": extras,
                "metenox_gas_hourly": current_metenox_gas_hourly,
                "current_metenox_gas": current_metenox_gas,
                "block_hours_left": hours,
                "gas_hours_left": current_metenox_gas_hours,
                "block_duration_left": format_hours_as_duration(hours),
                "gas_duration_left": format_hours_as_duration(current_metenox_gas_hours),
                "90day": max(
                    (rounded_hourly_fuel * 90 * 24) - current_blocks,
                    0
                ),
                "gas_90day": max(
                    (current_metenox_gas_hourly * 90 * 24) - current_metenox_gas,
                    0
                ),
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


def _wallet_export_root() -> Path:
    # Django
    from django.conf import settings
    return Path(settings.MEDIA_ROOT) / "wallet_exports"


def _list_wallet_fixture_rows(entity_type: str) -> list:
    fixture_root = _wallet_export_root() / "fixtures" / entity_type
    rows = []
    if fixture_root.exists():
        for entity_dir in fixture_root.iterdir():
            if not entity_dir.is_dir():
                continue
            for f in entity_dir.iterdir():
                if f.suffix != ".json" or f.name == "watermark.json":
                    continue
                rows.append({
                    "entity_name": entity_dir.name,
                    "filename": f.name,
                    "size": f.stat().st_size,
                    "modified": datetime.fromtimestamp(
                        f.stat().st_mtime, tz=dt_timezone.utc),
                    "entity_path": entity_dir.name,
                })
    return rows


@login_required
def wallet_export_list(request):
    if not request.user.is_superuser:
        raise PermissionDenied

    if request.method == "POST":
        if "run_fixtures" in request.POST:
            from .tasks.housekeeping import export_old_wallet_fixtures
            export_old_wallet_fixtures.apply_async(priority=6)
            messages.info(request, "Wallet fixture export task queued.")
        elif "run_purge" in request.POST:
            from .tasks.housekeeping import purge_old_wallet_data
            purge_old_wallet_data.apply_async(priority=6)
            messages.warning(request, "Wallet purge task queued.")
        return redirect("corptools:wallet_export_list")

    has_fixtures = {
        entity_type: bool(_list_wallet_fixture_rows(entity_type))
        for entity_type in ("characters", "corporations")
    }

    from .models.audits import CorptoolsConfiguration
    from .task_helpers.housekeeping_tasks import WALLET_NPC_TYPES
    config = CorptoolsConfiguration.get_solo()
    cutoff = timezone.now() - timedelta(days=config.wallet_journal_retention_days)

    char_purge_count = CharacterWalletJournalEntry.objects.filter(
        ref_type__in=WALLET_NPC_TYPES, date__lt=cutoff).count()
    corp_purge_count = CorporationWalletJournalEntry.objects.filter(
        ref_type__in=WALLET_NPC_TYPES, date__lt=cutoff).count()
    char_total_count = CharacterWalletJournalEntry.objects.all().count()
    corp_total_count = CorporationWalletJournalEntry.objects.all().count()

    return render(request, "corptools/wallet_export_list.html", {
        "has_fixtures": has_fixtures,
        "retention_days": config.wallet_journal_retention_days,
        "npc_type_count": len(WALLET_NPC_TYPES),
        "char_purge_count": char_purge_count,
        "corp_purge_count": corp_purge_count,
        "char_total_count": char_total_count,
        "corp_total_count": corp_total_count,
        "total_all_count": char_total_count + corp_total_count,
        "total_purge_count": char_purge_count + corp_purge_count
    }
    )


@login_required
def wallet_fixture_data(request, entity_type):
    if not request.user.is_superuser:
        raise PermissionDenied

    if entity_type not in ("characters", "corporations"):
        raise Http404

    draw = int(request.GET.get("draw", 1))
    start = int(request.GET.get("start", 0))
    length = int(request.GET.get("length", 25))
    search_value = request.GET.get("search[value]", "").strip().lower()
    order_column = int(request.GET.get("order[0][column]", 0))
    order_dir = request.GET.get("order[0][dir]", "asc")

    sort_fields = ["entity_name", "filename", "size", "modified"]
    sort_field = sort_fields[order_column] if order_column < len(
        sort_fields) else "entity_name"

    rows = _list_wallet_fixture_rows(entity_type)
    records_total = len(rows)

    if search_value:
        rows = [
            r for r in rows
            if search_value in r["entity_name"].lower()
            or search_value in r["filename"].lower()
        ]
    records_filtered = len(rows)

    rows.sort(key=lambda r: r[sort_field], reverse=(order_dir == "desc"))

    if length > 0:
        rows = rows[start:start + length]

    data = []
    for r in rows:
        download_url = reverse(
            "corptools:wallet_fixture_download",
            args=[entity_type, r["entity_path"], r["filename"]],
        )
        download_html = format_html(
            '<a href="{}" class="btn btn-sm btn-outline-secondary">{}</a>',
            download_url, _("Download"),
        )
        data.append([
            r["entity_name"],
            r["filename"],
            filesizeformat(r["size"]),
            r["modified"].strftime("%Y-%m-%d %H:%M"),
            download_html,
        ])

    return JsonResponse({
        "draw": draw,
        "recordsTotal": records_total,
        "recordsFiltered": records_filtered,
        "data": data,
    })


@login_required
def wallet_fixture_download(request, entity_type, entity_path, filename):
    if not request.user.is_superuser:
        raise PermissionDenied

    if entity_type not in ("characters", "corporations"):
        raise Http404

    export_root = _wallet_export_root()
    target = (export_root / "fixtures" / entity_type /
              entity_path / filename).resolve()

    try:
        target.relative_to(export_root.resolve())
    except ValueError:
        raise Http404

    if not target.exists() or not target.is_file():
        raise Http404

    return FileResponse(open(target, "rb"), as_attachment=True, filename=filename)
