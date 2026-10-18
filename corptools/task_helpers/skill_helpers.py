# Standard Library
import json
import math
from hashlib import md5

# Third Party
from eve_sde.models import TypeDogma

# Django
from django.contrib.auth.models import User
from django.core.cache import cache

# Alliance Auth
from allianceauth.authentication.models import CharacterOwnership
from allianceauth.services.hooks import get_extension_logger

logger = get_extension_logger(__name__)

# Dogma attribute holding a skill's training time multiplier
SKILL_TIME_CONSTANT_ATTRIBUTE_ID = 275

SKILL_CACHE_TIMEOUT_SECONDS = 60 * 60 * 24 * 7  # 7 days
# Bump the "_v2" suffix whenever the cached data shape changes (e.g. the
# "queue" list->dict change) so stale entries in the old shape are orphaned
# instead of being served to a schema that no longer matches them.
#
# An entry is keyed by the account's characters and stores the hash of the
# doctrines it was built against, so it goes stale by itself when either
# changes. Skill changes are handled by cache_user_skill_list rebuilding
# after a character's skills are refetched.
SKILL_CACHE_USER_KEY = "SKILL_LISTS_v2_{}"


class SkillListCache():

    def _get_chars_hash(self, characters):
        return md5(",".join(str(x) for x in sorted(characters)).encode()).hexdigest()

    def _build_account_cache_key(self, characters):
        return SKILL_CACHE_USER_KEY.format(self._get_chars_hash(characters))

    def _get_skill_lists(self):
        from ..models import SkillList  # TODO fix the recursive import
        return list(SkillList.objects.all().order_by('order_weight', 'name'))

    def _get_skill_list_hash(self, skill_lists):
        """Hash of everything about the doctrines that feeds the cached
        result - the skills too, not just the names, so editing a doctrine's
        skills invalidates every entry built against the old version."""
        return md5(
            json.dumps(sorted(
                [skl.name or "", skl.skill_list or ""] for skl in skill_lists
            )).encode()
        ).hexdigest()

    def _get_cached(self, account_key, skill_list_hash):
        """The cached entry for an account if it was built against the
        current doctrines, else None. A hit gets its TTL refreshed."""
        cached_skills = cache.get(account_key, False)
        if cached_skills is False:
            return None
        cached_skills = json.loads(cached_skills)
        if cached_skills.get("doctrines", False) != skill_list_hash:
            return None
        cache.touch(account_key, SKILL_CACHE_TIMEOUT_SECONDS)
        return cached_skills

    def _build_and_cache(self, characters, skill_lists, skill_list_hash):
        account_key = self._build_account_cache_key(characters)
        output_array = {"doctrines": skill_list_hash,  # doctrines listed
                        "characters": account_key,  # characters listed
                        "skills_list": self.check_skill_lists(
                            skill_lists,
                            characters
                        )}
        cache.set(account_key, json.dumps(output_array),
                  SKILL_CACHE_TIMEOUT_SECONDS)
        return output_array

    def get_and_cache_users(self, users):
        linked_characters = CharacterOwnership.objects.filter(user__in=users).values(
            'user_id', 'character__character_name', 'character__character_id')
        skill_lists = self._get_skill_lists()
        skill_list_hash = self._get_skill_list_hash(skill_lists)

        user_chars = {}
        for u in linked_characters:
            if u['user_id'] not in user_chars:
                user_chars[u['user_id']] = {'chars': []}
            user_chars[u['user_id']]['chars'].append(
                u['character__character_id'])

        for u, c in user_chars.items():
            account_key = self._build_account_cache_key(c['chars'])
            c['data'] = self._get_cached(account_key, skill_list_hash)
            if c['data'] is None:
                c['data'] = self._build_and_cache(
                    c['chars'], skill_lists, skill_list_hash)

        return user_chars

    def check_skill_lists(self, skill_lists, linked_characters):
        # build the arrays
        from ..models import Skill, SkillQueue

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
            grp = skill.skill_name.group.name_en
            if char not in skill_tables:
                skill_tables[char] = {
                    "character_id": skill.character.character.character_id,
                    "omega": True,
                    "skills": {},
                    "queue": {}
                }

            skill_tables[char]["skills"][skill.skill_name.name_en] = {
                "grp": grp,
                "sp_total": skill.skillpoints_in_skill,
                "active_level": skill.active_skill_level,
                "trained_level": skill.trained_skill_level,
            }

            if skill.alpha:
                skill_tables[char]["omega"] = False

        # Highest queued finish_level per skill, per character - a skill can
        # appear multiple times in the queue for successive levels, and the
        # doctrine check only cares about where the queue will leave it.
        queue_entries = SkillQueue.objects.filter(
            character__character__character_id__in=linked_characters,
            skill_name__isnull=False,
        ).select_related('skill_name', 'character__character')

        for entry in queue_entries:
            char = entry.character.character.character_name
            if char not in skill_tables:
                continue  # no trained skills at all - nothing to check against
            skill_name = entry.skill_name.name_en
            current = skill_tables[char]["queue"].get(skill_name, 0)
            skill_tables[char]["queue"][skill_name] = max(
                current, entry.finish_level)

        all_skill_sp = {}
        lists_skills = [(skl, skl.get_skills()) for skl in skill_lists]

        # One query for every skill's time constant, rather than one per
        # skill per doctrine on every cache rebuild.
        skill_names = {
            name for _, _s in lists_skills if _s for name in _s
        }
        time_constants = dict(
            TypeDogma.objects.filter(
                item_type__name__in=skill_names,
                dogma_attribute_id=SKILL_TIME_CONSTANT_ATTRIBUTE_ID
            ).values_list("item_type__name", "value")
        )

        for skl, _s in lists_skills:
            if _s:
                if skl.name not in all_skill_sp:
                    all_skill_sp[skl.name] = {}
                # 250 * skillTimeConstant * sqrt(32)^(skillLevel - 1)
                for _sk_n, _sk_l in _s.items():
                    time_constant = time_constants.get(_sk_n)
                    if time_constant is None:
                        # unknown to the SDE - counts as 0 SP below
                        logger.debug(f"No skill time constant for {_sk_n}")
                        continue
                    try:
                        all_skill_sp[skl.name][_sk_n] = int(
                            250 * time_constant *
                            math.sqrt(32) ** (int(_sk_l) - 1)
                        )
                    except (TypeError, ValueError) as e:
                        logger.debug(
                            f"Bad skill level {_sk_l} for {_sk_n}: {e}")

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
                    skill_sp = all_skill_sp[d_name].get(skill, 0)
                    skill_tables[char]["doctrines"][d_name]["_meta"]["total_sp"] += skill_sp
                    if level > trained_skill.get('active_level', 0):
                        skill_tables[char]["doctrines"][d_name][skill] = level
                        if trained_skill.get('trained_level', 0) == trained_skill.get('active_level', 0):
                            skill_tables[char]["doctrines"][d_name]["_meta"]["trained_sp"] += trained_skill.get(
                                'sp_total', 0)
                        if trained_skill.get('active_level', 0) < trained_skill.get('trained_level', 0):
                            skill_tables[char]["doctrines"][d_name]["_meta"]["trained_sp"] += skill_sp
                    else:
                        skill_tables[char]["doctrines"][d_name]["_meta"]["trained_sp"] += skill_sp

        # Join them all and ship it.
        return skill_tables

    def get_and_cache_user(self, user_id, force_rebuild=False):
        linked_characters = list(
            User.objects.get(
                id=user_id
            ).character_ownerships.all(
            ).values_list(
                'character__character_id',
                flat=True
            )
        )

        skill_lists = self._get_skill_lists()
        skill_list_hash = self._get_skill_list_hash(skill_lists)

        if not force_rebuild:
            cached_skills = self._get_cached(
                self._build_account_cache_key(linked_characters),
                skill_list_hash
            )
            if cached_skills is not None:
                return cached_skills

        return self._build_and_cache(
            linked_characters, skill_lists, skill_list_hash)
