# Standard Library
from datetime import datetime
from decimal import Decimal
from typing import Dict, List, Optional, Union

# Third Party
from ninja import Field, Schema


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


class CharacterMercenaryDen(Schema):
    character: Character
    den_id: int
    planet: EveName
    type: EveName
    state: str
    development_amount: int
    development_level: str
    anarchy_amount: int
    anarchy_level: str
    infomorph_amount: int
    reinforcement_end: Optional[datetime] = None


class CharacterMercenaryTacticalOperation(Schema):
    character: Character
    operation_id: str
    mercenary_den_id: int
    dungeon_type_id: int
    state: str
    expires: Optional[datetime] = None


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
    queue: dict


class CharacterMail(Schema):
    character: str
    character_id: int
    # always sent, but may be null - required, so the generated types say so
    mail_id: Optional[int]
    subject: Optional[str]
    # `from` is a Python keyword - the endpoint serializes by alias
    from_: str = Field(..., alias="from")
    recipients: List[str]
    # the label's name, or its id when ESI didn't give it a name
    labels: List[Union[str, int]]
    timestamp: Optional[datetime]


class MailBody(Schema):
    body: str


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
    ref_type_name: Optional[str] = None
    ref_type_description: Optional[str] = None
    balance: float
    amount: float
    own_account: Optional[bool] = True
    reason: Optional[str] = None
    description: Optional[str] = None


class LoyaltyPoints(Schema):
    character: Character
    corporation: EveName
    amount: int


class RefTypeOption(Schema):
    value: str
    label: str
    description: Optional[str] = None


class CorporationWalletEvent(Schema):
    division: str
    id: int
    date: datetime
    first_party: EveName
    second_party: EveName
    ref_type: str
    ref_type_name: Optional[str] = None
    ref_type_description: Optional[str] = None
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

    issuer_corporation: Optional[str] = None

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


class GlanceAssets(Schema):
    frigate: int = 0
    destroyer: int = 0
    cruiser: int = 0
    battlecruiser: int = 0
    battleship: int = 0
    carrier: int = 0
    fax: int = 0
    dread: int = 0
    supercarrier: int = 0
    titan: int = 0
    mining: int = 0
    hauler: int = 0
    indy_command: int = 0
    capital_indy: int = 0
    injector: int = 0
    extractor: int = 0
    citadel: int = 0
    eng_comp: int = 0
    refinary: int = 0
    flex: int = 0
    merc_den_grp: int = 0
    merc_den: int = 0


class GlanceCorporateAssets(Schema):
    corporate: GlanceAssets
    character: GlanceAssets


class GlanceActivities(Schema):
    ratting: Optional[float] = None
    incursion: Optional[float] = None
    pochven: Optional[float] = None
    mission: Optional[float] = None
    market: Optional[float] = None
    industry: Optional[int] = None
    pi: Optional[float] = None
    mining_ore: Optional[float] = None
    mining_moon: Optional[float] = None
    mining_gas: Optional[float] = None
    mining_ice: Optional[float] = None


class GlancePveActivities(Schema):
    ratting: Optional[float] = None
    incursion: Optional[float] = None
    pochven: Optional[float] = None
    mission: Optional[float] = None
    market: Optional[float] = None
    industry: Optional[int] = None


class GlanceIndyActivities(Schema):
    market: Optional[float] = None
    industry: Optional[int] = None
    pi: Optional[float] = None


class GlanceMiningActivities(Schema):
    mining_ore: Optional[float] = None
    mining_moon: Optional[float] = None
    mining_gas: Optional[float] = None
    mining_ice: Optional[float] = None


class GlanceActivityHeatmapCell(Schema):
    day: str
    block: int
    count: int


class GlanceActivityHeatmapMiningDay(Schema):
    day: str
    m3: float


class GlanceActivityHeatmapRattingDay(Schema):
    day: str
    isk: float


class GlanceActivityHeatmap(Schema):
    cells: List[GlanceActivityHeatmapCell]
    mining: List[GlanceActivityHeatmapMiningDay]
    ratting: List[GlanceActivityHeatmapRattingDay]


class GlanceRatting(Schema):
    subcap: Optional[int] = None
    capital: Optional[int] = None
    supers: Optional[int] = None
    titans: Optional[int] = None
    officer: Optional[int] = None
    officer_cruiser: Optional[int] = None
    officer_frigate: Optional[int] = None


class GlanceFactionLP(Schema):
    corp_id: Optional[int] = None
    lp: Optional[int] = None
    corp_name: Optional[str] = None


class GlanceFactionLPSummary(Schema):
    total: Optional[int] = None
    evermark: List[GlanceFactionLP] = []
    top_five: List[GlanceFactionLP] = []


class GlanceFactionCounts(Schema):
    amarr: int = 0
    caldari: int = 0
    gallente: int = 0
    minmatar: int = 0
    angel: int = 0
    guristas: int = 0


class GlanceFaction(Schema):
    factions: GlanceFactionCounts
    lp: GlanceFactionLPSummary


