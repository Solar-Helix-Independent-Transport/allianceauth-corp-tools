import logging

from django.conf import settings
from ninja import Field, Form, NinjaAPI
from ninja.security import django_auth

from . import character, core, corporation, extras

logger = logging.getLogger(__name__)

api = NinjaAPI(title="CorpTools API", version="0.0.1",
               urls_namespace='corptools:new_api', auth=django_auth, csrf=True,
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
