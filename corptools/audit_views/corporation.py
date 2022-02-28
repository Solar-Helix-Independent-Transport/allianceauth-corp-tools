import os

from bravado.exception import HTTPError
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required, user_passes_test
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError
from django.db.models import Count, F, Sum, Max, Q
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.translation import gettext_lazy as _
from esi.decorators import token_required
from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo
from django.http import HttpResponse
import csv
import re
import copy

from ..models import *
from .. import providers


@login_required
def corp_list(request):

    corps = CorporationAudit.objects.visible_to(request.user)

    context = {
        "corporations": corps,
    }

    return render(request, 'corptools/corp_menu.html', context=context)