class WalletActivityParty(Schema):
    cat: Optional[str] = None
    id: Optional[int] = None
    cid: Optional[int] = None
    cn: Optional[str] = None
    aid: Optional[str] = None
    an: Optional[int] = None


class WalletActivityEntry(Schema):
    fpn: Optional[str] = None
    firstParty: WalletActivityParty
    spn: Optional[str] = None
    secondParty: WalletActivityParty
    value: int
    interactions: int
    own_account: bool = False


class IdName(Schema):
    id: int
    name: str


class IdNameQty(IdName):
    qty: int


class WalletDivision(Schema):
    # the division number, as a string
    division: str
    # "None" (the string) when the division has no name
    name: str
    # sent as a string, e.g. "1234.50"
    balance: Decimal


class PocoOwner(Schema):
    corporation_name: str
    corporation_id: int


class PocoLocation(Schema):
    id: int
    name: str
    region: str
    constellation: str


class Poco(Schema):
    id: int
    owner: PocoOwner
    name: Optional[str]
    location: PocoLocation
    standing_level: Optional[str]
    alliance_tax_rate: Optional[float]
    corporation_tax_rate: Optional[float]
    terrible_standing_tax_rate: Optional[float]
    bad_standing_tax_rate: Optional[float]
    neutral_standing_tax_rate: Optional[float]
    good_standing_tax_rate: Optional[float]
    excellent_standing_tax_rate: Optional[float]
    reinforce_exit_end: int
    reinforce_exit_start: int
    allow_access_with_standings: Optional[bool]
    allow_alliance_access: Optional[bool]


class CorporationRef(Schema):
    corporation_id: int
    corporation_name: str


class Starbase(Schema):
    starbase_id: int
    owner: CorporationRef
    name: Optional[str]
    type: IdName
    state: str
    onlined_since: Optional[datetime]
    reinforced_until: Optional[datetime]
    unanchor_at: Optional[datetime]
    allow_alliance_members: bool
    allow_corporation_members: bool
    attack_if_other_security_status_dropping: bool
    use_alliance_standings: bool
    attack_security_status_threshold: Optional[float]
    attack_standing_threshold: Optional[float]
    anchor: Optional[str]
    online: Optional[str]
    offline: Optional[str]
    unanchor: Optional[str]
    fuel_bay_take: Optional[str]
    fuel_bay_view: Optional[str]
    # the raw ESI fuel list as stored, not parsed
    fuels: Optional[str]
    # only sent when the starbase's moon/system is known - the endpoint
    # leaves unset fields out rather than sending null
    moon: Optional[IdName] = None
    system: Optional[IdName] = None
    constellation: Optional[IdName] = None
    region: Optional[IdName] = None


class StarbaseSpaceItem(Schema):
    type: IdName
    # metres from the tower
    distance: float


class StarbaseFit(Schema):
    fuel: List[IdNameQty]
    space: List[StarbaseSpaceItem]


class StructureFit(Schema):
    # by location flag: a fitted module ("HiSlot0", "FighterTube0", ...), or
    # the contents of a bay ("Cargo", "StructureFuel", ...)
    fit: Dict[str, Union[IdName, List[IdNameQty]]]
    # slot counts - the type's SDE values (floats), else integer defaults;
    # int | float keeps each as sent rather than turning 8 into 8.0
    low: Union[int, float]
    med: Union[int, float]
    high: Union[int, float]
    rig: Union[int, float]
    service: Union[int, float]
    fighter: Union[int, float]
    subsystem: Union[int, float]


class GateEnd(Schema):
    # Only `known` and `active` are sent for an end that isn't known - the
    # endpoint leaves the rest out rather than sending null.
    system_name: Optional[str] = None
    system_id: Optional[int] = None
    # liquid ozone in the fuel bay
    ozone: Optional[int] = None
    known: bool
    active: bool
    # whole days of fuel left
    expires: Optional[int] = None
    name: Optional[str] = None


class Gate(Schema):
    start: GateEnd
    end: GateEnd


class DenLocation(Schema):
    id: int
    # the location's name, or "<id> (<flag>)" when it isn't known
    name: str
    # NB: as built, this pairs the *system's* id with the constellation's
    # name, and `region` the constellation's id with the region's name;
    # {"id": 0, "name": ""} when unknown
    constellation: IdName
    region: IdName


class Den(Schema):
    character: Character
    item: EveName
    quantity: int
    id: int
    expand: bool
    name: Optional[str]
    location: DenLocation


class CorpCharacterCounts(Schema):
    # every character of members whose main is in the corp
    known_and_alts: int
    # of those, the ones actually in the corp
    known_in_corp: int
    # not updating, or with no audit
    bad: int
    # the corp's member count from ESI
    in_corp: int
    # total wallet balance of known_and_alts
    liquid: float


class CorpCharacterStatus(Schema):
    characters: CorpCharacterCounts
    corporation: IdName


# Space maps - the shared {regions, systems, edges} payload from
# spacemap.build_base_map_payload, also used by the activity maps.

