# Cog Stuff
import logging

from aadiscordbot.app_settings import aastatistics_active
# AA-Discordbot
from aadiscordbot.cogs.utils.decorators import (has_any_perm, in_channels,
                                                sender_has_perm)
from allianceauth.eveonline.evelinks import evewho
from allianceauth.eveonline.models import EveCharacter
from discord import AutocompleteContext, option
from discord.colour import Color
from discord.embeds import Embed
from discord.ext import commands
# AA Contexts
from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from esi.models import Token
from pendulum.datetime import DateTime

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

        alt_list = []
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
                except:
                    pass

                try:
                    _alt['last_online'] = online['last_logout']
                except:
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
            alt_list.append(_alt)
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

            e = Embed()
            e.description = "\n".join(altstr)
            embeds.append(e)
        return embeds

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

    async def search_characters(ctx: AutocompleteContext):
        """Returns a list of colors that begin with the characters entered so far."""
        return list(EveCharacter.objects.filter(character_name__icontains=ctx.value).values_list('character_name', flat=True)[:10])

    @commands.slash_command(name='locate', guild_ids=[int(settings.DISCORD_GUILD_ID)])
    @option("character", description="Search for a Character!", autocomplete=search_characters)
    async def slash_locate(
        self,
        ctx,
        character: str,
    ):
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
                    return await ctx.respond(f"Character **{input_name}** Unlinked in auth")
            except EveCharacter.DoesNotExist:
                return await ctx.respond(f"Character **{input_name}** does not exist in our Auth system")
        except commands.MissingPermissions as e:
            return await ctx.respond(e.missing_permissions[0], ephemeral=True)


def setup(bot):
    bot.add_cog(Locator(bot))
