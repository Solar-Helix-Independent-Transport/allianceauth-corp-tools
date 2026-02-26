# Standard Library
from random import random

# Third Party
from celery import chain as Chain
from celery import shared_task

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce
from esi.exceptions import HTTPClientError, HTTPNotModified, HTTPServerError

from ...models import CorporationAudit
from .. import app_settings
from ..utils import esi_error_retry, no_fail_chain
from .assets import corp_update_assets
from .characters import update_character_logins_from_corp
from .contracts import corp_contract_item_fetch, corp_contract_update
from .indy import corp_update_industry_jobs
from .structures import (
    corp_starbase_update,
    corp_structure_update,
    corp_update_pocos,
)
from .wallet import update_corp_wallet_divisions

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"


logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_wallet"
)
@no_fail_chain
@esi_error_retry
def update_corp_wallet(self, corp_id, force_refresh=False, chain=[]):
    return update_corp_wallet_divisions(corp_id, full_update=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_structures"
)
@no_fail_chain
@esi_error_retry
def update_corp_structures(self, corp_id, force_refresh=False, chain=[]):
    return corp_structure_update(corp_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_assets"
)
@esi_error_retry
def update_corp_assets(self, corp_id, force_refresh=False, chain=[]):
    return corp_update_assets(corp_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_pocos"
)
@no_fail_chain
@esi_error_retry
def update_corp_pocos(self, corp_id, force_refresh=False, chain=[]):
    return corp_update_pocos(corp_id, full_update=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_logins"
)
@no_fail_chain
@esi_error_retry
def update_corp_logins(self, corp_id, force_refresh=False, chain=[]):
    return update_character_logins_from_corp(corp_id, full_update=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_starbases"
)
@no_fail_chain
@esi_error_retry
def update_corp_starbases(self, corp_id, force_refresh=False, chain=[]):
    return corp_starbase_update(corp_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_contract_items"
)
@no_fail_chain
@esi_error_retry
def update_corporate_contract_items(self, corp_id, contract_id, force_refresh=False, chain=[]):
    try:
        return corp_contract_item_fetch(corp_id, contract_id, force_refresh=force_refresh)
    except HTTPNotModified:
        pass
    except (HTTPClientError, HTTPServerError) as e:
        if e.status_code == 404:
            _msg = f"CT: Contract items {str(corp_id)} ({str(contract_id)}) NOT FOUND ERROR"
            logger.warning(
                f"CT: Contract items {str(corp_id)} ({str(contract_id)}) NOT FOUND ERROR"
            )
            return f"CT: Contract items {str(corp_id)} ({str(contract_id)}) NOT FOUND ERROR"
        else:
            self.retry()


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_corp_contracts"
)
@no_fail_chain
@esi_error_retry
def update_corp_contracts(self, corp_id, force_refresh=False, chain=[]):
    ret = corp_contract_update(
        corp_id,
        force_refresh=force_refresh
    )

    if ret:
        _chain = []
        for id in ret[1]:
            _chain.append(
                update_corporate_contract_items.si(
                    corp_id,
                    id
                )
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
    return corp_update_industry_jobs(corp_id, force_refresh=force_refresh)


@shared_task(
    name="corptools.tasks.update_corp"
)
def update_corp(corp_id, force_refresh=False):
    corp = CorporationAudit.objects.get(corporation__corporation_id=corp_id)
    logger.info(f"Starting Updates for {corp.corporation.corporation_name}")

    que = []
    que.append(update_corp_wallet.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_structures.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_starbases.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_assets.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_pocos.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_contracts.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_logins.si(corp_id, force_refresh=force_refresh))
    que.append(
        update_corp_industry_jobs.si(
            corp_id,
            force_refresh=force_refresh
        )
    )

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
            kwargs={
                "force_refresh": force_refresh
            },
            countdown=countdown
        )
