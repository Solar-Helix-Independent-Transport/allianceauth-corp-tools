from django.conf import settings
import re

CORPTOOLS_DISCORD_BOT_COGS = getattr(settings, 'CORPTOOLS_DISCORD_BOT_COGS', ["corptools.cogs.routes"])

CT_CHAR_ASSETS_MODULE = getattr(settings, 'CT_CHAR_ASSETS_MODULE', True)
CT_CHAR_STANDINGS_MODULE = getattr(settings, 'CT_CHAR_STANDINGS_MODULE', True)
CT_CHAR_KILLMAILS_MODULE = getattr(settings, 'CT_CHAR_KILLMAILS_MODULE', True)
CT_CHAR_FITTINGS_MODULE = getattr(settings, 'CT_CHAR_FITTINGS_MODULE', True)
CT_CHAR_CALLENDAR_MODULE = getattr(settings, 'CT_CHAR_CALLENDAR_MODULE', True)
CT_CHAR_CONTACTS_MODULE = getattr(settings, 'CT_CHAR_CONTACTS_MODULE', True)
CT_CHAR_NOTIFICATIONS_MODULE = getattr(settings, 'CT_CHAR_NOTIFICATIONS_MODULE', True)
CT_CHAR_ROLES_MODULE = getattr(settings, 'CT_CHAR_ROLES_MODULE', True)
CT_CHAR_INDUSTRY_MODULE = getattr(settings, 'CT_CHAR_INDUSTRY_MODULE', True)
CT_CHAR_MINING_MODULE = getattr(settings, 'CT_CHAR_MINING_MODULE', True)
CT_CHAR_WALLET_MODULE = getattr(settings, 'CT_CHAR_WALLET_MODULE', True)
CT_CHAR_SKILLS_MODULE = getattr(settings, 'CT_CHAR_SKILLS_MODULE', True)
CT_CHAR_CLONES_MODULE = getattr(settings, 'CT_CHAR_CLONES_MODULE', True)
CT_CHAR_LOCATIONS_MODULE = getattr(settings, 'CT_CHAR_LOCATIONS_MODULE', True)
CT_CHAR_MAIL_MODULE = getattr(settings, 'CT_CHAR_MAIL_MODULE', False)

