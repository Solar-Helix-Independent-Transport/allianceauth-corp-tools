# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools.app_settings import CT_DB_BULK_CREATE_BATCH_SIZE
from corptools.models import (
    INDUSTRY_JOB_UPDATE_FIELDS,
    CorporationAudit,
    CorporationIndustryJob,
)

from ... import providers
from .utils import NoTokens, get_corp_token, update_corp_audit

logger = get_extension_logger(__name__)


@update_corp_audit(update_field="industry_jobs")
def corp_update_industry_jobs(corp_id: int, force_refresh: bool = False) -> str:
    """
    https://developers.eveonline.com/api-explorer#/operations/GetCorporationsCorporationIdIndustryJobs
    """
    req_scopes = ['esi-industry.read_corporation_jobs.v1']

    req_roles = ['Factory_Manager']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        raise NoTokens("Indy")

    _corporation: CorporationAudit = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    industry_jobs = providers.esi_openapi.client.Industry.GetCorporationsCorporationIdIndustryJobs(
        corporation_id=_corporation.corporation.corporation_id,
        include_completed=True,
        token=token
    ).results(
        force_refresh=force_refresh,
        store_cache=False
    )

    existing: dict[int, CorporationIndustryJob] = {
        job.job_id: job
        for job in CorporationIndustryJob.objects.filter(
            corporation=_corporation,
            job_id__in=[e.job_id for e in industry_jobs]
        )
    }
    new_events = []
    updated_events = []
    for event in industry_jobs:
        if event.job_id in existing:
            _m = existing[event.job_id]
            for field in INDUSTRY_JOB_UPDATE_FIELDS:
                setattr(_m, field, getattr(event, field))
            updated_events.append(_m)
            continue

        _e = CorporationIndustryJob(
            corporation=_corporation,
            activity_id=event.activity_id,
            blueprint_id=event.blueprint_id,
            blueprint_location_id=event.blueprint_location_id,
            blueprint_type_id=event.blueprint_type_id,
            blueprint_type_name_id=event.blueprint_type_id,
            completed_character_id=event.completed_character_id,
            completed_date=event.completed_date,
            cost=event.cost,
            duration=event.duration,
            end_date=event.end_date,
            facility_id=event.facility_id,
            installer_id=event.installer_id,
            job_id=event.job_id,
            licensed_runs=event.licensed_runs,
            location_id=event.location_id,
            output_location_id=event.output_location_id,
            pause_date=event.pause_date,
            probability=event.probability,
            product_type_id=event.product_type_id,
            product_type_name_id=event.product_type_id,
            runs=event.runs,
            start_date=event.start_date,
            status=event.status,
            successful_runs=event.successful_runs
        )

        new_events.append(_e)

    if len(new_events):
        CorporationIndustryJob.objects.bulk_create(
            new_events,
            ignore_conflicts=True,
            batch_size=CT_DB_BULK_CREATE_BATCH_SIZE
        )

    if len(updated_events):
        CorporationIndustryJob.objects.bulk_update(
            updated_events,
            INDUSTRY_JOB_UPDATE_FIELDS,
            batch_size=CT_DB_BULK_CREATE_BATCH_SIZE
        )

    return f"Updated industry jobs for {_corporation}"
