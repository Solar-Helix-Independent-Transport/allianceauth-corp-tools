from typing import List

from ninja import NinjaAPI

from django.utils.translation import gettext as _

from corptools import models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character


class RolesApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/roles",
            response={200: List[schema.CharacterRoles], 403: str},
            tags=self.tags
        )
        def get_character_roles(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            roles_data = models.CharacterRoles.objects\
                .filter(character__character__in=characters)\
                .select_related('character__character').prefetch_related('titles')

            output = []
            for r in roles_data:
                titles = []
                for t in r.titles.all():
                    titles.append({
                        "id": t.title_id,
                        "name": t.title
                    })
                output.append({
                    "character": r.character.character,
                    "director": r.director,
                    "station_manager": r.station_manager,
                    "personnel_manager": r.personnel_manager,
                    "accountant": r.accountant,
                    "titles": titles
                })
            return output
