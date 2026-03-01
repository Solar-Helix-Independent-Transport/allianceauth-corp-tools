from ninja import NinjaAPI
from ninja.security import django_auth

from django.conf import settings

from allianceauth.services.hooks import get_extension_logger

from . import character, core, corporation, extras

logger = get_extension_logger(__name__)

api = NinjaAPI(title="CorpTools API", version="0.0.1",
               urls_namespace='corptools:new_api', auth=django_auth,
               openapi_url=settings.DEBUG and "/openapi.json" or "")

# Add the core endpoints
core.setup(api)

# Add the character endpoints
character.setup(api)

# Add the corp endpoints
corporation.setup(api)

# Add the extra endpoints
extras.setup(api)

# Done?
