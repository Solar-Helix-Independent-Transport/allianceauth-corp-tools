from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from ..models import CorporationAudit


@login_required
def corp_list(request):

    corps = CorporationAudit.objects.visible_to(request.user)

    context = {
        "corporations": corps,
    }

    return render(request, 'corptools/corp_menu.html', context=context)
