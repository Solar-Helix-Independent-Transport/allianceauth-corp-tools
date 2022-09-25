from __future__ import division

from datetime import datetime
from typing import Dict, List, Optional
from xmlrpc.client import Boolean, boolean

from ninja import Schema


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
    orphan: Boolean = False


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
    id: int
    character: Character
    item: EveName
    quantity: int = 0
    location: EveName = None
    expand: boolean = None


class CorporationAssetItem(Schema):
    id: int
    item: EveName
    quantity: int = 0
    location: EveName = None
    expand: boolean = None


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
    position: int
    current_level: int = 0
    current_sp: int = 0
    start_sp: int
    end_sp: int
    start: datetime = None
    end: datetime = None


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
    doctrines: dict
    skills: dict


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


class CorporationWalletEvent(Schema):
    division: str
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
    location: Optional[EveName]


class CharacterMarket(Schema):
    expired: List[CharacterOrder]
    active: List[CharacterOrder]
    total_active: int
    total_expired: int


class Contact(Schema):
    character: Character
    contact: EveName
    standing: float
    labels: List[ValueLabel] = None
    blocked: bool
    watched: bool


class StructureService(Schema):
    name: str
    state: str


class Structure(Schema):
    id: int
    owner: Corporation
    name: str
    type: EveName
    services: Optional[List[StructureService]]
    location: EveName
    celestial: Optional[str]
    fuel_expiry: Optional[datetime]
    state: str = None
    state_expiry: Optional[datetime]


class FittingItem(Schema):
    type: EveName
    location: str


class CorpStatus(Schema):
    corporation: Corporation
    characters: int
    active: bool
    last_updates: Optional[Dict]


class PingStats(Schema):
    members: int
    structures: List[str]
