from ninja import NinjaAPI

from django.utils.translation import gettext as _

from allianceauth.eveonline.tasks import (
    update_character as eve_character_update,
)

from corptools import app_settings, models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character
from corptools.tasks import character


class RefreshApiEndpoints:

    tags = ["Characters"]

    def __init__(self, api: NinjaAPI):

        @api.post(
            "characters/refresh",
            response={200: schema.Message, 403: str},
            tags=self.tags
        )
        def post_characters_refresh(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            audits_visible = models.CharacterAudit.objects.visible_to(
                request.user).values_list('character_id', flat=True)
            if character_id in audits_visible:
                character.update_character.apply_async(args=[character_id], kwargs={
                    "force_refresh": True}, priority=4)
            return 200, {"message": "Requested Update!"}

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

            for cid in characters.values_list('character_id', flat=True):
                character.update_character.apply_async(
                    args=[cid], kwargs={"force_refresh": force}, priority=4)
                eve_character_update.apply_async(
                    args=[cid], priority=4)
            return 200, {"message": "Requested Updates!"}
