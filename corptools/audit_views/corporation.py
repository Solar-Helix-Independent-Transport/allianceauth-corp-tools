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
from django.db.models import Count, F, Max, Q, Sum
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.translation import gettext_lazy as _
from esi.decorators import token_required

from .. import providers
from ..models import *


@login_required
def corp_list(request):

    corps = CorporationAudit.objects.visible_to(request.user)

    context = {
        "corporations": corps,
    }

    return render(request, 'corptools/corp_menu.html', context=context)
