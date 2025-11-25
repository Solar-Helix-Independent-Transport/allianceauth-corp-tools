import logging

from ninja import NinjaAPI

from django.core.cache import cache
from django.utils.translation import gettext as _

from allianceauth.eveonline.tasks import (
    update_character as eve_character_update,
)

from corptools import app_settings, models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character
from corptools.tasks import character

logger = logging.getLogger(__name__)


class RefreshApiEndpoints:

    tags = ["Characters"]

    def __init__(self, api: NinjaAPI):

        @api.post(
            "characters/refresh",
            response={200: schema.Message, 304: str, 403: str, 404: str},
            tags=self.tags
        )
        def post_characters_refresh(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            # and not request.user.is_superuser:
            if cache.get(f"refresh-block-{character_id}", False):
                logger.error(
                    f"GO AWAY! Already Requested! {character_id} {request.user.username}")
                return 200, {"message": "GO AWAY! Already Requested!"}

            characters = get_alts_queryset(main)
            if character_id in characters.values_list('character_id', flat=True):
                character.update_char_assets.apply_async(
                    args=[character_id],
                    kwargs={
                        "force_refresh": True
                    },
                    priority=4)
                cache.set(f"refresh-block-{character_id}", 1, 60*5)
                return 200, {"message": "Requested Update!"}
            return 404, "Not Found!"

        @api.post(
            "account/refresh",
            response={200: schema.Message, 403: str},
            tags=self.tags
        )
        def post_account_refresh(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            force = app_settings.CT_USERS_CAN_FORCE_REFRESH or request.user.is_superuser

            # and not request.user.is_superuser:
            if cache.get(f"refresh-block-account-{character_id}", False):
                logger.error(
                    f"GO AWAY! Already Requested! {character_id} {request.user.username}")
                return 200, {"message": "GO AWAY! Already Requested!"}

            for cid in set(list(characters.values_list('character_id', flat=True))):
                character.update_character.apply_async(
                    args=[cid],
                    kwargs={
                        "force_refresh": force
                    },
                    priority=4)
                cache.set(f"refresh-block-account-{character_id}", 1, 60*30)
                eve_character_update.apply_async(
                    args=[cid], priority=4)
            return 200, {"message": "Requested Updates!"}
