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
    link: str = None


class MenuCategory(MenuLink):
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
    cat_id: Optional[int] = None


class SolarSystem(Schema):
    system: EveName
    constellation: EveName
    region: EveName
    security_status: Optional[float] = None


class EveLocation(EveName):
    solar_system: Optional[SolarSystem] = None


class CharacterStatus(Schema):
    character: Character
    isk: Optional[float] = None
    sp: Optional[int] = None
    location: Optional[str] = None
    ship: Optional[str] = None
    ship_name: Optional[str] = None
    active: bool
    last_logoff: Optional[datetime] = None
    last_login: Optional[datetime] = None
    total_logins: Optional[int] = None
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


class AssetItem(Schema):
    id: int
    item: EveName
    quantity: int = 0
    location: Optional[EveLocation] = None
    expand: Optional[bool] = None


class CharacterAssetItem(AssetItem):
    character: Character


class CharacterClone(Schema):
    name: Optional[str] = None
    location: Optional[EveName] = None
    implants: List[EveName] = None


class CharacterClones(Schema):
    character: Character
    clones: List[CharacterClone] = None
    home: Optional[EveName] = None
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
    own_account: Optional[bool] = True
    reason: Optional[str] = None
    description: Optional[str] = None


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


class ContractItems(Schema):
    is_included: bool
    is_singleton: bool
    quantity: Optional[int] = None
    raw_quantity: Optional[int] = None
    record_id: int
    type_name: str


class CharacterContract(Schema):
    character: Union[str, Character]
    id: Optional[int] = None
    contract: Optional[int] = None
    items: Optional[List[ContractItems]] = []
    contract_type: str
    availbility: Optional[str] = None
    title: Optional[str] = None

    acceptor: Optional[str] = None
    assignee: Optional[str] = None
    issuer: Optional[str] = None

    issuer_corporation_id: Optional[str] = None

    days_to_complete: int
    collateral: float
    buyout: float
    price: float
    reward: float
    volume: float
    status: str

    start_location_id: Optional[int] = None
    end_location_id: Optional[int] = None

    start_location: Optional[EveName] = None
    end_location: Optional[EveName] = None

    for_corporation: bool
    own_account: Optional[bool] = False

    date_accepted: Optional[datetime] = None
    date_completed: Optional[datetime] = None
    date_expired: Optional[datetime] = None
    date_issued: Optional[datetime] = None


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
    total_active: float
    total_expired: float


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
    constellation: Optional[EveName] = None
    region: Optional[EveName] = None
    celestial: Optional[str] = None
    fuel_expiry: Optional[datetime] = None
    state: str = None
    state_expiry: Optional[datetime] = None


class OreValue(Schema):
    type: EveName
    quantity: int
    value: float


class Metenox(Schema):
    structure: Structure
    contents: List[OreValue]
    total: int


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
