# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools.models import CorporationAudit
from corptools.models.sovereignty import (
    SovereigntyHub,
    SovereigntyHubReagent,
    SovereigntyHubUpgrade,
)

from ... import providers
from .utils import NoTokens, get_corp_token, update_corp_audit

logger = get_extension_logger(__name__)

_SOV_SCOPES = ['esi-structures.read_corporation.v1']
_SOV_ROLES = ['Station_Manager']


@update_corp_audit(update_field="sovereignty_hubs")
def corp_sovereignty_hub_update(corp_id, force_refresh=False):
    """Fetch hub listing, prune stale records, return ESI hub IDs for detail tasks."""
    token = get_corp_token(corp_id, _SOV_SCOPES, _SOV_ROLES)
    if not token:
        raise NoTokens("Sovereignty Hubs")

    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    hub_listing = providers.esi_openapi.client.Structures.GetCorporationsStructuresSovereigntyHubsListing(
        corporation_id=_corporation.corporation.corporation_id,
        token=token
    ).result(
        force_refresh=force_refresh,
        store_cache=False
    )

    if hub_listing.sovereignty_hubs is None:
        logger.info(f"CT: No sovereignty hubs found for corp {corp_id}")
        SovereigntyHub.objects.filter(corporation=_corporation).delete()
        return []

    hub_ids = [h.id for h in hub_listing.sovereignty_hubs]

    SovereigntyHub.objects.filter(
        corporation=_corporation
    ).exclude(
        hub_id__in=hub_ids
    ).delete()

    return hub_ids


def corp_sovereignty_hub_detail_update(corp_id, hub_id, force_refresh=False):
    """Fetch and store full detail for a single sovereignty hub."""
    token = get_corp_token(corp_id, _SOV_SCOPES, _SOV_ROLES)
    if not token:
        raise NoTokens("Sovereignty Hub Detail")

    _corporation = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)

    hub_detail = providers.esi_openapi.client.Structures.GetCorporationsStructuresSovereigntyHubsDetail(
        corporation_id=_corporation.corporation.corporation_id,
        sovereignty_hub_id=hub_id,
        token=token
    ).result(
        force_refresh=force_refresh,
        store_cache=False
    )

    defaults = {
        'solar_system_id': hub_detail.solar_system_id,
        'solar_system_name_id': hub_detail.solar_system_id,
        'fuel_access_list_id': getattr(hub_detail, 'fuel_access_list_id', None),
    }

    if hub_detail.resources:
        defaults.update({
            'power_allocated': hub_detail.resources.power.allocated,
            'power_available': hub_detail.resources.power.available,
            'workforce_allocated': hub_detail.resources.workforce.allocated,
            'workforce_available': hub_detail.resources.workforce.available,
        })

    if hub_detail.vulnerability_window:
        defaults.update({
            'vuln_window_start': hub_detail.vulnerability_window.start,
            'vuln_window_end': hub_detail.vulnerability_window.end,
        })

    if hub_detail.reagent_bay:
        defaults['reagent_last_updated'] = hub_detail.reagent_bay.last_updated

    if hub_detail.workforce_transport:
        defaults['workforce_transport'] = hub_detail.workforce_transport.model_dump()

    hub_ob, _ = SovereigntyHub.objects.update_or_create(
        corporation=_corporation,
        hub_id=hub_detail.id,
        defaults=defaults
    )

    hub_ob.reagents.all().delete()
    if hub_detail.reagent_bay and hub_detail.reagent_bay.reagents:
        SovereigntyHubReagent.objects.bulk_create([
            SovereigntyHubReagent(
                hub=hub_ob,
                type_name_id=reagent.type_id,
                amount=reagent.amount,
                burning_per_hour=reagent.burning_per_hour,
            )
            for reagent in hub_detail.reagent_bay.reagents
        ])

    hub_ob.upgrades.all().delete()
    if hub_detail.upgrades:
        SovereigntyHubUpgrade.objects.bulk_create([
            SovereigntyHubUpgrade(
                hub=hub_ob,
                type_name_id=upgrade.type_id,
                power_state=upgrade.power_state,
            )
            for upgrade in hub_detail.upgrades
        ])

    return f"CT: Updated sovereignty hub {hub_id} for {_corporation.corporation.corporation_name}"
