# Standard Library
from typing import Union

# Django
from django.utils import timezone

# Alliance Auth
from allianceauth.eveonline.models import EveCharacter
from allianceauth.services.hooks import get_extension_logger
from esi.errors import TokenError
from esi.exceptions import HTTPError, HTTPNotModified
from esi.models import Token

# AA Example App
from corptools.models import CorporationAudit, EveName

from .. import providers

logger = get_extension_logger(__name__)


def update_corp_audit(update_field: str = ""):
    def decorator(function):
        def wrapper(*args, **kwargs):
            audit_corp = CorporationAudit.objects.get(
                corporation__corporation_id=args[0]
            )

            try:
                result = function(*args, **kwargs)
                try:
                    setattr(
                        audit_corp, f"last_update_{update_field}", timezone.now())
                    setattr(
                        audit_corp, f"last_change_{update_field}", timezone.now())
                except Exception:
                    pass
                return result
            except HTTPNotModified:
                logger.info(f"Not modified {function} {args} {kwargs}")
                setattr(audit_corp, update_field, timezone.now())
            except HTTPError as e:
                logger.error(f"HTTPError {function} {args} {kwargs} {e}")

            audit_corp.save()
            return
        return wrapper
    return decorator


def get_corp_token(corp_id: int, scopes: list, req_roles: Union[list, None, bool]):
    """
    Helper method to get a token for a specific character from a specific corp with specific scopes, where
    a character has specific in game roles.
    :param corp_id: Corp to filter on.
    :param scopes: array of ESI scope strings required on the token
    :param req_roles: array of roles, one of which is required on the character.
    :return: :class:esi.models.Token or None
    """

    # always add roles scope as a requirement.
    if 'esi-characters.read_corporation_roles.v1' not in scopes:
        scopes.append("esi-characters.read_corporation_roles.v1")

    # Find all characters in the corporation known to auth.
    char_ids = EveCharacter.objects.filter(
        corporation_id=corp_id
    ).values('character_id')

    # find all tokens for the corp, with the scopes.
    tokens = Token.objects.filter(
        character_id__in=char_ids
    ).require_scopes(scopes)

    # loop to check the roles and break on first correct match
    for token in tokens:
        try:
            if req_roles:  # There are endpoints with no requirements
                roles = providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles(
                    character_id=token.character_id,
                    token=token
                ).result(
                    use_etag=False
                )

                has_roles = False

                # do we have the roles.
                for role in roles.roles:
                    if role in req_roles:
                        has_roles = True
                        break

                if has_roles:
                    return token  # return the token
                else:
                    pass  # next! TODO should we flag this character?
            else:
                return token  # no roles check needed return the token
        except TokenError as e:
            #  I've had invalid tokens in auth that refresh but don't actually work
            logger.error(f"Token Error ID: {token.pk} ({e})")

    return None


def get_eve_ids(ids: list | set):
    return set(
        EveName.objects.filter(
            eve_id__in=list(ids)
        ).distinct().values_list(
            'eve_id',
            'name'
        )
    )
