import logging

from discord.colour import Color
from discord.embeds import Embed
from discord.ext import commands

from corptools.models import MapJumpBridge, MapSystem
from corptools.providers import routes

logger = logging.getLogger(__name__)


class Routes(commands.Cog):
    """
    Route!
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(pass_context=True)
    async def route(self, ctx):
        """
        Find route in eve with JB's
        """
        input_names = ctx.message.content[7:].split(":")
        start = MapSystem.objects.get(name=input_names[0])
        end = MapSystem.objects.get(name=input_names[1])

        message = routes.route(start.system_id, end.system_id)

        dotlan_url = "https://evemaps.dotlan.net/route/{}".format(
            message.get("dotlan"))
        embed = Embed(title=f"{start.name} to {end.name}")
        embed.colour = Color.blue()
        embed.description = "Shortest Route is: {} Jumps\n\n{}".format(
            message.get("length"), message.get("path_message"))
        embed.add_field(
            name="Dotlan", value=f"[Route Link]({dotlan_url})"
        )

        return await ctx.send(embed=embed)

    @commands.command(pass_context=True)
    async def jumpbridges(self, ctx):
        """
        List all known Jumpbridges's
        """

        embed = Embed(title="Known Jump Bridges")
        embed.colour = Color.blue()
        embed.description = "These do not auto populate. Please advise admins of ommisions/errors!\n\n"

        jbs = MapJumpBridge.objects.all().select_related(
            'from_solar_system', 'to_solar_system', 'owner')
        for jb in jbs:
            embed.description += f"`{jb.from_solar_system.name}` > `{jb.to_solar_system}` [{jb.owner.name}]\n"
        return await ctx.send(embed=embed)


def setup(bot):
    bot.add_cog(Routes(bot))
