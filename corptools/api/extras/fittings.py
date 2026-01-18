from ninja import NinjaAPI

from corptools.api.helpers import get_alts_queryset, get_main_character
from corptools.models.eve_models import EveItemDogmaAttribute, EveItemType
from corptools.models.skills import SkillList
from corptools.task_helpers.skill_helpers import SkillListCache

from ... import models


class FittingsApiEndpoints:
    tags = ["Extras"]

    def parse_eft_to_items(self, input: str):
        items = []
        for line in input.splitlines():
            _l = line.strip()
            if not len(_l):
                continue
            if _l.startswith("[") and _l.endswith("]"):
                # Header block
                if "," in _l:
                    _p = _l[1:-1].split(",")
                    items.append(_p[0].strip())
            else:
                _q = _l.split()[-1]
                if _q.startswith("x"):
                    # has a qty ignore and add the item
                    if "," in _l.split(_q)[0]:
                        # ammo in gun?
                        _i = _l.split(_q).split(",")
                        for i in _i:
                            items.append(i.strip())
                    else:
                        # any item in cargo etc
                        items.append(_l.split(_q)[0].strip())
                else:
                    if "," in _l:
                        _i = _l.split(",")
                        for i in _i:
                            items.append(i.strip())
                    else:
                        items.append(_l.strip())
        return items

    def __init__(self, api: NinjaAPI):
        @api.get(
            "/extras/fit2skills/{fit_id}",
            response={200: dict, 403: str, 404: str, 500: str},
            tags=["Fittings"]
        )
        def get_fit_skills(request, fit_id: str):
            """
                Turn a Fitting into a skill list json.
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}
            try:
                from fittings.models import Fitting, FittingItem
            except ImportError:
                return 500, "Fittings module not found!"
            try:
                _fit = Fitting.objects.get(
                    id=int(request.resolver_match.kwargs['fit_id']))
            except Fitting.DoesNotExist:
                return 404, "Fitting not found"
            _items = FittingItem.objects.filter(
                fit=_fit).values_list("type_id", flat=True)

            _skill_ids = [182, 183, 184, 1285, 1289, 1290]
            _level_ids = [277, 278, 279, 1286, 1287, 1288]

            _types = models.EveItemDogmaAttribute.objects.filter(
                eve_type_id__in=_items, attribute_id__in=_skill_ids + _level_ids)
            _types = _types | models.EveItemDogmaAttribute.objects.filter(
                eve_type_id=_fit.ship_type_type_id, attribute_id__in=_skill_ids + _level_ids)

            required = {}
            skills = {}
            skill_ids = set()
            for t in _types:
                if t.eve_type_id not in required:
                    required[t.eve_type_id] = {0: {"skill": 0, "level": 0},
                                               1: {"skill": 0, "level": 0},
                                               2: {"skill": 0, "level": 0},
                                               3: {"skill": 0, "level": 0},
                                               4: {"skill": 0, "level": 0},
                                               5: {"skill": 0, "level": 0}}
                a = t.attribute_id
                v = t.value
                if a in _skill_ids:
                    required[t.eve_type_id][_skill_ids.index(a)]["skill"] = v
                elif a in _level_ids:
                    indx = _level_ids.index(a)
                    if required[t.eve_type_id][indx]["level"] < v:
                        required[t.eve_type_id][indx]["level"] = v

                for t in required.values():
                    for s in t.values():
                        if s["skill"]:
                            if s["skill"] not in skills:
                                skills[s["skill"]] = {"skill": "", "level": 0}
                                skill_ids.add(s["skill"])
                            if s["level"] > skills[s["skill"]]["level"]:
                                skills[s["skill"]]["level"] = s["level"]
                out = {}
                for t in models.EveItemType.objects.filter(type_id__in=list(skill_ids)):
                    out[t.name] = skills[t.type_id]['level']

            return {
                "Fitting": _fit.name,
                "skill_list": out
            }

        @api.post(
            "/extras/fitting2skills/{character_id}",
            response={200: dict, 403: str, 404: str, 500: str},
            tags=["Fittings"],
            openapi_extra={
                "requestBody": {
                    "content": {
                        "text/plain": {
                            "schema": {
                                "type": "str",
                            }
                        }
                    },
                    "required": True,
                }
            },
        )
        def get_fitting_skills(request, character_id: int):
            """
                Turn a Fitting into a skill list and check characters on account.
            """
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)
            if not response:
                return 403, _("Permission Denied")
            characters = get_alts_queryset(main)

            _in = str(request.body.decode())
            items = self.parse_eft_to_items(_in)
            _items = EveItemType.objects.filter(name__in=items)

            _skill_ids = [182, 183, 184, 1285, 1289, 1290]
            _level_ids = [277, 278, 279, 1286, 1287, 1288]

            _types = EveItemDogmaAttribute.objects.filter(
                eve_type_id__in=_items, attribute_id__in=_skill_ids + _level_ids)

            required = {}
            skills = {}
            sids = set()
            for t in _types:
                if t.eve_type_id not in required:
                    required[t.eve_type_id] = {0: {"skill": 0, "level": 0},
                                               1: {"skill": 0, "level": 0},
                                               2: {"skill": 0, "level": 0},
                                               3: {"skill": 0, "level": 0},
                                               4: {"skill": 0, "level": 0},
                                               5: {"skill": 0, "level": 0}}
                a = t.attribute_id
                v = t.value
                if a in _skill_ids:
                    required[t.eve_type_id][_skill_ids.index(a)]["skill"] = v
                elif a in _level_ids:
                    indx = _level_ids.index(a)
                    if required[t.eve_type_id][indx]["level"] < v:
                        required[t.eve_type_id][indx]["level"] = v

                for t in required.values():
                    for s in t.values():
                        if s["skill"]:
                            if s["skill"] not in skills:
                                skills[s["skill"]] = {
                                    "s": s["skill"], "l": 0, "n": ""}
                                sids.add(s["skill"])
                            if s["level"] > skills[s["skill"]]["l"]:
                                skills[s["skill"]]["l"] = s["level"]
            sk_check = {

            }
            for t in EveItemType.objects.filter(type_id__in=list(sids)):
                skills[t.type_id]["n"] = t.name
                sk_check[t.name] = skills[t.type_id]["l"]

            import json
            char_ids = list(
                characters.values_list('character_id', flat=True)
            )
            checks = SkillListCache().check_skill_lists(
                [
                    SkillList(
                        name="fit",
                        skill_list=json.dumps(sk_check)
                    )
                ],
                char_ids
            )
            # for c, d in checks.items():
            #     del (d["skills"])

            _resp = {
                "skills": list(sorted(skills.values(), key=lambda item: item["n"])),
                "chars": dict(sorted(checks.items()))
            }
            return _resp

        @api.get(
            "/extras/dogma/{type_id}",
            response={200: dict, 403: str, 404: str, 500: str},
            tags=["Fittings"]
        )
        def get_dogma(request, type_id: str):
            """
                Load dogma for a type_id.
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}

            _types = models.EveItemDogmaAttribute.objects.filter(
                eve_type_id=type_id)

            dogma = {}
            for t in _types:
                dogma[t.attribute_id] = t.value
            return dogma
