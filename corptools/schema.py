from datetime import datetime
from corptools.models import CorporationAudit
from ninja import Schema, schema
from typing import Optional, List, Dict

from pydantic.errors import DateError


class Message(Schema):
    message: str


class CharacterUpdate(Schema):
    data: str
    updated: datetime


class Character(Schema):
    character_name: str
    character_id: int
    corporation_id: int
    corporation_name: str
    alliance_id: Optional[int]
    alliance_name: Optional[str]


class Corporation(Schema):
    corporation_id: int
    corporation_name: str
    alliance_id: Optional[int]
    alliance_name: Optional[str]


class CharacterStatus(Schema):
    character: Character
    isk: float
    sp: int
    active: bool
    last_updates: Dict = None


class AccountStatus(Schema):
    characters: List[CharacterStatus]
    main: Character


class MenuLink(Schema):
    name: str
    link: str


class MenuCategory(Schema):
    name: str
    links: List[MenuLink]


class CorpHistory(Schema):
    start: datetime
    corporation: Corporation


class CharacterHistory(Schema):
    character: Character
    history: List[CorpHistory] = None
