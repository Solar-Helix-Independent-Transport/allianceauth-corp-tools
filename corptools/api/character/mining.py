from datetime import timedelta
from typing import List, Optional

from django.utils import timezone
from ninja import NinjaAPI

from corptools import models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character


class MiningApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/mining/chars",
            response={200: dict, 403: str},
            tags=["Account"]
        )
        def get_all_characters_character_mining(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, "Permission Denied"

            characters = get_alts_queryset(main)

            return characters

        @api.get(
            "account/{character_id}/mining",
            response={200: dict, 403: str},
            tags=["Account"]
        )
        def get_character_mining(request,
                                 character_id: int,
                                 filter_characters: Optional[List[int]] = [],
                                 look_back: Optional[int] = 90):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, "Permission Denied"

            characters = get_alts_queryset(main)

            if len(filter_characters):
                characters = characters.exclude(
                    character_id__in=filter_characters)

            start_date = timezone.now() - timedelta(days=look_back)

            mining_ledger_data = models.CharacterMiningLedger.objects.filter(
                character__character__in=characters,
                date__gte=start_date
            ).select_related(
                'character__character',
                'type_name',
                'type_name__group'
            )

            all_ores = set()
            all_groups = set()
            all_systems = set()
            t_val = 0
            t_vol = 0
            output = {}
            for t in [(timezone.now() - timedelta(days=i)).date() for i in range(look_back+1)]:
                output[str(t)] = {
                    "date": str(t),
                    "ores": {},
                    "characters": [],
                    "systems": [],
                }

            for w in mining_ledger_data:
                _d = str(w.date)

                all_ores.add(w.type_name.name)
                all_groups.add(w.type_name.group.name)
                all_systems.add(w.system.name)
                vol = w.quantity*w.type_name.volume
                t_vol += vol

                if w.type_name.type_id not in output[_d]["ores"]:
                    output[_d]["ores"][w.type_name.type_id] = {
                        "name": w.type_name.name,
                        "group": w.type_name.group.name,
                        "id": w.type_name.type_id,
                        "volume": 0,
                        "value": 0
                    }
                output[_d]["ores"][w.type_name.type_id]["volume"] += vol

                if w.character.character.character_name not in output[_d]["characters"]:
                    output[_d]["characters"].append(
                        w.character.character.character_name)

                if w.system.name not in output[_d]["systems"]:
                    output[_d]["systems"].append(w.system.name)

            for k, d in output.items():
                d["ores"] = list(d["ores"].values())

            return {
                "all_ores": list(all_ores),
                "all_groups": list(all_groups),
                "all_systems": list(all_systems),
                "total_volume": t_vol,
                "total_value": t_val,
                "data": list(output.values())
            }
