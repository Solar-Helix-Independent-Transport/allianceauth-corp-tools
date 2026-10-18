# Standard Library
import datetime
import json
import math
from random import random

# Third Party
import requests
from celery import shared_task
from eve_sde.models import ItemType

# Django
from django.utils import timezone

try:
    # V5.#
    # Alliance Auth
    from allianceauth.eveonline.providers import open_api_provider as eve_names
except ImportError:
    # V4.#
    from allianceauth.eveonline.providers import provider as eve_names

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce
from esi.exceptions import ESIErrorLimitException

from .. import app_settings
from ..esi_errors import ERROR_FLAG_SECONDS, error_budget_low, set_error_flag
from ..models import EveName, TypePrice
from ..task_helpers.update_tasks import set_error_count_flag
from .utils import get_error_count_flag

logger = get_extension_logger(__name__)


@shared_task(name="corptools.tasks.update_all_eve_names")
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


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": True},
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
            if name.category == EveName.CORPORATION:
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
        except ESIErrorLimitException as e:
            # ESI-wide 420: back everything off and try this name again later,
            # rather than cooling the name off as if it were a "no access".
            reset = math.ceil(e.reset) if e.reset else ERROR_FLAG_SECONDS
            set_error_flag(reset)
            self.retry(countdown=reset + 1)
        except Exception as e:  # no access
            if error_budget_low(getattr(getattr(e, "response", None), "headers", None)):
                set_error_count_flag()
            # cooloff for a while - last_update is auto_now, so saving bumps it
            name.save()


@shared_task(name="corptools.tasks.update_all_raw_minerals")
def update_all_raw_minerals():
    _types = ItemType.objects.filter(group__category_id=4)
    return update_prices_for_types(list(_types.values_list("type_id", flat=True)))


@shared_task(name="corptools.tasks.update_prices_for_types")
def update_prices_for_types(type_ids: list):
    logger.info("Pulling values from Jita @`buy`-`weightedAverage`")
    if not type_ids:
        return json.dumps({})
    _str = ",".join(str(i) for i in type_ids)
    url = f"https://market.fuzzwork.co.uk/aggregates/?station=60003760&types={_str}"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    price_data = response.json()
    price_cache = {}
    for key, item in price_data.items():
        obj, _ = ItemType.objects.get_or_create_from_esi(key)
        TypePrice.objects.update_or_create(
            item=obj,
            defaults={"price": float(item['buy']["weightedAverage"])}
        )
        price_cache[obj.name] = float(item['buy']["weightedAverage"])
    return json.dumps(price_cache, indent=2)
