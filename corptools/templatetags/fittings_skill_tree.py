from django import template

from allianceauth.services.hooks import get_extension_logger

from corptools.models import EveItemDogmaAttribute, EveItemType, SkillList

from ..task_helpers.skill_helpers import SkillListCache

register = template.Library()

logger = get_extension_logger(__name__)


@register.inclusion_tag('corptools/fittings/characters.html', takes_context=True)
def character_skill_overview(context) -> dict:

    from fittings.models import Fitting, FittingItem
    _fit = Fitting.objects.get(
        id=int(context.request.resolver_match.kwargs['fit_id']))
    _items = FittingItem.objects.filter(
        fit=_fit).values_list("type_id", flat=True)

    _skill_ids = [182, 183, 184, 1285, 1289, 1290]
    _level_ids = [277, 278, 279, 1286, 1287, 1288]

    _types = EveItemDogmaAttribute.objects.filter(
        eve_type_id__in=_items, attribute_id__in=_skill_ids + _level_ids)
    _types = _types | EveItemDogmaAttribute.objects.filter(
        eve_type_id=_fit.ship_type_type_id, attribute_id__in=_skill_ids + _level_ids)

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
                        skills[s["skill"]] = {"s": s["skill"], "l": 0, "n": ""}
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
        context.request.user.character_ownerships.all(
        ).order_by(
            "-character__characteraudit__skilltotals__total_sp"
        ).values_list('character__character_id', flat=True)[:15]
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
    for c, d in checks.items():
        del (d["skills"])

    response = {
        "skills": list(sorted(skills.values(), key=lambda item: item["n"])),
        "chars": dict(sorted(checks.items()))
    }
    context["skills"] = response
    return context
