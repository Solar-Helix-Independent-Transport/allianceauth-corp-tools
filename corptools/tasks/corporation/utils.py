# Standard Library
from functools import wraps
from hashlib import md5
from typing import Union

# Django
from django.core.cache import cache
from django.utils import timezone

# Alliance Auth
from allianceauth.eveonline.models import EveCharacter
from allianceauth.services.hooks import get_extension_logger
from esi.errors import TokenError
from esi.exceptions import (
    HTTPClientError,
    HTTPError,
    HTTPNotModified,
    HTTPServerError,
)
from esi.models import Token

# AA Example App
from corptools.models import CorporationAudit, EveName

from ... import providers

logger = get_extension_logger(__name__)


class NoTokens(Exception):
    pass


def update_corp_audit(update_field: str = ""):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            audit_corp = CorporationAudit.objects.get(
                corporation__corporation_id=args[0]
            )
            try:
                result = function(*args, **kwargs)
                now = timezone.now().isoformat()
                audit_corp.update_timestamps[update_field] = now
                audit_corp.change_timestamps[update_field] = now
                audit_corp.save()
                return result
            except HTTPNotModified:
                logger.info(f"Not modified {function} {args} {kwargs}")
                audit_corp.update_timestamps[update_field] = timezone.now(
                ).isoformat()
                audit_corp.save()
            except HTTPError as e:
                logger.error(f"HTTPError {function} {args} {kwargs} {e}")
            except NoTokens as e:
                logger.error(
                    f"No Token Found For {audit_corp.corporation.corporation_name} - {e}")

            return
        return wrapper
    return decorator


# Directors hold every corp role in game, so they satisfy any role requirement.
DIRECTOR_ROLE = "Director"
ROLES_SCOPE = "esi-characters.read_corporation_roles.v1"
# How long to remember which token last satisfied a corp/scopes/roles lookup.
CORP_TOKEN_CACHE_SECONDS = 60 * 60 * 24


def _corp_token_cache_key(corp_id: int, scopes: list, req_roles) -> str:
    _hash = md5(
        f"{sorted(scopes)}|{sorted(req_roles or [])}".encode()
    ).hexdigest()
    return f"ct:corp_token:{corp_id}:{_hash}"


def _token_has_roles(token: Token, req_roles: list) -> bool:
    roles = providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles(
        character_id=token.character_id,
        token=token
    ).result(
        use_etag=False,
        use_cache=True
    )
    return any(
        role == DIRECTOR_ROLE or role in req_roles
        for role in roles.roles
    )


def get_corp_token(corp_id: int, scopes: list, req_roles: Union[list, None, bool]):
    """
    Helper method to get a token for a specific character from a specific corp with specific scopes, where
    a character has specific in game roles.
    :param corp_id: Corp to filter on.
    :param scopes: array of ESI scope strings required on the token
    :param req_roles: array of roles, one of which is required on the character.
        A Director satisfies any role.
    :return: :class:esi.models.Token or None
    """

    # always add roles scope as a requirement, without mutating the caller's list.
    scopes = list(scopes)
    if ROLES_SCOPE not in scopes:
        scopes.append(ROLES_SCOPE)

    # Find all characters in the corporation known to auth.
    char_ids = EveCharacter.objects.filter(
        corporation_id=corp_id
    ).values('character_id')

    # find all tokens for the corp, with the scopes.
    tokens = Token.objects.filter(
        character_id__in=char_ids
    ).require_scopes(scopes)

    if not req_roles:  # There are endpoints with no requirements
        return tokens.first()

    # Try the token that worked last time first: its roles call is normally
    # served from cache, so the full scan below only runs when it stops
    # qualifying (left corp, lost the role, token removed).
    cache_key = _corp_token_cache_key(corp_id, scopes, req_roles)
    remembered = cache.get(cache_key)
    candidates = list(tokens)
    candidates.sort(key=lambda t: t.pk != remembered)

    for token in candidates:
        try:
            if _token_has_roles(token, req_roles):
                if token.pk != remembered:
                    cache.set(cache_key, token.pk, CORP_TOKEN_CACHE_SECONDS)
                return token
        except TokenError as e:
            #  I've had invalid tokens in auth that refresh but don't actually work
            logger.error(f"Token Error ID: {token.pk} ({e})")
        except (HTTPClientError, HTTPServerError) as e:
            if e.status_code in (420, 429):
                raise  # ESI-wide, not this token - let esi_error_retry back off
            # One bad token mustn't stop us trying the rest; it's always
            # first in the same order, so this used to break the corp module
            # until the token went away.
            logger.warning(
                f"CT: Roles check failed for token {token.pk} ({token.character_id}) "
                f"in corp {corp_id}, trying next: {e}")

    cache.delete(cache_key)
    return None


def get_eve_ids(ids: list | set):
    return set(
        EveName.objects.filter(
            eve_id__in=list(ids)
        ).values_list(
            'eve_id',
            flat=True
        )
    )
