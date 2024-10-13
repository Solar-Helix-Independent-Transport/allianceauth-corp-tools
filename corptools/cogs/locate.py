import logging

from aadiscordbot.app_settings import get_all_servers
from aadiscordbot.cogs.utils.autocompletes import search_characters
from aadiscordbot.cogs.utils.decorators import (
    has_any_perm, in_channels, sender_has_perm,
)
from discord import option
from discord.embeds import Embed
from discord.ext import commands
from pendulum.datetime import DateTime

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from allianceauth.eveonline.models import EveCharacter
from esi.models import Token

from corptools.models import EveItemType, MapSystem
from corptools.providers import esi

logger = logging.getLogger(__name__)


class Locator(commands.Cog):
    """
    All about users!
    """

    def __init__(self, bot):
        self.bot = bot

    def get_locate_embeds(self, char):
        alts = char.character_ownership.user.character_ownerships.all().select_related('character')

        alt_online = []
        alt_offline = []
        alt_no_token = []
        for alt in alts:
            _alt = {
                "cid": alt.character.character_id,
                "cnm": alt.character.character_name,
                "crpid": alt.character.corporation_id,
                "crpnm": alt.character.corporation_name,
                "last_online": DateTime.min,
                "online": False,
                "ship": "",
                "system": None,
                "lookup": False
            }
            scopes = [
                # Locations
                'esi-location.read_location.v1',
                'esi-location.read_online.v1',
                'esi-location.read_ship_type.v1'
            ]

            t = Token.get_token(alt.character.character_id, scopes)
            if t:
                online = esi.client.Location.get_characters_character_id_online(character_id=alt.character.character_id,
                                                                                token=t.valid_access_token()).result()
                try:
                    _alt['online'] = "**Online**" if online['online'] else "**Offline**"
                except Exception:
                    pass

                try:
                    _alt['last_online'] = online['last_logout']
                except Exception:
                    pass

                location = esi.client.Location.get_characters_character_id_location(character_id=alt.character.character_id,
                                                                                    token=t.valid_access_token()).result()
                _alt['system'] = MapSystem.objects.get(
                    system_id=location['solar_system_id']).name

                ship = esi.client.Location.get_characters_character_id_ship(character_id=alt.character.character_id,
                                                                            token=t.valid_access_token()).result()
                shp, _ = EveItemType.objects.get_or_create_from_esi(
                    ship['ship_type_id'])
                _alt['ship'] = shp
                _alt['lookup'] = True
                if online["online"]:
                    alt_online.append(_alt)
                else:
                    alt_offline.append(_alt)
            else:
                alt_no_token.append(_alt)

        out_embeds = []

        def process_list(header, alt_list):
            embeds = []
            for alt_grp in [alt_list[i:i + 10] for i in range(0, len(alt_list), 10)]:
                altstr = []
                for a in alt_grp:
                    if a['lookup']:
                        altstr.append(f"[{a['cnm']}](https://evewho.com/character/{a['cid']}) "
                                      f"*[ [{a['crpnm']}](https://evewho.com/corporation/{a['crpid']}) ]*: "
                                      f"{a['online']}"
                                      f" in [{a['system']}](https://evemaps.dotlan.net/system/{a['system'].replace(' ', '_')})"
                                      f"\n ```Currently in a {a['ship']}"
                                      f" Last Online: {a['last_online'].strftime('%Y-%m-%d %H:%M')}```")
                    else:
                        altstr.append(f"[{a['cnm']}](https://evewho.com/character/{a['cid']}) "
                                      f"*[ [{a['crpnm']}](https://evewho.com/corporation/{a['crpid']}) ]*: "
                                      f"Unknown No Tokens"
                                      f"")

                e = Embed(title=header)
                e.description = "\n".join(altstr)
                embeds.append(e)
            return embeds
        if len(alt_online):
            out_embeds += process_list("Online", alt_online)
        if len(alt_offline):
            out_embeds += process_list("Offline", alt_offline)
        if len(alt_no_token):
            out_embeds += process_list("No Tokens", alt_no_token)
        return out_embeds

    @commands.command(pass_context=True)
    @sender_has_perm('corputils.view_alliance_corpstats')
    async def locate(self, ctx):
        """
        Gets Auth data about a character
        Input: a Eve Character Name
        """
        if ctx.message.channel.id not in settings.ADMIN_DISCORD_BOT_CHANNELS:
            return await ctx.message.add_reaction(chr(0x1F44E))

        input_name = ctx.message.content[8:]

        try:
            char = EveCharacter.objects.get(character_name=input_name)
            try:
                main = char.character_ownership.user.profile.main_character
                try:
                    discord_string = "<@{}>".format(
                        char.character_ownership.user.discord.uid)
                except Exception as e:
                    logger.error(e)
                    discord_string = "unknown"

                await ctx.message.reply(f"Looing up the location of all known alts of {main} ({discord_string})\nPlease Wait...")

                embeds = self.get_locate_embeds(char)
                for e in embeds:
                    await ctx.message.reply(embed=e)
            except ObjectDoesNotExist:
                return await ctx.message.reply(f"Character **{input_name}** Unlinked in auth")
        except EveCharacter.DoesNotExist:
            return await ctx.message.reply(f"Character **{input_name}** does not exist in our Auth system")

    @commands.slash_command(name='locate', guild_ids=get_all_servers())
    @option("character", description="Search for a Character!", autocomplete=search_characters)
    async def slash_locate(self, ctx, character: str,):
        try:
            in_channels(ctx.channel.id, settings.ADMIN_DISCORD_BOT_CHANNELS)
            has_any_perm(ctx.author.id, [
                         'corputils.view_alliance_corpstats', 'corpstats.view_alliance_corpstats'])

            try:
                char = EveCharacter.objects.get(character_name=character)
                try:
                    main = char.character_ownership.user.profile.main_character
                    try:
                        discord_string = "<@{}>".format(
                            char.character_ownership.user.discord.uid)
                    except Exception as e:
                        logger.error(e)
                        discord_string = "unknown"

                    await ctx.respond(f"Looing up the location of all known alts of {main} ({discord_string})\nPlease Wait...")

                    embeds = self.get_locate_embeds(char)

                    for e in embeds:
                        await ctx.respond(embed=e)
                except ObjectDoesNotExist:
                    return await ctx.respond(f"Character **{character}** Unlinked in auth")
            except EveCharacter.DoesNotExist:
                return await ctx.respond(f"Character **{character}** does not exist in our Auth system")
        except commands.MissingPermissions as e:
            return await ctx.respond(e.missing_permissions[0], ephemeral=True)


def setup(bot):
    bot.add_cog(Locator(bot))
