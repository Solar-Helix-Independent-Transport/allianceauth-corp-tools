from typing import List, Optional

from ninja import Field, Form, NinjaAPI

from ... import models
from .. import schema
from ..helpers import get_alts_queryset, get_main_character


class IndustryApiEndpoints:

    tags = ["Industry"]

    def __init__(self, api: NinjaAPI):
        pass
