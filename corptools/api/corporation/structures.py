import logging
from typing import List

from ninja import NinjaAPI

from corptools import models
from corptools.api import schema
from corptools.api.helpers import round_or_null

logger = logging.getLogger(__name__)


class StructureApiEndpoints:

    tags = ["Structures"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corp/structures",
            response={200: List[schema.Structure], 403: str},
            tags=self.tags
        )
        def get_visible_structures(request):
            perms = (
                request.user.has_perm('corptools.own_corp_manager') |
                request.user.has_perm('corptools.alliance_corp_manager') |
                request.user.has_perm('corptools.state_corp_manager') |
                request.user.has_perm('corptools.global_corp_manager') |
                request.user.has_perm('corptools.holding_corp_structures')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view structures!")
                return 403, "Permission Denied!"

            output = []
            for s in models.Structure.get_visible(request.user).select_related(
                'type_name', "corporation__corporation", "system_name"
            ).prefetch_related('structureservice_set'):
                _ss = list()
                for __s in s.structureservice_set.all():
                    _ss.append({
                        "name": __s.name,
                        "state": __s.state
                    })
                _s = {
                    "id": s.structure_id,
                    "owner": s.corporation.corporation,
                    "name": s.name,
                    "type": {"id": s.type_id,
                             "name": s.type_name.name},
                    "services": _ss,
                    "location": {"id": s.system_name.system_id,
                                 "name": s.system_name.name},
                    "fuel_expiry": s.fuel_expires,
                    "state": s.state,
                    "state_expiry": s.state_timer_end
                }
                output.append(_s)
            return list(output)

        @api.get(
            "corp/structures/{structure_id}",
            response={200: List[schema.FittingItem], 404: str, 403: str},
            tags=self.tags
        )
        def get_corporation_structure_fitting(request, corporation_id, structure_id):
            output = []
            return 200, output

        @api.get(
            "corp/pocos",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_visible_pocos(request):
            perms = (
                request.user.has_perm('corptools.own_corp_manager') |
                request.user.has_perm('corptools.alliance_corp_manager') |
                request.user.has_perm('corptools.state_corp_manager') |
                request.user.has_perm('corptools.global_corp_manager') |
                request.user.has_perm('corptools.holding_corp_structures')
            )

            if not perms:
                logging.error(
                    f"Permission Denied for {request.user} to view pocos!")
                return 403, "Permission Denied!"

            output = []
            for s in models.Poco.get_visible(request.user).select_related(
                "corporation__corporation", "system_name", "system_name__constellation", "system_name__constellation__region", "planet"
            ):
                _s = {
                    "id": s.office_id,
                    "owner": {
                        "corporation_name": s.corporation.corporation.corporation_name,
                        "corporation_id": s.corporation.corporation.corporation_id
                    },
                    "name": s.name,
                    "location": {"id": s.planet.planet_id,
                                 "name": s.planet.name,
                                 "region": s.system_name.constellation.region.name,
                                 "constellation": s.system_name.constellation.name},
                    "standing_level": s.standing_level,
                    "alliance_tax_rate": round_or_null(s.alliance_tax_rate),
                    "corporation_tax_rate": round_or_null(s.corporation_tax_rate),
                    "terrible_standing_tax_rate": round_or_null(s.terrible_standing_tax_rate),
                    "bad_standing_tax_rate": round_or_null(s.bad_standing_tax_rate),
                    "neutral_standing_tax_rate": round_or_null(s.neutral_standing_tax_rate),
                    "good_standing_tax_rate": round_or_null(s.good_standing_tax_rate),
                    "excellent_standing_tax_rate": round_or_null(s.excellent_standing_tax_rate),
                    "reinforce_exit_end": s.reinforce_exit_end,
                    "reinforce_exit_start": s.reinforce_exit_start,
                    "allow_access_with_standings": s.allow_access_with_standings,
                    "allow_alliance_access": s.allow_alliance_access,
                }
                output.append(_s)
            return list(output)
