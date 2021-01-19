# Cog Stuff
from discord.ext import commands
from discord.embeds import Embed
from discord.colour import Color
# AA Contexts
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from corptools.models import MapSystem
from corptools.providers import routes
import logging
import json

import traceback
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
        path_str = " > ".join(message.get('path').values())
            
        dotlan_url = "https://evemaps.dotlan.net/route/{}".format(message.get("dotlan"))
        embed = Embed(title=f"{start.name} to {end.name}")
        embed.colour = Color.blue()
        embed.description = "Shortest Route is: {} Jumps\n\n{}".format(message.get("length"), path_str)
        embed.add_field(
            name="Dotlan", value=f"[Route Link]({dotlan_url})"
        )

        return await ctx.send(embed=embed)


def setup(bot):
    bot.add_cog(Routes(bot))
