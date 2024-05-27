from datetime import timedelta

import yaml
from ninja import NinjaAPI

from django.utils import timezone

from ... import models


class CloneDeathApiEndpoints:
    tags = ["Extras"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "/extras/clone_death/{location_id}/{look_back}/",
            response={200: dict, 403: str, 404: str, 500: str},
            tags=self.tags
        )
        def get_dead_clones_in_location(request, location_id: int, look_back: int):
            """
                Find Dead Clones :pepewhy:
            """
            if not request.user.is_superuser:
                return 403, {"message": "Hard no pall!"}

            out = {"m": {}, "i": {}}
            since = timezone.now() - timedelta(hours=look_back)

            notes = models.Notification.objects.filter(
                notification_type="JumpCloneDeletedMsg1", timestamp__gte=since)

            for n in notes:
                ny = yaml.load(
                    n.notification_text.notification_text, Loader=yaml.UnsafeLoader)
                if len(ny["typeIDs"]) and ny['locationID'] == location_id:
                    try:
                        mc = n.character.character.character_ownership.user.profile.main_character.character_name
                    except Exception:
                        continue
                    cc = n.character.character.character_name
                    if mc not in out["m"]:
                        out["m"][mc] = {"c": [], "i": {}}
                    if cc not in out["m"][mc]["c"]:
                        out["m"][mc]["c"].append(cc)
                    for ti in ny["typeIDs"]:
                        nm = models.EveItemType.objects.get(type_id=ti).name
                        if ti not in out["m"][mc]["i"]:
                            out["m"][mc]["i"][ti] = {"c": 0, "n": nm}
                        out["m"][mc]["i"][ti]["c"] += 1
                        if ti not in out["i"]:
                            out["i"][ti] = {"c": 0, "n": nm}
                        out["i"][ti]["c"] += 1

            return out
