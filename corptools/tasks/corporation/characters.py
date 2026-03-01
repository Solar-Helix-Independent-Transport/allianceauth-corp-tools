# Django
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools.models import CharacterAudit, CorporationAudit

from .. import providers
from .utils import get_corp_token, update_corp_audit

logger = get_extension_logger(__name__)


@update_corp_audit(update_field="last_update_tracking")
def update_character_logins_from_corp(corp_id, full_update=False):
    audit_corp = CorporationAudit.objects.get(
        corporation__corporation_id=corp_id)
    logger.debug("Updating Logins for: {}".format(
        audit_corp.corporation))

    req_scopes = [
        'esi-corporations.track_members.v1',
        'esi-characters.read_corporation_roles.v1'
    ]
    req_roles = ['Director']

    token = get_corp_token(corp_id, req_scopes, req_roles)

    if not token:
        return "No Tokens"
    tracking = providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdMembertracking(
        corporation_id=corp_id,
        token=token
    ).results(
        force_refresh=full_update,
        store_cache=False
    )

    for c in tracking:
        try:
            ca = CharacterAudit.objects.get(
                character__character_id=c.character_id)
            ca.last_known_login = c.logon_date
            ca.last_known_logoff = c.logoff_date
            ca.save()
        except CharacterAudit.DoesNotExist:
            pass

    all_chars = CharacterAudit.objects.filter(
        character__corporation_id=corp_id)
    all_chars.update(last_update_login=timezone.now())

    return f"Finished Logins for: {audit_corp.corporation}"