class MapSystem(Schema):
    id: int
    name: str
    region_id: Optional[int]
    constellation_id: Optional[int]
    # two layouts, each normalised to 0-20000: the SDE's 2D map projection,
    # and real universe X/Z - null when the SDE has no position for it
    x_2d: Optional[float]
    y_2d: Optional[float]
    x_real: Optional[float]
    y_real: Optional[float]
    security_status: Optional[float]
    security_class: Optional[str]
    # outside the map's regions - only shown as a link endpoint
    external: bool


class MapEdge(Schema):
    source: int
    target: int


# Sovereignty

class OptionalIdName(Schema):
    # null id (and name "Unknown") when the SDE doesn't know it
    id: Optional[int]
    name: str


class SovHubReagent(Schema):
    # "Unknown", with a null type_id, when the type isn't in the SDE
    name: str
    type_id: Optional[int]
    amount: int
    burning_per_hour: int


class SovHubUpgrade(Schema):
    # "Unknown", with a null type_id, when the type isn't in the SDE
    name: str
    type_id: Optional[int]
    power_state: str


class TransportSystem(Schema):
    system_id: int
    # "#<id>" when the system isn't in the SDE
    system_name: str


class TransportSystemAmount(TransportSystem):
    amount: Optional[int]


class WorkforceTransport(Schema):
    # "import", "export" or "transit", or null when not configured
    mode: Optional[str]
    # import mode only
    config_sources: List[TransportSystem]
    state_sources: List[TransportSystemAmount]
    # export mode only
    config_destination: Optional[TransportSystemAmount]
    state_destination: Optional[TransportSystemAmount]


class AnarchyDen(Schema):
    den_id: int
    anarchy_amount: int
    character_name: str
    type_name: str
    planet_name: str


class SovHub(Schema):
    hub_id: int
    owner: CorporationRef
    location: OptionalIdName
    constellation: OptionalIdName
    region: OptionalIdName
    # the public map leaves these null/empty - operational detail
    power_allocated: Optional[int]
    power_available: Optional[int]
    workforce_allocated: Optional[int]
    workforce_available: Optional[int]
    reagent_last_updated: Optional[datetime]
    reagents: List[SovHubReagent]
    upgrades: List[SovHubUpgrade]
    workforce_transport: Optional[WorkforceTransport]
    # high-anarchy dens in the hub's system - only filled in on the hub
    # list; the maps list them per system instead
    anarchy_dens: List[AnarchyDen]


class SovMapSystem(MapSystem):
    is_hub: bool
    # a high-anarchy den is threatening this system's hub - always false on
    # the public map, which shows no den info
    anarchy_alert: bool
    anarchy_dens: List[AnarchyDen]


class SovMap(Schema):
    regions: List[IdName]
    systems: List[SovMapSystem]
    edges: List[MapEdge]
    jump_bridges: List[MapEdge]
    hubs: List[SovHub]


# Mining ledgers - character and corporation share the shape

class MiningOre(Schema):
    name: str
    group: str
    id: int
    # m3
    volume: Union[int, float]
    # ISK, 0 without the moons app to price ore. NB: counts the ore's first
    # ledger row of each day twice - the day's own `value` doesn't
    value: Union[int, float]


class MiningDay(Schema):
    # YYYY-MM-DD
    date: str
    ores: List[MiningOre]
    # on the corporation ledger, each character's main
    characters: List[IdName]
    systems: List[IdName]
    value: Union[int, float]
    volume: Union[int, float]


class MiningLedger(Schema):
    # unordered
    all_ores: List[str]
    all_groups: List[str]
    all_systems: List[str]
    total_volume: Union[int, float]
    total_value: Union[int, float]
    # one entry per day, oldest first, ending yesterday
    data: List[MiningDay]


class MiningCharacter(Schema):
    character_id: int
    character_name: str


class MiningCharacters(Schema):
    characters: List[MiningCharacter]


# Skill checks - a character's table from SkillListCache.check_skill_lists,
# as the fit check returns it (the doctrine checks build the same tables)

class SkillCheckSkill(Schema):
    # the skill's group name
    grp: Optional[str]
    sp_total: int
    active_level: int
    trained_level: int


class DoctrineMeta(Schema):
    total_sp: int
    trained_sp: int


class CharacterSkillCheck(Schema):
    character_id: int
    # false if any skill is trained above what the clone can use
    omega: bool
    # by skill name
    skills: Dict[str, SkillCheckSkill]
    # skill name -> the level the queue ends on
    queue: Dict[str, int]
    # doctrine name -> its "_meta" SP totals, plus each skill still missing
    # (skill name -> the level needed)
    doctrines: Dict[str, Dict[str, Union[int, DoctrineMeta]]]


class FitSkill(Schema):
    # skill type id - a float, from SDE dogma
    s: Union[int, float]
    # level needed - a float, from SDE dogma
    l: Union[int, float]
    # skill name
    n: str


class FitCheck(Schema):
    # sorted by name
    skills: List[FitSkill]
    # by character name, for each character on the account with any skills;
    # the fit is the doctrine "fit"
    chars: Dict[str, CharacterSkillCheck]
