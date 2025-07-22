from random import random

from celery import chain as Chain, shared_task

from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ..models import CorporationAudit
from ..task_helpers import corp_helpers
from . import app_settings
from .utils import esi_error_retry, no_fail_chain

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"


logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_wallet"
)
@no_fail_chain
@esi_error_retry
def update_corp_wallet(self, corp_id, full_update=False, chain=[]):
    return corp_helpers.update_corp_wallet_division(corp_id, full_update=full_update)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_structures"
)
@no_fail_chain
@esi_error_retry
def update_corp_structures(self, corp_id, force_refresh=False, chain=[]):
    return corp_helpers.update_corp_structures(corp_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_assets"
)
@esi_error_retry
def update_corp_assets(self, corp_id, chain=[]):
    return corp_helpers.update_corp_assets(corp_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_pocos"
)
@no_fail_chain
@esi_error_retry
def update_corp_pocos(self, corp_id, chain=[]):
    return corp_helpers.update_corporation_pocos(corp_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_logins"
)
@no_fail_chain
@esi_error_retry
def update_corp_logins(self, corp_id, chain=[]):
    return corp_helpers.update_character_logins_from_corp(corp_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_starbases"
)
@no_fail_chain
@esi_error_retry
def update_corp_starbases(self, corp_id, force_refresh=False, chain=[]):
    return corp_helpers.fetch_starbases(corp_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_contracts"
)
@no_fail_chain
@esi_error_retry
def update_corp_contracts(self, corp_id, force_refresh=False, chain=[]):
    _, ids = corp_helpers.update_corporate_contracts(
        corp_id, force_refresh=force_refresh)

    _chain = []
    for id in ids:
        _chain.append(corp_helpers.update_corporate_contract_items.si(
            corp_id, id)
        )
    Chain(_chain).apply_async(priority=8)

    return "Completed Que of contract items for: %s" % str(corp_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_industry_jobs"
)
@no_fail_chain
@esi_error_retry
def update_corp_industry_jobs(self, corp_id: int, force_refresh: bool = False, chain=[]) -> str:
    return corp_helpers.update_corporation_industry_jobs(corp_id, force_refresh=force_refresh)

@shared_task(
    name="corptools.tasks.update_corp"
)
def update_corp(corp_id, force_refresh=False):
    corp = CorporationAudit.objects.get(corporation__corporation_id=corp_id)
    logger.info("Starting Updates for {}".format(
        corp.corporation.corporation_name))
    que = []
    que.append(update_corp_wallet.si(corp_id))
    que.append(update_corp_structures.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_starbases.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_assets.si(corp_id))
    que.append(update_corp_pocos.si(corp_id))
    que.append(update_corp_contracts.si(corp_id))
    que.append(update_corp_logins.si(corp_id))
    que.append(update_corp_industry_jobs.si(corp_id, force_refresh=force_refresh))
    Chain(que).apply_async(priority=6)


@shared_task(
    name="corptools.tasks.update_all_corps"
)
def update_all_corps(force_refresh=False):
    corps = CorporationAudit.objects.all().select_related('corporation')
    for corp in corps:
        countdown = 1 if force_refresh else random()*app_settings.CT_TASK_SPREAD_DELAY*2
        update_corp.apply_async(
            args=[corp.corporation.corporation_id],
            kwargs={"force_refresh": force_refresh},
            countdown=countdown
        )
