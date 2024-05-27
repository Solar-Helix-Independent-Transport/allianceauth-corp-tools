from typing import List

from ninja import NinjaAPI

from django.db.models import F
from django.utils.translation import gettext as _

from allianceauth.services.hooks import get_extension_logger

from corptools import models
from corptools.api import schema

logger = get_extension_logger(__name__)


class SearchApiEndpoints:

    tags = ["Search"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "/search/system/{search_text}",
            response={200: List[schema.EveName]},
            tags=["Search"]
        )
        def get_system_search(request, search_text: str, limit: int = 10):
            if not request.user.is_superuser:
                return 403, _("Hard no pall!")
            return models.MapSystem.objects.filter(name__icontains=search_text).values("name", id=F("system_id"))[:limit]

        @api.get(
            "/search/location/{search_text}",
            response={200: List[schema.EveName]},
            tags=["Search"]
        )
        def get_location_search(request, search_text: str, limit: int = 10):
            if not request.user.is_superuser:
                return 403, _("Hard no pall!")

            return models.EveLocation.objects.filter(location_name__icontains=search_text).exclude(location_id__lte=0).values(name=F("location_name"), id=F("location_id"))[:limit]

        @api.get(
            "/search/item/group/{search_text}",
            response={200: List[schema.EveName]},
            tags=["Search"]
        )
        def get_group_search(request, search_text: str, limit: int = 10):
            if not request.user.is_superuser:
                return 403, _("Hard no pall!")

            return models.EveItemGroup.objects.filter(name__icontains=search_text).values("name", id=F("group_id"))[:limit]
