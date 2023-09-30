import logging
from typing import List

from django.db.models import F, Q, Sum
from ninja import NinjaAPI

from corptools import app_settings, models
from corptools.api import schema

logger = logging.getLogger(__name__)


class StatusApiEndpoints:

    tags = ["Corporation"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corp/{corporation_id}/status",
            response={200: schema.CorpStatus, 403: str},
            tags=self.tags
        )
        def get_corporation_status(request, corporation_id: int):
            if not corporation_id:
                corporation_id = request.user.profile.main_character.corporation_id
            corp = models.CorporationAudit.objects.visible_to(
                request.user).filter(corporation__corporation_id=corporation_id)
            if corp.exists():

                c = corp.first()
                _updates = {}
                for grp in app_settings.get_corp_update_attributes():
                    _updates[grp[0]] = getattr(c, grp[1])
                all_id = None
                all_nm = None
                if c.corporation.alliance:
                    all_id = c.corporation.alliance.alliance_id
                    all_nm = c.corporation.alliance.alliance_name

                _out = {"corporation": {"corporation_id": c.corporation.corporation_id,
                                        "corporation_name": c.corporation.corporation_name,
                                        "alliance_id": all_id,
                                        "alliance_name": all_nm},
                        "characters": c.corporation.member_count,
                        "active": True,
                        "last_updates": _updates}
                return 200, _out
            return 403, "Not Found"
