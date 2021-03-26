from django.conf import settings
import re

CORPTOOLS_DISCORD_BOT_COGS = getattr(settings, 'CORPTOOLS_DISCORD_BOT_COGS', ["corptools.cogs.routes"])
