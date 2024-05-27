from ninja import NinjaAPI

from django.db.models import Q

from allianceauth.services.hooks import get_extension_logger

from corptools import models
from corptools.api import schema

logger = get_extension_logger(__name__)


class AssetPingApiEndpoints:

    tags = ["Pinger"]

    def __init__(self, api: NinjaAPI):
        def build_ping_list(systems, structures, ignore_groups, message, filter_charges=False, ships_only=False, capitals_only=False):
            pingers = {}
            ammo_exclusions_cat = [8]
            filter_charges = True
            assets = models.CharacterAsset.objects.filter(
                Q(location_name_id__in=systems + structures) | Q(location_name__system_id__in=systems + structures)
            ).exclude(
                type_name__group_id__in=ignore_groups
            ).select_related(
                'type_name',
                'character',
                'character__character',
                'character__character__character_ownership',
                'character__character__character_ownership__user',
                'character__character__character_ownership__user__discord',
                'character__character__character_ownership__user__profile__main_character',
                'location_name'
            ).order_by("-type_name__volume"
                       )

            if filter_charges:
                assets = assets.exclude(
                    type_name__group__category_id__in=ammo_exclusions_cat)

            if ships_only:
                assets = assets.filter(
                    type_name__group__category_id__in=[6]
                )

            if capitals_only:
                assets = assets.filter(
                    type_name__group_id__in=[
                        30, 485, 513, 547, 659, 883, 902, 1538]
                )

            for a in assets:
                try:
                    uid = a.character.character.character_ownership.user.discord.uid
                    char = a.character.character.character_name
                    main = a.character.character.character_ownership.user.profile.main_character.character_name
                    if uid not in pingers:
                        pingers[uid] = {"c": set(), "a": list(),
                                        "s": set(), "m": main}
                    if char not in pingers[uid]:
                        pingers[uid]["c"].add(char)
                    if a.type_name.name not in pingers[uid]["a"]:
                        pingers[uid]["a"].append(a.type_name.name)
                    pingers[uid]["s"].add(a.location_name.location_name)
                except Exception:
                    pass

            return pingers

        @api.post(
            "pingbot/assets/send",
            response={200: schema.Message, 403: str},
            tags=self.tags
        )
        def post_send_pings_assets(request, message: str, systems: str = "", structures: str = "", ignore_groups: str = "", filter_charges: bool = False, ships_only: bool = False, capitals_only: bool = False):
            if not request.user.is_superuser:
                return 403, "Hard no pall!"

            from aadiscordbot.tasks import send_message
            from discord import Embed

            systems = systems.split(",") if len(systems) else []
            structures = structures.split(",") if len(structures) else []
            ignore_groups = ignore_groups.split(
                ",") if len(ignore_groups) else []
            pingers = build_ping_list(
                systems, structures, ignore_groups, message, filter_charges, ships_only, capitals_only)

            for id, chars in pingers.items():
                embed = Embed(title="Asset Alert!")
                embed.description = message.replace("\\n", "\n")
                _ = embed.add_field(name="Characters",
                                    value=", ".join(list(chars['c'])),
                                    inline=False)
                _ = embed.add_field(name="Structures",
                                    value=", ".join(list(chars['s'])),
                                    inline=False)
                _ = embed.add_field(name="Assets",
                                    value=", ".join(list(chars['a'])[:20]),
                                    inline=False)
                send_message(user_id=id, embed=embed)

            return 200, {"message": "Pings Sent!"}

        @api.post(
            "pingbot/assets/counts",
            response={200: schema.PingStats, 403: str},
            tags=self.tags
        )
        def post_test_pings_assets(request, systems: str = "", structures: str = "", ignore_groups: str = "", filter_charges: bool = False, ships_only: bool = False, capitals_only: bool = False):
            if not request.user.is_superuser:
                return 403, "Hard no pall!"

            systems = systems.split(",") if len(systems) else []
            structures = structures.split(",") if len(structures) else []
            ignore_groups = ignore_groups.split(
                ",") if len(ignore_groups) else []
            pingers = build_ping_list(
                systems, structures, ignore_groups, "", filter_charges, ships_only, capitals_only)

            locations = set()

            for id, chars in pingers.items():
                locations.update(list(chars['s']))

            locations = list(locations)
            locations.sort()

            return 200, {"members": len(pingers), "structures": locations}
