from __future__ import division

from datetime import datetime
from typing import Dict, List, Optional, Union

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
    alliance_id: Optional[int] = None
    alliance_name: Optional[str] = None


class Corporation(Schema):
    corporation_id: int
    corporation_name: str
    alliance_id: Optional[int] = None
    alliance_name: Optional[str] = None


class MenuLink(Schema):
    name: str
    link: str


class MenuCategory(Schema):
    name: str
    links: List[MenuLink] = None


class CorpHistory(Schema):
    start: datetime
    corporation: Corporation


class CharacterHistory(Schema):
    character: Character
    history: List[CorpHistory] = None


class EveName(Schema):
    id: int
    name: str
    cat: Optional[str] = None


class CharacterStatus(Schema):
    character: Character
    isk: Optional[float] = None
    sp: Optional[int] = None
    location: Optional[str] = None
    ship: Optional[str] = None
    active: bool
    last_updates: Optional[Dict] = None


class AccountStatus(Schema):
    characters: List[CharacterStatus] = None
    main: Character
    orphan: bool = False


class ValueLabel(Schema):
    value: Union[str, int, float, bool]
    label: str


class CharacterAssetGroups(Schema):
    name: str
    items: List[ValueLabel] = None


class CharacterAssetItem(Schema):
    id: int
    character: Character
    item: EveName
    quantity: int = 0
    location: EveName = None
    expand: bool = None


class CorporationAssetItem(Schema):
    id: int
    item: EveName
    quantity: int = 0
    location: EveName = None
    expand: bool = None


class CharacterClone(Schema):
    name: Optional[str] = None
    location: Optional[EveName] = None
    implants: List[EveName] = None


class CharacterClones(Schema):
    character: Character
    clones: List[CharacterClone] = None
    home: EveName = None
    last_station_change: Optional[datetime] = None
    last_clone_jump: Optional[datetime] = None


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
    current_level: Optional[int] = 0
    current_sp: Optional[int] = 0
    start_sp: int
    end_sp: int
    start: Optional[datetime] = None
    end: Optional[datetime] = None


class CharacterSkills(Schema):
    character: Character
    skills: Optional[List[Skill]] = None
    total_sp: int
    unallocated_sp: int


class SkillHistory(Schema):
    date: datetime
    total_sp: int
    unallocated_sp: int
    sp: int


class CharacterSkillHistory(Schema):
    character: Character
    history: Optional[List[SkillHistory]] = None


class CharacterQueue(Schema):
    character: Character
    queue: Optional[List[CharacterQueueItem]] = None


class CharacterDoctrines(Schema):
    character: Character
    doctrines: dict
    skills: dict


class CharacterNotification(Schema):
    character: Character
    notification_text: str
    notification_type: str
    timestamp: datetime
    is_read: Optional[bool] = None


class CharacterRoles(Schema):
    character: Character
    director: bool
    station_manager: bool
    personnel_manager: bool
    accountant: bool
    titles: Optional[List[EveName]] = None


class CharacterWalletEvent(Schema):
    character: Character
    id: int
    date: datetime
    first_party: EveName
    second_party: EveName
    ref_type: str
    balance: float
    amount: float
    reason: Optional[str] = None


class LoyaltyPoints(Schema):
    character: Character
    corporation: EveName
    amount: int


class CorporationWalletEvent(Schema):
    division: str
    id: int
    date: datetime
    first_party: EveName
    second_party: EveName
    ref_type: str
    balance: float
    amount: float
    reason: Optional[str] = None


class CharacterOrder(Schema):
    character: Character
    date: datetime
    duration: int
    volume_min: Optional[int] = None
    volume_remain: int
    volume_total: int
    item: EveName
    price: float
    escrow: Optional[float] = None
    buy_order: Optional[bool] = None
    location: Optional[EveName] = None


class CharacterMarket(Schema):
    expired: List[CharacterOrder] = None
    active: List[CharacterOrder] = None
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
    services: Optional[List[StructureService]] = None
    location: EveName
    celestial: Optional[str] = None
    fuel_expiry: Optional[datetime] = None
    state: str = None
    state_expiry: Optional[datetime] = None


class FittingItem(Schema):
    type: EveName
    location: str


class CorpStatus(Schema):
    corporation: Corporation
    characters: int
    active: bool
    last_updates: Optional[Dict] = None


class PingStats(Schema):
    members: int
    structures: List[str] = None
