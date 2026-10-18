# Standard Library
import json
import math
from hashlib import md5

# Third Party
from eve_sde.models import TypeDogma

# Django
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

# Keep `IN (...)` lists under DB parameter limits when building many accounts.
_CHARACTER_CHUNK = 1000


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

    def _build_accounts(self, accounts, skill_lists, skill_list_hash):
        """Build and cache several accounts at once ({key: [character_ids]}),
        reading every account's skills in one pass instead of per account."""
        tables = self._load_skill_tables(
            {c for chars in accounts.values() for c in chars})
        requirements = self._doctrine_requirements(skill_lists)
        built = {}
        for key, characters in accounts.items():
            account_key = self._build_account_cache_key(characters)
            mine = set(characters)
            ordered = [c for c in tables if c in mine]
            built[key] = {"doctrines": skill_list_hash,  # doctrines listed
                          "characters": account_key,  # characters listed
                          "skills_list": self._skill_tables_for(
                              ordered, tables, requirements)}
        cache.set_many(
            {v["characters"]: json.dumps(v) for v in built.values()},
            SKILL_CACHE_TIMEOUT_SECONDS
        )
        return built

    def _build_and_cache(self, characters, skill_lists, skill_list_hash):
        return self._build_accounts(
            {None: characters}, skill_lists, skill_list_hash)[None]

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

        missing = {}
        for u, c in user_chars.items():
            account_key = self._build_account_cache_key(c['chars'])
            c['data'] = self._get_cached(account_key, skill_list_hash)
            if c['data'] is None:
                missing[u] = c['chars']

        if missing:
            for u, data in self._build_accounts(
                    missing, skill_lists, skill_list_hash).items():
                user_chars[u]['data'] = data

        return user_chars

    def _load_skill_tables(self, character_ids):
        """Per character {character_id: table} of trained skills and the
        highest queued level per skill. Reads plain values rather than model
        instances - building ~5 objects per skill row (with select_related)
        was nearly all of the cost of a rebuild."""
        from ..models import Skill, SkillQueue

        character_ids = list(character_ids)
        tables = {}
        for i in range(0, len(character_ids), _CHARACTER_CHUNK):
            chunk = character_ids[i:i + _CHARACTER_CHUNK]
            for (char_id, char_name, skill, grp, sp, active, trained) in Skill.objects.filter(
                character__character__character_id__in=chunk
            ).order_by(
                'skill_name__name'
            ).values_list(
                'character__character__character_id',
                'character__character__character_name',
                'skill_name__name_en',
                'skill_name__group__name_en',
                'skillpoints_in_skill',
                'active_skill_level',
                'trained_skill_level',
            ):
                if char_id not in tables:
                    tables[char_id] = {
                        "name": char_name,
                        "character_id": char_id,
                        "omega": True,
                        "skills": {},
                        "queue": {}
                    }
                tables[char_id]["skills"][skill] = {
                    "grp": grp,
                    "sp_total": sp,
                    "active_level": active,
                    "trained_level": trained,
                }
                if trained != active:  # Skill.alpha
                    tables[char_id]["omega"] = False

            # Highest queued finish_level per skill, per character - a skill can
            # appear multiple times in the queue for successive levels, and the
            # doctrine check only cares about where the queue will leave it.
            for char_id, skill, finish_level in SkillQueue.objects.filter(
                character__character__character_id__in=chunk,
                skill_name__isnull=False,
            ).values_list(
                'character__character__character_id',
                'skill_name__name_en',
                'finish_level',
            ):
                if char_id not in tables:
                    continue  # no trained skills at all - nothing to check against
                queue = tables[char_id]["queue"]
                queue[skill] = max(queue.get(skill, 0), finish_level)
        return tables

    def _doctrine_requirements(self, skill_lists):
        """[(doctrine, total_sp, [(skill, level, sp for that level)])] - worked
        out once per build, not once per character."""
        all_skill_sp = {}
        skill_list_base = {}
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

        requirements = []
        for d_name, d_list in skill_list_base.items():
            sps = all_skill_sp.get(d_name, {})
            skills = [
                (skill, int(level), sps.get(skill, 0))
                for skill, level in (d_list or {}).items()
            ]
            requirements.append(
                (d_name, sum(sp for _, _, sp in skills), skills))
        return requirements

    def _apply_doctrines(self, table, requirements):
        """The doctrine results for one character's skill table.

        Per required skill at `level` (worth `sp` at that level):
        - usable at or above `level`: counts `sp` as trained.
        - below it: listed as missing, and counts what is trained so far -
          `sp` if alpha-limited but trained higher, else the skill's own SP.
        """
        # (active, trained, sp_total) per skill, looked up once
        levels = {
            name: (s["active_level"], s["trained_level"], s["sp_total"])
            for name, s in table["skills"].items()
        }
        untrained = (0, 0, 0)
        doctrines = {}
        for d_name, total_sp, skills in requirements:
            meta = {"total_sp": total_sp, "trained_sp": 0}
            result = {"_meta": meta}  # first, as before
            trained_sp = 0
            for skill, level, sp in skills:
                active, trained, sp_total = levels.get(skill, untrained)
                if level > active:
                    result[skill] = level
                    if trained == active:
                        trained_sp += sp_total
                    elif active < trained:
                        trained_sp += sp
                else:
                    trained_sp += sp
            meta["trained_sp"] = trained_sp
            doctrines[d_name] = result
        return doctrines

    def _skill_tables_for(self, character_ids, tables, requirements):
        """{character_name: table with doctrines} for one account."""
        skill_tables = {}
        for char_id in character_ids:
            table = tables.get(char_id)
            if table is None:
                continue
            skill_tables[table["name"]] = {
                "character_id": table["character_id"],
                "omega": table["omega"],
                "skills": table["skills"],
                "queue": table["queue"],
                "doctrines": self._apply_doctrines(table, requirements),
            }
        return skill_tables

    def check_skill_lists(self, skill_lists, linked_characters):
        tables = self._load_skill_tables(linked_characters)
        return self._skill_tables_for(
            list(tables),  # characters in the order their skills were read
            tables,
            self._doctrine_requirements(skill_lists),
        )

    def get_and_cache_user(self, user_id, force_rebuild=False):
        linked_characters = list(
            CharacterOwnership.objects.filter(
                user_id=user_id
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
