from typing import List

from ninja import NinjaAPI

from corptools import models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character
from corptools.task_helpers.char_tasks import update_character_mail_body


class InteractionApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/contacts",
            response={200: List[schema.Contact], 403: str},
            tags=self.tags
        )
        def get_character_contacts(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, "Permission Denied"

            characters = get_alts_queryset(main)

            contacts = models.CharacterContact.objects\
                .filter(character__character__in=characters)\
                .select_related('character__character', 'contact_name') \
                .prefetch_related('labels')

            output = []

            for c in contacts:
                labels = []
                for l in c.labels.all():
                    labels.append({
                        "value": l.label_id,
                        "label": l.label_name
                    })
                output.append({
                    "character": c.character.character,
                    "contact": {
                        "id": c.contact_id,
                        "name": c.contact_name.name,
                        "cat": c.contact_type
                    },
                    "standing": c.standing,
                    "labels": labels,
                    "blocked": c.blocked,
                    "watched": c.watched,

                })

            return output

        @api.get(
            "account/{character_id}/mail",
            response={200: List, 403: str},
            tags=self.tags
        )
        def get_character_mail(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, "Permission Denied"

            characters = get_alts_queryset(main)

            mail = models.MailMessage.objects\
                .filter(character__character__in=characters)\
                .select_related('character__character', 'from_name')\
                .prefetch_related("labels", "recipients").order_by("-timestamp")

            output = []

            for m in mail:

                _r = []
                for r in m.recipients.all():
                    if r.recipient_name:
                        _r.append(f"{r.recipient_name.name}")
                    else:
                        _r.append(f"{r.recipient_id} ({r.recipient_type})")

                _l = []
                _from_ret = m.from_name.name if m.from_name else m.from_id
                for l in m.labels.all():
                    _l.append(l.label_name if l.label_name else l.label_id)

                _m = {
                    "character": m.character.character.character_name,
                    "character_id": m.character.character.character_id,
                    "mail_id": m.mail_id,
                    "subject": m.subject,
                    "from": f"{_from_ret}",
                    "recipients": _r,
                    "labels": _l,
                    "timestamp": m.timestamp

                }

                output.append(_m)

            return output

        @api.get(
            "account/{character_id}/mail/{mail_id}",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_mail_message_requesst(request, character_id: int, mail_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, "Permission Denied"

            msg = models.MailMessage.objects.get(
                character__character__character_id=character_id, mail_id=mail_id)

            if not msg.body:
                try:
                    msg = update_character_mail_body(
                        character_id=character_id, mail_message=msg)
                    msg.save()
                except Exception as e:
                    logger.error("failed to fetch mail")
            return 200, {"body": msg.body.replace("size=", "_size_=").replace("color=", "_color_=")}

        @api.get(
            "account/{character_id}/notifications",
            response={200: List[schema.CharacterNotification], 403: str},
            tags=self.tags
        )
        def get_character_notifications(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, "Permission Denied"

            characters = get_alts_queryset(main)

            notes = models.Notification.objects\
                .filter(character__character__in=characters)\
                .select_related('character__character', 'notification_text').order_by('-timestamp')[:5000]

            output = []

            for n in notes:
                output.append({
                    "character": n.character.character,
                    "notification_text": n.notification_text.notification_text,
                    "notification_type": n.notification_type,
                    "timestamp": n.timestamp,
                    "is_read": n.is_read,
                })

            return output
