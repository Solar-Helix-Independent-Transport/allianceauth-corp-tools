import logging

from allianceauth.eveonline.models import EveCharacter
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import QuerySet
from ninja import Field, Schema
from ninja.pagination import LimitOffsetPagination
from ninja.types import DictStrAny

from .. import app_settings, models

logger = logging.getLogger(__name__)


class Paginator(LimitOffsetPagination):
    class Input(Schema):
        limit: int = Field(app_settings.CT_PAGINATION_SIZE, ge=1)
        offset: int = Field(0, ge=0)

    def paginate_queryset(
        self,
        queryset: QuerySet,
        pagination: Input,
        **params: DictStrAny,
    ) -> any:
        offset = pagination.offset
        limit: int = pagination.limit
        return {
            "items": queryset[offset: offset + limit],
            "count": self._items_count(queryset),
        }  # noqa: E203


def get_main_character(request, character_id):
    perms = True
    main_char = EveCharacter.objects\
        .select_related('character_ownership', 'character_ownership__user__profile', 'character_ownership__user__profile__main_character', )\
        .get(character_id=character_id)
    try:
        main_char = main_char.character_ownership.user.profile.main_character
    except (ObjectDoesNotExist):
        pass

    # check access
    visible = models.CharacterAudit.objects.visible_eve_characters(
        request.user)
    if main_char not in visible:
        account_chars = request.user.profile.main_character.character_ownership.user.character_ownerships.all(
        )
        logger.warning(
            f"{request.user} Can See {list(visible)}, requested {main_char.id}")
        if main_char in account_chars:
            pass
        else:
            perms = False

    if not request.user.has_perm('corptools.view_characteraudit'):
        logger.warning(
            f"{request.user} does not have Perm requested, Requested {main_char.id}")
        perms = False

    return perms, main_char


def get_alts_queryset(main_char):
    try:
        linked_characters = main_char.character_ownership.user.character_ownerships.all(
        ).values_list('character_id', flat=True)

        return EveCharacter.objects.filter(id__in=linked_characters)
    except ObjectDoesNotExist:
        return EveCharacter.objects.filter(pk=main_char.pk)


def round_or_null(value, digits=2):
    if value:
        return round(value, digits)
    else:
        return value
