import datetime
import json
from random import random

import requests
from celery import chain as Chain, shared_task

from django.core.cache import cache
from django.utils import timezone

from allianceauth.eveonline.providers import provider as eve_names
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from corptools.task_helpers.housekeeping_tasks import remove_old_notifications

from .. import app_settings, providers
from ..models import (
    CharacterWalletJournalEntry, EveItemType, EveName, MapSystem, TypePrice,
)
from ..task_helpers.update_tasks import (
    load_system, process_category_from_esi, process_map_from_esi,
    set_error_count_flag, update_ore_comp_table_from_fuzzworks,
)

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"


logger = get_extension_logger(__name__)

# Bulk Updates


@shared_task(
    name="corptools.tasks.update_or_create_map"
)
def update_or_create_map():
    return process_map_from_esi()


@shared_task(
    name="corptools.tasks.update_ore_comp_table"
)
def update_ore_comp_table():
    return update_ore_comp_table_from_fuzzworks()


@shared_task(
    name="corptools.tasks.update_category"
)
def update_category(category_id):
    return process_category_from_esi(category_id)


@shared_task(
    name="corptools.tasks.process_ores_from_esi"
)
def process_ores_from_esi():
    return process_category_from_esi(25)


@shared_task(
    name="corptools.tasks.update_all_eve_names"
)
def update_all_eve_names(chunk=False):
    needs_update = timezone.now() - datetime.timedelta(days=30)
    en = EveName.objects.filter(last_update__lte=needs_update)
    if chunk:
        en = en[:chunk]
    for e in en:
        update_eve_name.apply_async(
            args=[e.eve_id],
            priority=7,
            countdown=random() * app_settings.CT_TASK_SPREAD_DELAY
        )


def get_error_count_flag():
    return cache.get("esi_errors_timeout", False)


@shared_task(
    bind=True,
    base=QueueOnce,
    max_retries=None,
    name="corptools.tasks.update_eve_name"
)
def update_eve_name(self, id):
    if get_error_count_flag():
        self.retry(countdown=60)

    name = EveName.objects.get(eve_id=id)
    if name.needs_update():
        try:
            if name.category == EveName.CHARACTER:
                update = eve_names.get_character(id)
                name.name = update.name
                if update.alliance:
                    alliance, _ = EveName.objects.update_or_create(
                        eve_id=update.alliance.id,
                        defaults={
                            'name': update.alliance.name,
                            'category': EveName.ALLIANCE,
                        }
                    )
                    name.alliance = alliance
                if update.corp:
                    corporation, _ = EveName.objects.update_or_create(
                        eve_id=update.corp.id,
                        defaults={
                            'name': update.corp.name,
                            'category': EveName.CORPORATION,
                        }
                    )
                    if update.alliance:
                        corporation.alliance_id = update.alliance.id
                        corporation.save()
                    name.corporation = corporation
                name.save()
            if name.category == EveName.ALLIANCE:
                update = eve_names.get_corp(id)
                name.name = update.corporation_name
                if update.alliance:
                    alliance, _ = EveName.objects.update_or_create(
                        eve_id=update.alliance.id,
                        defaults={
                            'name': update.alliance.name,
                            'category': EveName.ALLIANCE,
                        }
                    )
                    name.alliance = alliance
                name.save()
            if name.category == EveName.ALLIANCE:
                update = eve_names.get_alliance(id)
                name.name = update.name
            name.save()
        except Exception as e:  # no access
            if hasattr(e, "response"):
                if hasattr(e.response, "headers"):
                    if int(e.response.headers.get('x-esi-error-limit-remain')) < 50:
                        set_error_count_flag()
            # cooloff for a while
            name.last_updated = timezone.now()
            name.save()


@shared_task(name="corptools.tasks.process_all_categories")
def process_all_categories():
    categories = providers.esi.client.Universe.get_universe_categories().result()
    que = []

    for category in categories:
        que.append(update_category.si(category))

    Chain(que).apply_async(priority=8)

    return f"Queued {len(que)} Tasks"


@shared_task(name="corptools.tasks.run_housekeeping")
def run_housekeeping():
    notifs = remove_old_notifications()
    return notifs


@shared_task(name="corptools.tasks.update_all_raw_minerals")
def update_all_raw_minerals():
    _types = EveItemType.objects.filter(group__category_id=4)
    return update_prices_for_types(list(_types.values_list("type_id", flat=True)))


@shared_task(name="corptools.tasks.update_prices_for_types")
def update_prices_for_types(type_ids: list):
    logger.info(
        "Pulling values from Jita @`buy`-`weightedAverage`"
    )
    _str = str(type_ids.pop())
    for i in type_ids:
        _str += f",{i}"
    url = f"https://market.fuzzwork.co.uk/aggregates/?station=60003760&types={_str}"
    response = requests.get(url)
    price_data = response.json()
    price_cache = {}
    for key, item in price_data.items():
        obj, _ = EveItemType.objects.get_or_create_from_esi(key)

        ob, _ = TypePrice.objects.update_or_create(
            item=obj,
            defaults={
                "price": float(item['buy']["weightedAverage"])
            }
        )
        price_cache[obj.name] = float(item['buy']["weightedAverage"])
    return json.dumps(price_cache, indent=2)

# Bulk Updates


@shared_task(name="corptools.tasks.clear_all_etags")
def clear_all_etags():
    try:
        from django_redis import get_redis_connection
        _client = get_redis_connection("default")
    except (NotImplementedError, ModuleNotFoundError):
        from django.core.cache import caches
        default_cache = caches['default']
        _client = default_cache.get_master_client()

    keys = _client.keys(":?:etag-*")
    if keys:
        deleted = _client.delete(*keys)

    return f"Deleted {deleted} etag keys"


@shared_task
def load_planets_moons_from_esi():
    for ss in MapSystem.objects.all():
        load_system_from_esi.delay(ss.system_id)


@shared_task
def load_system_from_esi(system_id):
    load_system(system_id, moons_update=True)


@shared_task
def update_wallet_currency(pk):
    m = CharacterWalletJournalEntry.objects.get(pk=pk)
    reason = m.reason
    if not reason.endswith("ISK"):
        reason = reason.replace(" @ $", " @ ")
        reason = reason + " ISK"
        m.reason = reason
        m.save()
