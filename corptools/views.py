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

CHAR_REQUIRED_SCOPES = [
    'esi-calendar.read_calendar_events.v1',
    'esi-characters.read_notifications.v1',
    'esi-universe.read_structures.v1',
    'esi-fittings.read_fittings.v1',
    'esi-mail.read_mail.v1',
    'esi-industry.read_character_jobs.v1',
    'esi-industry.read_character_mining.v1',
    'esi-contracts.read_character_contracts.v1',
    'esi-characters.read_standings.v1',
    'esi-assets.read_assets.v1',
    'esi-clones.read_clones.v1',
    'esi-clones.read_implants.v1',
    'esi-wallet.read_character_wallet.v1',
    'esi-skills.read_skills.v1',
    'esi-location.read_location.v1',
    'esi-location.read_ship_type.v1',
    'esi-markets.read_character_orders.v1',
    'esi-skills.read_skillqueue.v1',
    'esi-characters.read_contacts.v1',
    ]

@login_required
@token_required(scopes=CHAR_REQUIRED_SCOPES)
def add_char(request, token):
    return redirect('corptools:view')


@login_required
def corptools_menu(request):
    # get available models
    return render(request, 'corptools/menu.html', context={})

@login_required
def admin(request):
    # get available models
    names = EveName.objects.all().count()
    types = EveItemType.objects.all().count()
    groups = EveItemGroup.objects.all().count()
    categorys = EveItemCategory.objects.all().count()
    characters = EveItemCategory.objects.all().count()
    corpations = EveItemCategory.objects.all().count()
    type_mets = InvTypeMaterials.objects.count()
    regions = MapRegion.objects.all().count()
    constellations = MapConstellation.objects.all().count()
    systems = MapSystem.objects.all().count()

    context = {
        "names": names,
        "types": types,
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


