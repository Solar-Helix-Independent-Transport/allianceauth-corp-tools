from typing import List

from ninja import NinjaAPI

from django.utils.translation import gettext as _

from corptools import models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character


class CloneApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/{character_id}/clones",
            response={200: List[schema.CharacterClones], 403: str},
            tags=self.tags
        )
        def get_character_clones(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            jump_clones = models.JumpClone.objects\
                .filter(character__character__in=characters)\
                .select_related('character__character', 'location_name').prefetch_related('implant_set', 'implant_set__type_name')
            clones = models.Clone.objects\
                .filter(character__character__in=characters)\
                .select_related('character__character', 'location_name')

            table_data = {}
            for char in characters:
                table_data[char.character_name] = {
                    "character": char,
                    "clones": [],
                    "home": None,
                    "last_station_change": None,
                    "last_clone_jump": None
                }

            for j in jump_clones:
                implants = []
                for i in j.implant_set.all():
                    implants.append({
                        "id": i.type_name_id,
                        "name": i.type_name.name
                    })
                loc = None
                if j.location_id:
                    loc = {"id": j.location_id,
                           "name": f"Location ID {j.location_id}"}

                    if j.location_name:
                        loc["name"] = j.location_name.location_name

                table_data[j.character.character.character_name]["clones"].append({
                    "name": j.name,
                    "location": loc,
                    "implants": implants
                }
                )

            for c in clones:
                loc = {"id": c.location_id,
                       "name": f"ID#{c.location_id}"}

                if c.location_name:
                    loc["name"] = c.location_name.location_name

                table_data[c.character.character.character_name]["home"] = loc
                table_data[c.character.character.character_name]["last_station_change"] = c.last_station_change_date
                table_data[c.character.character.character_name]["last_clone_jump"] = c.last_clone_jump_date

            return list(table_data.values())
