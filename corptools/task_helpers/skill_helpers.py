import json
import math
from hashlib import md5

from django.contrib.auth.models import User
from django.core.cache import cache

from allianceauth.authentication.models import CharacterOwnership

SKILL_CACHE_TIMEOUT_SECONDS = 60 * 60 * 48  # 48h
SKILL_CACHE_HEADERS_KEY = "CT_SKILL_HEADER"
SKILL_CACHE_USER_KEY = "SKILL_LISTS_{}"


class SkillListCache():

    def _get_chars_hash(self, characters):
        return md5(",".join(str(x) for x in sorted(characters)).encode()).hexdigest()

    def _build_account_cache_key(self, characters):
        return SKILL_CACHE_USER_KEY.format(self._get_chars_hash(characters))

    def _get_skill_list_hash(self, skills):
        return md5(",".join(str(x) for x in sorted(skills)).encode()).hexdigest()

    def get_and_cache_users(self, users):
        from ..models import SkillList  # TODO fix the recursive import

        linked_characters = CharacterOwnership.objects.filter(user__in=users).values(
            'user_id', 'character__character_name', 'character__character_id')
        skill_lists = SkillList.objects.all().order_by('order_weight', 'name')
        skill_list_hash = self._get_skill_list_hash(
            skill_lists.values_list('name'))
        cached_header = cache.get(SKILL_CACHE_HEADERS_KEY, False)
        skill_lists_up_to_date = cached_header == skill_list_hash

        user_chars = {}
        for u in linked_characters:
            if u['user_id'] not in user_chars:
                user_chars[u['user_id']] = {'chars': []}
            user_chars[u['user_id']]['chars'].append(
                u['character__character_id'])

        for u, c in user_chars.items():
            if skill_lists_up_to_date:
                cache_key = self._build_account_cache_key(c['chars'])
                cached_skills = cache.get(cache_key, False)

                if cached_skills is not False:  # check if cached at all?
                    cached_skills = json.loads(cached_skills)
                    if cached_skills.get("doctrines", False) != skill_list_hash:
                        c['data'] = self.get_and_cache_user(u)
                    else:
                        c['data'] = cached_skills
                else:
                    c['data'] = self.get_and_cache_user(u)
            else:
                c['data'] = self.get_and_cache_user(u)

        return user_chars

    def check_skill_lists(self, skill_lists, linked_characters):
        # build the arrays
        from ..models import (  # TODO fix the recursive import
            EveItemDogmaAttribute, Skill,
        )

        skills = Skill.objects.filter(
            character__character__character_id__in=linked_characters
        ).select_related(
            'skill_name',
            'skill_name__group',
            'character__character'
        ).order_by(
            'skill_name__name'
        )

        skill_tables = {}
        skill_list_base = {}

        for skill in skills:
            char = skill.character.character.character_name
            grp = skill.skill_name.group.name
            if char not in skill_tables:
                skill_tables[char] = {
                    "character_id": skill.character.character.character_id, "omega": True, "skills": {}, "queue": []}

            skill_tables[char]["skills"][skill.skill_name.name] = {
                "grp": grp,
                "sp_total": skill.skillpoints_in_skill,
                "active_level": skill.active_skill_level,
                "trained_level": skill.trained_skill_level,
            }

            if skill.alpha:
                skill_tables[char]["omega"] = False

        all_skill_sp = {}
        for skl in skill_lists:
            _s = skl.get_skills()
            if _s:
                if skl.name not in all_skill_sp:
                    all_skill_sp[skl.name] = {}
                # 250 * skillTimeConstant * sqrt(32)^(skillLevel - 1)
                try:
                    for _sk_n, _sk_l in _s.items():
                        all_skill_sp[skl.name][_sk_n] = int(
                            250 * EveItemDogmaAttribute.objects.get(
                                eve_type__name=_sk_n,
                                attribute_id=275
                            ).value * math.sqrt(32) ** (int(_sk_l) - 1)
                        )
                except Exception as e:
                    print(e)
                    pass

            skill_list_base[skl.name] = _s

        for char in skill_tables:
            skill_tables[char]["doctrines"] = {}
            for d_name, d_list in skill_list_base.items():
                skill_tables[char]["doctrines"][d_name] = {
                    "_meta": {
                        "total_sp": 0,
                        "trained_sp": 0
                    }
                }
                for skill, level in d_list.items():
                    level = int(level)
                    trained_skill = skill_tables[char]["skills"].get(skill, {})
                    skill_tables[char]["doctrines"][d_name]["_meta"]["total_sp"] += all_skill_sp[d_name][skill]
                    if level > trained_skill.get('active_level', 0):
                        skill_tables[char]["doctrines"][d_name][skill] = level
                        if trained_skill.get('trained_level', 0) == trained_skill.get('active_level', 0):
                            skill_tables[char]["doctrines"][d_name]["_meta"]["trained_sp"] += trained_skill.get(
                                'sp_total', 0)
                        if trained_skill.get('active_level', 0) < trained_skill.get('trained_level', 0):
                            skill_tables[char]["doctrines"][d_name]["_meta"]["trained_sp"] += all_skill_sp[d_name][skill]
                    else:
                        skill_tables[char]["doctrines"][d_name]["_meta"]["trained_sp"] += all_skill_sp[d_name][skill]

        # Join them all and ship it.
        return skill_tables

    def get_and_cache_user(self, user_id, force_rebuild=False):
        from ..models import SkillList  # TODO fix the recursive import

        linked_characters = User.objects.get(id=user_id).character_ownerships.all(
        ).values_list('character__character_id', flat=True)
        skill_lists = SkillList.objects.all().order_by('order_weight', 'name')
        skill_list_hash = self._get_skill_list_hash(
            skill_lists.values_list('name'))
        account_key = self._build_account_cache_key(linked_characters)
        cached_header = cache.get(SKILL_CACHE_HEADERS_KEY, False)
        skill_lists_up_to_date = cached_header == skill_list_hash

        if skill_lists_up_to_date and not force_rebuild:
            cached_skills = cache.get(account_key, False)

            if cached_skills is not False:  # check if cached at all?
                cached_skills = json.loads(cached_skills)
                # check what is in cache is valid
                if cached_skills.get("doctrines", False) == skill_list_hash:
                    return cached_skills  # Else build it.

        # build the arrays
        output_array = {"doctrines": skill_list_hash,  # doctrines listed
                        "characters": account_key,  # characters listed
                        "skills_list": None}

        # Join them all and ship it.
        output_array["skills_list"] = self.check_skill_lists(
            skill_lists, linked_characters)

        out = json.dumps(output_array)
        cache.set(account_key, out, SKILL_CACHE_TIMEOUT_SECONDS)
        cache.set(SKILL_CACHE_HEADERS_KEY, skill_list_hash)
        return output_array
