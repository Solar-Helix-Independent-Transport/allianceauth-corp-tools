# Standard Library
from typing import List

# Third Party
from ninja import NinjaAPI

# AA Example App
from corptools import models
from corptools.api import schema
from corptools.api.helpers import resolve_character


class MercenaryDenApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/{character_id}/mercenarydens",
            response={200: List[schema.CharacterMercenaryDen], 403: str},
            tags=self.tags
        )
        def get_character_mercenary_dens(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            dens = models.CharacterMercenaryDen.objects.filter(
                character__character__in=characters
            ).select_related(
                'character__character',
                'planet_name',
                'type_name'
            )

            output = []
            for d in dens:
                output.append({
                    "character": d.character.character,
                    "den_id": d.den_id,
                    "planet": {
                        "id": d.planet_id,
                        "name": d.planet_name.name if d.planet_name else f"Planet ID {d.planet_id}"
                    },
                    "type": {
                        "id": d.type_id,
                        "name": d.type_name.name if d.type_name else f"Type ID {d.type_id}"
                    },
                    "state": d.state,
                    "development_amount": d.development_amount,
                    "development_level": d.development_level,
                    "anarchy_amount": d.anarchy_amount,
                    "anarchy_level": d.anarchy_level,
                    "infomorph_amount": d.infomorph_amount,
                    "reinforcement_end": d.reinforcement_end,
                })

            return output
