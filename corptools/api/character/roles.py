# Standard Library
from typing import List

# Third Party
from ninja import NinjaAPI

# Django
from django.utils.translation import gettext as _

# AA Example App
from corptools import models
from corptools.api import schema
from corptools.api.helpers import resolve_character


class RolesApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/roles",
            response={200: List[schema.CharacterRoles], 403: str},
            tags=self.tags
        )
        def get_character_roles(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

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
