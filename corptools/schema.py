from datetime import datetime
from ninja import Schema
from typing import Optional, List


class Message(Schema):
    message: str


class CharacterUpdate(Schema):
    data: str
    updated: datetime


class CharacterStatus(Schema):
    character_name: str
    character_id: int
    corporation_id: int
    corporation_name: str
    alliance_id: Optional[int]
    alliance_name: Optional[str]
    isk: float
    active: bool
    last_updates: List[CharacterUpdate] = None
