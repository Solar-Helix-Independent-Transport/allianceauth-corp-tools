# Standard Library
import math
from typing import List

# Third Party
from eve_sde.models import TypeDogma
from ninja import NinjaAPI

# Django
from django.utils import timezone
from django.utils.translation import gettext as _

# AA Example App
from corptools import models, providers
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character


class SkillApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/{character_id}/skills",
            response={200: List[schema.CharacterSkills], 403: str},
            tags=self.tags
        )
        def get_character_skills(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            skills = models.Skill.objects.filter(character__character__in=characters)\
                .select_related('character__character', 'skill_name', "skill_name__group")

            totals = models.SkillTotals.objects.filter(character__character__in=characters)\
                .select_related('character__character')

            output = {}

            for s in skills:
                if s.character_id not in output:
                    output[s.character_id] = {
                        "character": s.character.character,
                        "skills": [],
                        "total_sp": 0,
                        "unallocated_sp": 0
                    }
                output[s.character_id]["skills"].append(
                    {
                        "group": s.skill_name.group.name,
                        "skill": s.skill_name.name,
                        "sp": s.skillpoints_in_skill,
                        "level": s.trained_skill_level,
                        "active": s.active_skill_level,
                    }
                )

            for t in totals:
                if t.character_id in output:
                    output[t.character_id]["unallocated_sp"] = t.unallocated_sp
                    output[t.character_id]["total_sp"] = t.total_sp

            return list(output.values())

        @api.get(
            "account/{character_id}/skillgraph",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_character_skillgraph(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)
            skills = models.Skill.objects.filter(
                # character__character__character_id=character_id
                character__character__character_id__in=list(
                    characters.order_by(
                        "-characteraudit__skilltotals__total_sp"
                    ).values_list("character_id", flat=True)[:10]
                )
            ).select_related(
                'character__character',
                'skill_name',
                "skill_name__group"
            )

            dogmas_qry = TypeDogma.objects.filter(
                item_type__group__category_id=16,
                dogma_attribute_id=275
            ).select_related("item_type__group")

            character_skills = {}
            skill_dogma = {}

            for d in dogmas_qry:
                sp_5 = 250 * d.value * math.sqrt(32) ** 4
                skill_dogma[d.item_type.name] = sp_5
                if d.item_type.group.name not in character_skills:
                    character_skills[d.item_type.group.name] = {
                        "group": d.item_type.group.name,
                        "char_total": 0,
                        "total": 0
                    }
                character_skills[d.item_type.group.name]["total"] += sp_5

            character_names = set()

            for s in skills:
                character_names.add(s.character.character.character_name)

                if s.character.character.character_name not in character_skills[s.skill_name.group.name]:
                    character_skills[s.skill_name.group.name][s.character.character.character_name] = 0

                if s.skillpoints_in_skill > 0:
                    ratio = skill_dogma[s.skill_name.name] / \
                        character_skills[s.skill_name.group.name]["total"]
                    value = (s.skillpoints_in_skill /
                             skill_dogma[s.skill_name.name] * 100)

                    character_skills[s.skill_name.group.name][s.character.character.character_name] += value * ratio
                    character_skills[s.skill_name.group.name]["char_total"] += s.skillpoints_in_skill

            output = []
            for k, d in dict(sorted(character_skills.items())).items():
                for c in character_names:
                    if c not in d:
                        d[c] = 0
                    d[c] = round(d[c])
                output.append(d)

            return {"characters": list(character_names), "data": output}

        @api.get(
            "account/{character_id}/skill/history",
            response={200: List[schema.CharacterSkillHistory], 403: str},
            tags=self.tags
        )
        def get_character_skill_history(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            skill_history = models.SkillTotalHistory.objects.filter(character__character__in=characters)\
                .select_related('character__character').order_by("date")

            output = {}

            for s in skill_history:
                if s.character_id not in output:
                    output[s.character_id] = {
                        "character": s.character.character,
                        "history": [],
                    }
                output[s.character_id]["history"].append(
                    {
                        "date": s.date,
                        "sp": s.sp,
                        "total_sp": s.total_sp,
                        "unallocated_sp": s.unallocated_sp,
                    }
                )

            return list(output.values())

        @api.get(
            "account/{character_id}/skillqueues",
            response={200: List[schema.CharacterQueue], 403: str},
            tags=self.tags
        )
        def get_character_skillqueues(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            now = timezone.now()

            skills = models.SkillQueue.objects.filter(
                character__character__in=characters,
            ).select_related(
                "character__character",
                "skill_name",
                "skill_name__group"
            )

            skill_totals = models.Skill.objects.filter(
                character__character__in=characters
            ).select_related(
                "character__character",
                "skill_name",
                "skill_name__group"
            )

            skl_ttl = {}

            for s in skill_totals:
                if s.character_id not in skl_ttl:
                    skl_ttl[s.character_id] = {}
                skl_ttl[s.character_id][s.skill_name.name] = s.trained_skill_level

            output = {}
            for c in characters:
                output[c.character_id] = {
                    "character": c,
                    "queue": [],
                }

            for s in skills:
                if s.character.character.character_id not in output:
                    output[s.character.character.character_id] = {
                        "character": s.character.character,
                        "queue": [],
                    }

                if s.finish_date:
                    if s.finish_date < now:
                        continue

                output[s.character.character.character_id]["queue"].append(
                    {
                        "position": s.queue_position,
                        "group": s.skill_name.group.name,
                        "skill": s.skill_name.name,
                        "end_level": s.finish_level,
                        "start_sp": s.level_start_sp,
                        "end_sp": s.level_end_sp,
                        "start": s.start_date,
                        "end": s.finish_date,
                        "current_level": skl_ttl.get(
                            s.character.character_id,
                            {}
                        ).get(
                            s.skill_name.name,
                            0
                        )
                    }
                )

            return list(output.values())

        @api.get(
            "account/{character_id}/doctrines",
            response={200: List[schema.CharacterDoctrines], 403: str},
            tags=self.tags
        )
        def get_character_doctrines(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            skilllists = providers.skills.get_and_cache_user(
                main.character_ownership.user_id)
            visibles = list(models.SkillList.objects.filter(
                show_on_audit=True).values_list("name", flat=True))
            output = {}
            for c in characters:
                output[c.character_id] = {
                    "character": c,
                    "doctrines": {},
                    "skills": {},
                }

            for k, s in skilllists['skills_list'].items():
                for k, d in s["doctrines"].items():
                    # filter out hidden items
                    if k in visibles:
                        output[s['character_id']]["doctrines"][k] = d
                output[s['character_id']]["skills"] = s["skills"]

            return list(output.values())
