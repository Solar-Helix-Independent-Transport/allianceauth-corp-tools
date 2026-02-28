# Third Party
from eve_sde.models import ItemType

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools.models import (
    CorporationAudit,
    CorporationIndustryJob,
)

from .. import providers
from .utils import get_corp_token, update_corp_audit

logger = get_extension_logger(__name__)


@update_corp_audit(update_field="last_update_industry_jobs")
def corp_update_industry_jobs(corp_id: int, force_refresh: bool = False) -> str:
    """
    https://developers.eveonline.com/api-explorer#/operations/GetCorporationsCorporationIdIndustryJobs
    """
    req_scopes = ['esi-industry.read_corporation_jobs.v1']

    req_roles = ['Factory_Manager']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"

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

    existing_pks: set[int] = set(
        # only one we care about.
        CorporationIndustryJob.objects.filter(
            corporation=_corporation,
            job_id__in=[
                e.job_id for e in industry_jobs
            ]
        ).values_list("job_id", flat=True)
    )
    type_ids: set[int] = set()
    new_events = []
    for event in industry_jobs:
        type_ids.add(event.blueprint_type_id)
        if event.product_type_id:
            type_ids.add(event.product_type_id)

        if event.job_id in existing_pks:
            _m: CorporationIndustryJob = CorporationIndustryJob.objects.get(
                corporation=_corporation,
                job_id=event.get("job_id")
            )
            _m.completed_character_id = event.completed_character_id
            _m.completed_date = event.completed_date
            _m.end_date = event.end_date
            _m.pause_date = event.pause_date
            _m.status = event.status
            _m.successful_runs = event.successful_runs
            _m.save()
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
            ignore_conflicts=True
        )

    return f"Updated industry jobs for {_corporation}"
