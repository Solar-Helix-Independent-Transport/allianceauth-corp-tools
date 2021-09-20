from datetime import datetime
from ninja import Schema

from typing import Optional, List, Dict


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


class EveName(Schema):
    id: int
    name: str
    cat: Optional[str]


class ValueLabel(Schema):
    value: str
    label: str


class CharacterAssetGroups(Schema):
    name: str
    items: List[ValueLabel]


class CharacterClone(Schema):
    name: Optional[str]
    location: Optional[EveName]
    implants: List[EveName] = None


class CharacterClones(Schema):
    character: Character
    clones: List[CharacterClone] = None
    home: EveName = None
    last_station_change: Optional[datetime]
    last_clone_jump: Optional[datetime]


class CharacterSkill(Schema):
    character: Character
    group: str
    skill: EveName
    level: int


class CharacterQueueItem(Schema):
    character: Character
    skill: EveName
    level: int
    end: datetime


class CharacterRoles(Schema):
    character: Character
    director: bool
    station_manager: bool
    personnel_manager: bool
    accountant: bool
    titles: List[EveName]


class CharacterWalletEvent(Schema):
    character: Character
    id: int
    date: datetime
    first_party: EveName
    second_party: EveName
    ref_type: str
    amount: float
    balance: float
    reason: str


class Contact(Schema):
    character: Character
    contact: EveName
    standing: float
    labels: List[ValueLabel] = None
