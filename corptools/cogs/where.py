import logging

from aadiscordbot.app_settings import get_all_servers
from aadiscordbot.cogs.utils.decorators import has_any_perm
from aadiscordbot.utils.auth import get_auth_user
from discord import AutocompleteContext, option
from discord.embeds import Embed
from discord.ext import commands

from django.db.models import Q
from django.db.models.functions import Length

from allianceauth.services.modules.discord.models import DiscordUser

from corptools.models import CharacterAsset, EveItemType, MapSystem

logger = logging.getLogger(__name__)


class WhereStuff(commands.Cog):
    """
    Help me find my stuff without logging in every single character!
    """

    def __init__(self, bot):
        self.bot = bot

    async def search_items(ctx: AutocompleteContext):
        """Returns a list of items that begin with the characters entered so far."""
        return [
            a async for a in EveItemType.objects.filter(
                name__icontains=ctx.value
            ).order_by(
                Length('name').asc()
            ).values_list(
                'name',
                flat=True
            ).distinct()[:10]
        ]

    async def search_systems(ctx: AutocompleteContext):
        """Returns a list of systems that begin with the characters entered so far."""

        return [
            a async for a in MapSystem.objects.filter(
                name__icontains=ctx.value
            ).values_list(
                'name',
                flat=True
            ).distinct()[:10]
        ]

    @commands.slash_command(name='where_is', guild_ids=get_all_servers())
    @option("system", description="Search in this System!", autocomplete=search_systems)
    @option("item", description="Search for this Item!", autocomplete=search_items)
    async def slash_where_is(
        self,
        ctx,
        item: str,
        system: str = None
    ):
        await ctx.defer(ephemeral=True)
        try:
            has_any_perm(
                ctx.author.id,
                ['corptools.view_characteraudit'],
                ctx.guild
            )

            try:
                du = get_auth_user(ctx.author, guild=ctx.guild)
                chars = du.character_ownerships.all(
                ).values_list(
                    "character__character_id",
                    flat=True
                )
                try:
                    items = CharacterAsset.objects.filter(
                        character__character__character_id__in=chars,
                        type_name__name=item,
                        location_name__isnull=False
                    )
                    if system:
                        items = items.filter(
                            Q(location_name__location_name=system) | Q(location_name__system__name=system))
                    if not items.aexists():
                        return await ctx.respond("Found no items. Do you actually have some?", ephemeral=True)
                    output = {}
                    async for i in items:
                        cn = i.character.character.character_name
                        if cn not in output:
                            output[cn] = set()
                        output[cn].add(f"{i.location_name.location_name}")

                    e = Embed(title=f"{item} Search")

                    msg = f"Found the following {item}'s"

                    if system:
                        msg += f" in {system}"

                    msg += "\n"

                    for c, i in output.items():
                        m = f"\n**{c}**"
                        for cl in i:
                            m += f"\n- {cl}"
                        msg += m

                    msg += "\n"
                    e.description = msg
                    await ctx.respond(embed=e, ephemeral=True)
                except Exception as e:
                    return await ctx.respond(f"An error ocurred {e}", ephemeral=True)
            except DiscordUser.DoesNotExist:
                return await ctx.respond("Who are you? Have you linked your discord on auth?", ephemeral=True)
        except commands.MissingPermissions as e:
            return await ctx.respond(e.missing_permissions[0], ephemeral=True)


def setup(bot):
    bot.add_cog(WhereStuff(bot))
