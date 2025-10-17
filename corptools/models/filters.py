import datetime
import logging
from collections import defaultdict

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models import F, Max, Min
from django.utils import timezone
from django.utils.formats import localize
from django.utils.translation import gettext_lazy as _, ngettext_lazy

from allianceauth.authentication.models import CharacterOwnership
from allianceauth.eveonline.models import EveAllianceInfo, EveCorporationInfo

from .. import app_settings, providers
from .assets import CharacterAsset
from .audits import CharacterLocation, EveLocation
from .clones import Clone, JumpClone
from .eve_models import (
    EveItemCategory, EveItemGroup, EveItemType, MapConstellation, MapRegion,
    MapSystem,
)
from .interactions import CharacterTitle, CorporationHistory
from .skills import SkillList, SkillTotals

logger = logging.getLogger(__name__)


class FilterBase(models.Model):

    name = models.CharField(max_length=500)
    description = models.CharField(max_length=500)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}: {self.description}"

    def process_filter(self, user: User):
        raise NotImplementedError("Please Create a filter!")


class FullyLoadedFilter(FilterBase):
    reversed_logic = models.BooleanField(
        default=False, help_text="If set all members WITHOUT audit fully loaded will pass the test.")
    count_message_only = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Smart Filter: Audit Fully Loaded"
        verbose_name_plural = verbose_name

    def process_filter(self, user: User):
        logic = self.reversed_logic
        try:
            character_list = user.character_ownerships.all() \
                .select_related('character', 'character__characteraudit')

            character_count = character_list.filter(
                character__characteraudit__isnull=True).count()
            if character_count == 0:
                valid_audits = 0
                character_cnt = 0
                for c in character_list:
                    if c.character.characteraudit.is_active():
                        valid_audits += 1
                    character_cnt += 1
                if valid_audits == character_cnt:
                    return not logic
                else:
                    return logic
            else:
                return logic
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def process_field(self, users):
        return self.audit_filter(users)

    def audit_filter(self, users):
        logic = self.reversed_logic
        co = CharacterOwnership.objects.filter(user__in=users).select_related(
            'user', 'character__characteraudit')
        chars = {}
        for c in co:
            if c.user.id not in chars:
                chars[c.user.id] = []
            try:
                if not c.character.characteraudit.is_active():
                    chars[c.user.id].append(c.character.character_name)
            except ObjectDoesNotExist:
                chars[c.user.id].append(c.character.character_name)

        output = defaultdict(lambda: {"message": "", "check": logic})
        for u in users:
            c = chars.get(u.id, False)
            if c is not False:
                if len(c) > 0:
                    _msg = ", ".join(c)
                    if self.count_message_only:
                        _msg = len(c)
                    output[u.id] = {"message": _msg, "check": logic}
                    continue
                else:
                    output[u.id] = {
                        "message": "All Characters Loaded", "check": not logic}
                    continue
            output[u.id] = {"message": "", "check": logic}
        return output


class HighestSPFilter(FilterBase):
    sp_cutoff = models.BigIntegerField(default=5000000000)
    swap_logic = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Smart Filter: Highest SP Character"
        verbose_name_plural = f"{verbose_name}"

    def process_filter(self, user: User):
        try:
            return self.audit_filter([user])[user.id]['check']
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        co = CharacterOwnership.objects.filter(
            user__in=users).select_related('user', 'character')
        chars = {}
        all_sp = SkillTotals.objects.filter(
            character__character__in=co.values_list('character'))
    # total_sp = models.BigIntegerField()
    # unallocated_sp = models.IntegerField(null=True, default=None)

        failure = self.swap_logic
        for i in all_sp:
            uid = i.character.character.character_ownership.user.id
            tsp = i.total_sp
            if i.unallocated_sp:
                tsp += i.unallocated_sp

            if uid not in chars:
                chars[uid] = tsp
            elif tsp > chars[uid]:
                chars[uid] = tsp

        output = defaultdict(lambda: {"message": 0, "check": False})
        for u in users:
            c = chars.get(u.id, 0)
            if c < self.sp_cutoff:
                output[u.id] = {"message": c, "check": failure}
                continue
            else:
                output[u.id] = {"message": c, "check": not failure}
                continue
        return output


class TimeInCorpFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Main's Time in Corp"
        verbose_name_plural = verbose_name

    days_in_corp = models.IntegerField(default=30)

    reversed_logic = models.BooleanField(
        default=False,
        help_text="If set all members less than the days in corp will pass the test."
    )

    def process_filter(self, user: User):
        logic = self.reversed_logic
        try:
            main_character = user.profile.main_character.characteraudit
            histories = CorporationHistory.objects.filter(
                character=main_character
            ).order_by('-start_date').first()

            days = timezone.now() - histories.start_date

            if main_character.character.corporation_id != histories.corporation_id:
                return False  # FAIL if history is no god from CCP.

            if days.days >= self.days_in_corp:
                return not logic
            else:
                return logic
        except Exception as e:
            # logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        logic = self.reversed_logic
        histories = CorporationHistory.objects.filter(
            character__character_id__in=users.values_list(
                "profile__main_character", flat=True)
        ).values(uid=F("character__character__character_ownership__user_id")).annotate(
            max_id=Max("record_id"),
        )
        # pull the specific histories
        histories = CorporationHistory.objects.filter(
            record_id__in=histories.values_list("max_id", flat=True)
        ).values(
            ccid=F("character__character__corporation_id"),
            rcid=F("corporation_id"),
            uid=F("character__character__character_ownership__user_id"),
            std=F("start_date")
        )

        chars = defaultdict(lambda: {})
        for c in histories:
            if c["ccid"] != c["rcid"]:
                continue  # Skip if not main corp.

            if c['std']:
                days = timezone.now() - c['std']
                days = days.days
            else:
                days = -1
            chars[c['uid']] = {
                "start_date": c["std"],
                "days_in_corp": days
            }

        output = defaultdict(lambda: {"message": "", "check": False})

        for c, char_corp_data in chars.items():
            start_date_localized = localize(char_corp_data["start_date"].date(
            )) if char_corp_data["start_date"] is not None else None
            end_date_localized = None

            if char_corp_data["days_in_corp"] >= self.days_in_corp:
                check = not logic
            else:
                if start_date_localized:
                    end_date_localized = localize(
                        (
                            char_corp_data["start_date"] +
                            datetime.timedelta(days=self.days_in_corp)
                        ).date()
                    )

                check = logic
            if char_corp_data["days_in_corp"] < 0:
                msg = "No Audit"
                check = False
            else:
                msg = (
                    ngettext_lazy(
                        singular=f'{char_corp_data["days_in_corp"]:d} day (Since: {start_date_localized})',
                        plural=f'{char_corp_data["days_in_corp"]:d} days (Since: {start_date_localized})',
                        number=char_corp_data["days_in_corp"],
                    )
                    if not end_date_localized
                    else ngettext_lazy(
                        singular=f'{char_corp_data["days_in_corp"]:d} day (Until: {end_date_localized})',
                        plural=f'{char_corp_data["days_in_corp"]:d} days (Until: {end_date_localized})',
                        number=char_corp_data["days_in_corp"],
                    )
                )
            output[c] = {"message": msg, "check": check}
        return output


class AssetsFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Assets in Locations"
        verbose_name_plural = verbose_name
    count_message_only = models.BooleanField(default=False)

    types = models.ManyToManyField(EveItemType, blank=True,
                                   help_text="Filter on Asset Types.")
    groups = models.ManyToManyField(EveItemGroup, blank=True,
                                    help_text="Filter on Asset Groups.")
    categories = models.ManyToManyField(EveItemCategory, blank=True,
                                        help_text="Filter on Asset Categories.")

    systems = models.ManyToManyField(MapSystem, blank=True,
                                     help_text="Limit filter to specific systems")
    constellations = models.ManyToManyField(MapConstellation, blank=True,
                                            help_text="Limit filter to specific constellations")
    regions = models.ManyToManyField(MapRegion, blank=True,
                                     help_text="Limit filter to specific regions")

    reversed_logic = models.BooleanField(
        default=False, help_text="Negate the value of the filter, i.e. check for absence of assets")

    def filter_query(self, users):
        character_list = CharacterOwnership.objects.filter(user__in=users) \
            .select_related('character', 'character__characteraudit')
        cnt_types = self.types.all().count()
        cnt_groups = self.groups.all().count()
        cnt_cats = self.categories.all().count()

        character_count = CharacterAsset.objects.filter(
            character__character__in=character_list.values_list('character'))
        output = []

        if cnt_types > 0:
            output.append(models.Q(type_name__in=self.types.all()))

        if cnt_groups > 0:
            output.append(models.Q(type_name__group__in=self.groups.all()))

        if cnt_cats > 0:
            output.append(
                models.Q(type_name__group__category__in=self.categories.all()))

        if len(output) == 0:
            return False

        query = output.pop()
        for _q in output:
            query |= _q
        character_count = character_count.filter(query)

        output = []

        if self.systems.all().count() > 0:
            output.append(
                models.Q(location_name__system__in=self.systems.all()))
            output.append(models.Q(
                location_id__in=self.systems.all().values_list('system_id', flat=True)))
        if self.constellations.all().count() > 0:
            output.append(
                models.Q(location_name__system__constellation__in=self.constellations.all()))
            output.append(models.Q(location_id__in=MapSystem.objects.filter(
                constellation__in=self.constellations.all()).values_list('system_id', flat=True)))
        if self.regions.all().count() > 0:
            output.append(
                models.Q(location_name__system__constellation__region__in=self.regions.all()))
            output.append(models.Q(location_id__in=MapSystem.objects.filter(
                constellation__region__in=self.regions.all()).values_list('system_id', flat=True)))

        if len(output) > 0:
            query = output.pop()
            for _q in output:
                query |= _q
            character_count = character_count.filter(query)
        return character_count

    def process_filter(self, user: User):
        try:
            co = self.filter_query([user])
            # XOR with self.reversed_logic
            return (co.count() > 0) != self.reversed_logic
        except Exception as e:
            logger.error(e, exc_info=1)
            return False != self.reversed_logic

    def audit_filter(self, users):
        co = self.filter_query(users).values("character__character__character_ownership__user",
                                             "type_name__name", "character__character__character_name")
        chars = defaultdict(dict)
        for c in co:
            uid = c["character__character__character_ownership__user"]
            char_name = c["character__character__character_name"]
            asset_type = c['type_name__name']
            if char_name not in chars[uid]:
                chars[uid][char_name] = []
            chars[uid][char_name].append(asset_type)

        output = defaultdict(
            lambda: {"message": "", "check": False != self.reversed_logic})
        for u in users:
            if len(chars[u.id]) > 0:
                dread_count = 0
                out_message = []
                for char, char_items in chars[u.id].items():
                    dread_count += len(char_items)
                    out_message.append(
                        f"{char}: {', '.join(list(set(char_items)))}")
                if self.count_message_only:
                    output[u.id] = {"message": dread_count,
                                    "check": True != self.reversed_logic}
                else:
                    output[u.id] = {"message": "<br>".join(
                        out_message), "check": True != self.reversed_logic}
            else:
                output[u.id] = {"message": "",
                                "check": False != self.reversed_logic}
        return output


class CurrentShipFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: The Current Ship being Flown"
        verbose_name_plural = verbose_name
    count_message_only = models.BooleanField(default=False)

    types = models.ManyToManyField(EveItemType, blank=True,
                                   help_text="Filter on Ship Types.")
    groups = models.ManyToManyField(EveItemGroup, blank=True,
                                    help_text="Filter on Ship Groups.")

    systems = models.ManyToManyField(MapSystem, blank=True,
                                     help_text="Limit filter to specific systems")
    constellations = models.ManyToManyField(MapConstellation, blank=True,
                                            help_text="Limit filter to specific constellations")
    regions = models.ManyToManyField(MapRegion, blank=True,
                                     help_text="Limit filter to specific regions")

    def filter_query(self, users):
        character_list = CharacterOwnership.objects.filter(user__in=users) \
            .select_related('character', "character__characteraudit")
        cnt_types = self.types.all().count()
        cnt_groups = self.groups.all().count()

        character_count = CharacterLocation.objects.filter(
            character__character__in=character_list.values_list('character'))
        output = []

        if cnt_types > 0:
            output.append(models.Q(current_ship__in=self.types.all()))

        if cnt_groups > 0:
            output.append(models.Q(current_ship__group__in=self.groups.all()))

        if len(output) == 0:
            return False

        query = output.pop()
        for _q in output:
            query |= _q
        character_count = character_count.filter(query)

        output = []

        if self.systems.all().count() > 0:
            output.append(
                models.Q(
                    current_location__system__in=self.systems.all()
                )
            )
            output.append(
                models.Q(
                    current_location__location_id__in=self.systems.all(
                    ).values_list('system_id', flat=True)
                )
            )
        if self.constellations.all().count() > 0:
            output.append(
                models.Q(
                    current_location__system__constellation__in=self.constellations.all()
                )
            )
            output.append(
                models.Q(
                    current_location__location_id__in=MapSystem.objects.filter(
                        constellation__in=self.constellations.all()
                    ).values_list('system_id', flat=True)
                )
            )
        if self.regions.all().count() > 0:
            output.append(
                models.Q(
                    current_location__system__constellation__region__in=self.regions.all()
                )
            )
            output.append(
                models.Q(
                    current_location__location_id__in=MapSystem.objects.filter(
                        constellation__region__in=self.regions.all()
                    ).values_list('system_id', flat=True)
                )
            )

        if len(output) > 0:
            query = output.pop()
            for _q in output:
                query |= _q
            character_count = character_count.filter(query)
        return character_count

    def process_filter(self, user: User):
        try:
            co = self.filter_query([user])
            if co.count() > 0:
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        co = self.filter_query(
            users
        ).values(
            "character__character__character_ownership__user",
            "character__character__character_name",
            "current_ship_name"
        )
        chars = defaultdict(dict)
        for c in co:
            uid = c["character__character__character_ownership__user"]
            char_name = c["character__character__character_name"]
            ship_type = c['current_ship_name']
            if char_name not in chars[uid]:
                chars[uid][char_name] = []
            chars[uid][char_name].append(ship_type)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:
            if len(chars[u.id]) > 0:
                ship_count = 0
                out_message = []
                for char, char_items in chars[u.id].items():
                    ship_count += len(char_items)
                    out_message.append(
                        f"{char}: {', '.join(list(set(char_items)))}")
                if self.count_message_only:
                    output[u.id] = {"message": ship_count, "check": True}
                else:
                    output[u.id] = {"message": "<br>".join(
                        out_message), "check": True}
            else:
                output[u.id] = {"message": "", "check": False}
        return output


class Skillfilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Skill list checks"
        verbose_name_plural = verbose_name

    count_message_only = models.BooleanField(default=False)

    required_skill_lists = models.ManyToManyField(SkillList, blank=True)
    single_req_skill_lists = models.ManyToManyField(
        SkillList, blank=True, related_name="single_req")

    def process_filter(self, user: User):
        try:  # avatar 11567
            skills_list = providers.skills.get_and_cache_user(user.id)
            skill_lists = self.required_skill_lists.all()
            req_one = self.single_req_skill_lists.all()
            if skill_lists.count() == 0 and req_one.count() == 0:
                return False

            skill_list_base = {}
            for skl in skill_lists:
                skill_list_base[skl.name] = {}
                skill_list_base[skl.name]['pass'] = False

            if req_one.count() > 0:
                skill_list_single = {}
                for skl in req_one:
                    skill_list_single[skl.name] = {}
                    skill_list_single[skl.name]['pass'] = False

            skill_tables = skills_list.get("skills_list")

            for char in skill_tables:
                for d_name, d_list in skill_list_base.items():
                    if len(skill_tables[char]["doctrines"][d_name]) == 0:
                        skill_list_base[d_name]['pass'] = True
            if req_one.count() > 0:
                single_pass = False
                for char in skill_tables:
                    for d_name, d_list in skill_list_single.items():
                        if len(skill_tables[char]["doctrines"][d_name]) == 0:
                            single_pass = True
                            break

            result = True
            for skill_list, skills_result in skill_list_base.items():
                result = result and skills_result['pass']
            if req_one.count() > 0:
                return result and single_pass
            else:
                return result

        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        output = defaultdict(lambda: {"message": "No Data", "check": False})
        accounts = providers.skills.get_and_cache_users(users)
        for uid, u in accounts.items():
            message = []
            skill_lists = self.required_skill_lists.all()
            req_one = self.single_req_skill_lists.all()
            if skill_lists.count() == 0 and req_one.count() == 0:
                return False

            skill_list_base = {}
            for skl in skill_lists:
                skill_list_base[skl.name] = {}
                skill_list_base[skl.name]['pass'] = False

            if req_one.count() > 0:
                skill_list_single = {}
                for skl in req_one:
                    skill_list_single[skl.name] = {}
                    skill_list_single[skl.name]['pass'] = False

            try:
                skill_tables = u['data'].get("skills_list")

                for char in skill_tables:
                    for d_name, d_list in skill_list_base.items():
                        if len(skill_tables[char]["doctrines"][d_name]) == 0:
                            skill_list_base[d_name]['pass'] = True
                            message.append(f"{char}: {d_name}")

                if req_one.count() > 0:
                    single_pass = False
                    for char in skill_tables:
                        for d_name, d_list in skill_list_single.items():
                            if len(skill_tables[char]["doctrines"][d_name]) == 0:
                                single_pass = True
                                message.append(f"{char}: {d_name}")
                                break

                result = True
                for skill_list, skills_result in skill_list_base.items():
                    result = result and skills_result['pass']
                _msg = "<br>".join(message)
                if self.count_message_only:
                    _msg = len(message)
                if req_one.count() > 0:
                    output[uid] = {'check': result and single_pass,
                                   'message': _msg}
                else:
                    output[uid] = {'check': result,
                                   'message': _msg}
            except KeyError:
                pass

        return output


class Rolefilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Corporate Role checks"
        verbose_name_plural = verbose_name

    has_director = models.BooleanField(default=False)
    has_accountant = models.BooleanField(default=False)
    has_station_manager = models.BooleanField(default=False)
    has_personnel_manager = models.BooleanField(default=False)

    main_only = models.BooleanField(default=False)

    corps_filter = models.ManyToManyField(
        EveCorporationInfo, related_name='audit_role_filters', blank=True)

    alliances_filter = models.ManyToManyField(
        EveAllianceInfo, related_name='audit_role_filters', blank=True)

    def process_filter(self, user: User):
        try:
            characters = user.character_ownerships.all()
            queries = []
            if self.main_only:
                characters = characters.filter(
                    character__character_id=user.profile.main_character.character_id)
            if self.corps_filter.all().count():
                characters = characters.filter(
                    character__corporation_id__in=self.corps_filter.all().values_list("corporation_id", flat=True))
            if self.alliances_filter.all().count():
                characters = characters.filter(
                    character__alliance_id__in=self.alliances_filter.all().values_list("alliance_id", flat=True))
            if self.has_director:
                _q = models.Q(
                    character__characteraudit__characterroles__director=True)
                queries.append(_q)
            if self.has_accountant:
                _q = models.Q(
                    character__characteraudit__characterroles__accountant=True)
                queries.append(_q)
            if self.has_station_manager:
                _q = models.Q(
                    character__characteraudit__characterroles__station_manager=True)
                queries.append(_q)
            if self.has_personnel_manager:
                _q = models.Q(
                    character__characteraudit__characterroles__personnel_manager=True)
                queries.append(_q)
            query = queries.pop()
            for q in queries:
                query |= q
            if characters.filter(query).exists():
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):

        co = CharacterOwnership.objects.filter(user__in=users)
        queries = []
        if self.main_only:
            co = co.filter(character__character_id=models.F(
                "user__profile__main_character__character_id"))
        if self.corps_filter.all().count():
            co = co.filter(
                character__corporation_id__in=self.corps_filter.all().values_list("corporation_id", flat=True))
        if self.alliances_filter.all().count():
            co = co.filter(
                character__alliance_id__in=self.alliances_filter.all().values_list("alliance_id", flat=True))
        if self.has_director:
            _q = models.Q(
                character__characteraudit__characterroles__director=True)
            queries.append(_q)
        if self.has_accountant:
            _q = models.Q(
                character__characteraudit__characterroles__accountant=True)
            queries.append(_q)
        if self.has_station_manager:
            _q = models.Q(
                character__characteraudit__characterroles__station_manager=True)
            queries.append(_q)
        if self.has_personnel_manager:
            _q = models.Q(
                character__characteraudit__characterroles__personnel_manager=True)
            queries.append(_q)
        query = queries.pop()
        for q in queries:
            query |= q

        co = co.filter(query)

        chars = {}
        for c in co:
            if c.user.id not in chars:
                chars[c.user.id] = []
            chars[c.user.id].append(c.character.character_name)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:
            c = chars.get(u.id, False)
            if c is not False:
                if len(c) > 0:
                    output[u.id] = {"message": ", ".join(c), "check": True}
                    continue
                else:
                    output[u.id] = {"message": "", "check": False}
                    continue
            output[u.id] = {"message": "", "check": False}
        return output


class Titlefilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Corporate Title checks"
        verbose_name_plural = verbose_name

    titles = models.ForeignKey(
        CharacterTitle, on_delete=models.CASCADE)

    def process_filter(self, user: User):
        try:
            characters = user.character_ownerships.all()

            if characters.filter(character__characteraudit__characterroles__titles__in=[self.titles]).exists():
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        co = CharacterOwnership.objects.filter(user__in=users,
                                               character__characteraudit__characterroles__titles__in=[self.titles])

        chars = {}
        for c in co:
            if c.user.id not in chars:
                chars[c.user.id] = []
            chars[c.user.id].append(c.character.character_name)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:
            c = chars.get(u.id, False)
            if c is not False:
                if len(c) > 0:
                    output[u.id] = {"message": ", ".join(c), "check": True}
                    continue
                else:
                    output[u.id] = {"message": "", "check": False}
                    continue
            output[u.id] = {"message": "", "check": False}
        return output


class LastLoginfilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Last Login Check"
        verbose_name_plural = verbose_name

    days_since_login = models.IntegerField(
        default=30,
        help_text="Days since last login of any Character in the accounts before failing the filter.")

    no_data_pass = models.BooleanField(
        default=False,
        blank=True,
        help_text="If there is no data (No Valid Corp Token) for a characters account then should this filter automatically pass.")

    main_corp_only = models.BooleanField(
        default=False,
        blank=True,
        help_text="Only check characters in main's corporation.")

    def process_filter(self, user: User):
        try:
            check = self.audit_filter([user])

            if check[user.id]['check']:
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        valid_logins = timezone.now(
        ) - datetime.timedelta(days=app_settings.CT_CHAR_MAX_INACTIVE_DAYS)
        co = CharacterOwnership.objects.filter(user__in=users, character__characteraudit__last_update_login__gte=valid_logins).select_related(
            "character__characteraudit", "character", "user__profile__main_character")

        chars = {}
        for c in co:
            if self.main_corp_only:
                if c.character.corporation_id != c.user.profile.main_character.corporation_id:
                    continue  # Skip this character

            if c.user_id not in chars:
                chars[c.user_id] = []

            if c.character.characteraudit.last_known_login:  # Login as Logoff in not always accurate
                chars[c.user_id].append(
                    # Login as Logoff in not always accurate
                    c.character.characteraudit.last_known_login)

        output = defaultdict(
            lambda: {"message": "No Data", "check": self.no_data_pass})
        for u in users:
            c = chars.get(u.id, False)
            if c is not False and len(c):
                max_date = max(c)
                string_date = max_date.strftime("%Y/%m/%d")
                days_since = (timezone.now() - max_date).days
                output[u.id] = {"message": f"{string_date} - {days_since} Days Ago",
                                "check": False if days_since > self.days_since_login else True}
                continue
        return output


class HomeStationFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Home Station (Death Clone)"
        verbose_name_plural = verbose_name

    evelocation = models.ManyToManyField(
        EveLocation, blank=True, help_text="Limit filter to specific Structures")

    def filter_query(self, users):
        character_list = CharacterOwnership.objects.filter(
            user__in=users).select_related('character', "character__characteraudit")

        character_count = Clone.objects.filter(
            character__character__in=character_list.values_list('character'))

        output = []

        if self.evelocation.all().count() > 0:
            output.append(models.Q(location_name__in=self.evelocation.all()))
            output.append(models.Q(
                location_id__in=self.evelocation.all().values_list('location_id', flat=True)))

        if len(output) > 0:
            query = output.pop()
            for _q in output:
                query |= _q
            character_count = character_count.filter(query)
        return character_count

    def process_filter(self, user: User):
        try:
            co = self.filter_query([user])
            if co.count() > 0:
                return True
            else:
                return False
        except Exception as e:
            # logger.exception(e)
            return False

    def audit_filter(self, users):
        co = self.filter_query(users).values("character__character__character_ownership__user",
                                             "character__character__character_name", "location_id")
        chars = defaultdict(dict)
        for c in co:
            uid = c["character__character__character_ownership__user"]
            char_name = c["character__character__character_name"]
            # This might be able to be optimized during the query. But theres no FK to work with?
            clone_location = EveLocation.objects.get(
                location_id=c['location_id']).location_name
            if char_name not in chars[uid]:
                chars[uid][char_name] = []
            chars[uid][char_name].append(clone_location)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:
            if len(chars[u.id]) > 0:
                ship_count = 0
                out_message = []
                for char, char_items in chars[u.id].items():
                    ship_count += len(char_items)
                    out_message.append(
                        f"{char}: {', '.join(list(set(char_items)))}")
                    output[u.id] = {"message": "<br>".join(
                        out_message), "check": True}
            else:
                output[u.id] = {"message": "", "check": False}
        return output


class JumpCloneFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Jump Clone"
        verbose_name_plural = verbose_name

    evelocation = models.ManyToManyField(
        EveLocation, blank=True, help_text="Limit filter to specific Structures")

    def filter_query(self, users):
        character_list = CharacterOwnership.objects.filter(
            user__in=users).select_related('character', "character__characteraudit")

        character_count = JumpClone.objects.filter(
            character__character__in=character_list.values_list('character'))

        output = []

        if self.evelocation.all().count() > 0:
            output.append(models.Q(location_name__in=self.evelocation.all()))
            output.append(models.Q(
                location_id__in=self.evelocation.all().values_list('location_id', flat=True)))

        if len(output) > 0:
            query = output.pop()
            for _q in output:
                query |= _q
            character_count = character_count.filter(query)
        return character_count

    def process_filter(self, user: User):
        try:
            co = self.filter_query([user])
            if co.count() > 0:
                return True
            else:
                return False
        except Exception as e:
            logger.exception(e)
            return False

    def audit_filter(self, users):
        co = self.filter_query(users).values("character__character__character_ownership__user",
                                             "character__character__character_name", "location_id")
        chars = defaultdict(dict)
        for c in co:
            uid = c["character__character__character_ownership__user"]
            char_name = c["character__character__character_name"]
            # This might be able to be optimized during the query. But theres no FK to work with?
            clone_location = EveLocation.objects.get(
                location_id=c['location_id']).location_name
            if char_name not in chars[uid]:
                chars[uid][char_name] = []
            chars[uid][char_name].append(clone_location)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:
            if len(chars[u.id]) > 0:
                ship_count = 0
                out_message = []
                for char, char_items in chars[u.id].items():
                    ship_count += len(char_items)
                    out_message.append(
                        f"{char}: {', '.join(list(set(char_items)))}")
                    output[u.id] = {"message": "<br>".join(
                        out_message), "check": True}
            else:
                output[u.id] = {"message": "", "check": False}
        return output


class CharacterAgeFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Character Age Filter"
        verbose_name_plural = verbose_name

    min_age = models.IntegerField(default=30)

    reversed_logic = models.BooleanField(
        default=False,
        help_text="If set all user with age less than the min_max_age will pass the test."
    )

    def process_filter(self, user: User):
        logic = self.reversed_logic
        try:
            main_character = user.profile.main_character.characteraudit
            histories = CorporationHistory.objects.filter(
                character=main_character).order_by('start_date').first()

            days = timezone.now() - histories.start_date
            if days.days >= self.min_age:
                return not logic
            else:
                return logic
        except Exception as e:
            # logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        logic = self.reversed_logic
        co = users.annotate(
            min_timestamp=Min(
                'profile__main_character__characteraudit__corporationhistory__start_date')
        ).values("id", "min_timestamp")

        chars = defaultdict(lambda: {})
        for c in co:
            if c['min_timestamp']:
                days = timezone.now() - c['min_timestamp']
                days = days.days
            else:
                days = -1
            chars[c['id']] = {
                "start_date": c["min_timestamp"],
                "age": days
            }

        output = defaultdict(lambda: {"message": "", "check": False})

        for c, char_corp_data in chars.items():
            start_date_localized = localize(char_corp_data["start_date"].date(
            )) if char_corp_data["start_date"] is not None else None
            end_date_localized = None

            if char_corp_data["age"] >= self.min_age:
                check = not logic
            else:
                if start_date_localized:
                    end_date_localized = localize(
                        (
                            char_corp_data["start_date"] +
                            datetime.timedelta(days=self.min_age)
                        ).date()
                    )

                check = logic
            if char_corp_data["age"] < 0:
                msg = "No Audit"
                check = False
            else:
                msg = (
                    ngettext_lazy(
                        singular=f'{char_corp_data["age"]:d} day old (Since: {start_date_localized})',
                        plural=f'{char_corp_data["age"]:d} days old (Since: {start_date_localized})',
                        number=char_corp_data["age"],
                    )
                    if not end_date_localized
                    else ngettext_lazy(
                        singular=f'{char_corp_data["age"]:d} day old (Until: {end_date_localized})',
                        plural=f'{char_corp_data["age"]:d} days old (Until: {end_date_localized})',
                        number=char_corp_data["age"],
                    )
                )
            output[c] = {"message": msg, "check": check}
        return output
