from datetime import date, datetime
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
    isk: Optional[float]
    sp: Optional[int]
    active: bool
    last_updates: Optional[Dict]


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


class CharacterAssetItem(Schema):
    character: Character
    item: EveName
    location: EveName = None


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


class Skill(Schema):
    group: str
    skill: str
    sp: int
    level: int
    active: int


class CharacterQueueItem(Schema):
    skill: str
    group: str
    end_level: int
    start_sp: int
    end_sp: int
    start: datetime = None
    end: datetime = None


class DoctrineCheck(Schema):
    name: str
    achieved: str
    achieved: bool


class CharacterSkills(Schema):
    character: Character
    skills: List[Skill]
    total_sp: int
    unallocated_sp: int


class CharacterQueue(Schema):
    character: Character
    queue: List[CharacterQueueItem]


class CharacterDoctrines(Schema):
    character: Character
    queue: List[DoctrineCheck]


class CharacterNotification(Schema):
    character: Character
    notification_text: str
    notification_type: str
    timestamp: datetime
    is_read: bool = None


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
    balance: float
    amount: float
    reason: str


class CharacterOrder(Schema):
    character: Character
    date: datetime
    duration: int
    volume_min: int = None
    volume_remain: int
    volume_total: int
    item: EveName
    price: float
    escrow: float = None
    buy_order: bool = None
    location: EveName


class Contact(Schema):
    character: Character
    contact: EveName
    standing: float
    labels: List[ValueLabel] = None
