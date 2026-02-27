# Standard Library
import re

# Third Party
import networkx as nx

# Django
from django.utils import timezone

# Alliance Auth
from esi.openapi_clients import ESIClientProvider as ESIOpenApiProvider

from . import __appname__, __url__, __version__, app_settings
from .task_helpers.skill_helpers import SkillListCache


class EveRouter():
    def __init__(self):
        self.G = nx.Graph()
        self.last_update = None
        self.bridges = {}

    def bulid_graph(self):
        self.G.clear()
        # logger.debug("Graph cleared.")
        from .models import MapJumpBridge, MapSystem, MapSystemGate

        systems = MapSystem.objects.values_list('system_id', flat=True)
        gates = MapSystemGate.objects.values_list(
            'from_solar_system_id', 'to_solar_system_id')
        bridges_query = MapJumpBridge.objects.values_list(
            'from_solar_system_id', 'to_solar_system_id', 'structure_id')
        bridges = []
        bridge_ids = {}
        for b in bridges_query:
            bridge_ids[b[0]] = b[2]
            bridges.append([b[0], b[1]])
        self.G.add_nodes_from(systems)
        self.G.add_edges_from(gates, type="gate")
        self.G.add_edges_from(bridges, type="bridge")
        self.bridges = bridge_ids
        self.last_update = timezone.now()

    def route(self, source_id, destination_id):
        from .models import MapJumpBridge, MapSystem

        # logger.debug("----------")
        # logger.debug(f"Source: {source_id}")
        # logger.debug(f"Destination: {destination_id}")

        if not self.last_update:
            self.bulid_graph()
        else:
            try:
                last_update = MapJumpBridge.objects.latest("updated").updated
                if last_update > self.last_update:
                    self.bulid_graph()
            except MapJumpBridge.DoesNotExist:
                pass

        path = nx.shortest_path(self.G, source_id, destination_id)
        path_length = len(path) - 1
        systems = MapSystem.objects.filter(system_id__in=path)
        system_map = {}

        for a in systems:
            system_map[a.system_id] = a.name

        output = {}
        for i, p in enumerate(path):
            output[i] = system_map[p]

        dotlan_path = output[0].replace(" ", "_")
        message_path = "`" + output[0].replace(" ", "_") + "`"
        esi_points = []
        for i in range(len(path) - 1):
            if self.G.get_edge_data(path[i], path[i + 1])['type'] == 'bridge':
                message_path += "  >B>  `" + output[i + 1] + "`"
                bridged_path = '::' + output[i + 1].replace(" ", "_")
                dotlan_path += bridged_path
                esi_points.append(self.bridges[path[i]])
            else:
                message_path += "  >G>  `" + output[i + 1] + "`"
                gated_path = ':' + output[i + 1].replace(" ", "_")
                dotlan_path += gated_path
        dotlan_path = re.sub(r'(?<!:)(:[^:\s]+)(?=:)(?!::)', '', dotlan_path)
        esi_points.append(path[len(path) - 1])
        result = {'path': output, 'esi': esi_points, 'path_message': message_path,
                  'dotlan': dotlan_path, 'length': path_length}

        return result


esi = None
routes = EveRouter()
skills = SkillListCache()

compat = "2025-08-26" if not app_settings.CT_COMPAT_DATE_OVERRIDE else app_settings.CT_COMPAT_DATE_OVERRIDE


class OpenAPI(ESIOpenApiProvider):
    def char_location_op(self, character_id, token):
        return self.client.Location.GetCharactersCharacterIdLocation(
            character_id=character_id,
            token=token
        )

    def char_location(self, character_id, token, force_refresh=False):
        return self.char_location_op(
            character_id,
            token
        ).result(
            force_refresh=force_refresh,
            use_etag=False
        )

    @staticmethod
    def chunk_ids(lo, n=750):
        for i in range(0, len(lo), n):
            yield lo[i:i + n]


esi_openapi = OpenAPI(
    compatibility_date=compat,
    ua_appname=__appname__,
    ua_url=__url__,
    ua_version=__version__,
    operations=[
        # Char Audits
        "GetCharactersCharacterIdCorporationhistory",
        "GetCharactersCharacterIdRoles",
        "GetCharactersCharacterIdTitles",
        # Character Asset
        "GetCharactersCharacterIdAssets",
        "PostCharactersCharacterIdAssetsNames",
        "PostCharactersCharacterIdAssetsLocations",
        # Character Location
        "GetCharactersCharacterIdShip",
        "GetCharactersCharacterIdLocation",
        "GetCharactersCharacterIdOnline",
        # Character Interactions
        "GetCharactersCharacterIdNotifications",
        "GetCharactersCharacterIdLoyaltyPoints",
        "GetCharactersCharacterIdContacts",
        "GetCharactersCharacterIdContactsLabels",
        # Corporate Assets
        "GetCorporationsCorporationIdAssets",
        "PostCorporationsCorporationIdAssetsNames",
        "PostCorporationsCorporationIdAssetsLocations",
        # Character Skills
        "GetCharactersCharacterIdSkills",
        "GetCharactersCharacterIdSkillqueue",
        # Character Indy
        "GetCharactersCharacterIdIndustryJobs",
        "GetCharactersCharacterIdMining",
        # Character Clones
        "GetCharactersCharacterIdClones",
        "GetCharactersCharacterIdImplants",
        # Character Contracts
        "GetCharactersCharacterIdContracts",
        "GetCharactersCharacterIdContractsContractIdItems",
        # Character Wallets
        "GetCharactersCharacterIdWallet",
        "GetCharactersCharacterIdWalletJournal",
        "GetCharactersCharacterIdWalletTransactions",
        "GetCharactersCharacterIdOrdersHistory",
        "GetCharactersCharacterIdOrders",
        # Corp Data
        "GetCorporationsCorporationIdDivisions",
        # Universe
        "GetUniverseTypesTypeId",
        "GetUniverseGroupsGroupId",
        "GetUniverseCategoriesCategoryId",
        "PostUniverseNames",
        "PostUniverseIds",
        # Corp Wallets
        "GetCorporationsCorporationIdWalletsDivisionJournal",
        "GetCorporationsCorporationIdWalletsDivisionTransactions",
        "GetCorporationsCorporationIdDivisions",
        "GetCorporationsCorporationIdWallets",
        "GetCorporationsCorporationIdContracts",
        "GetCorporationsCorporationIdContractsContractIdItems",
        # Corp Assets
        "GetCorporationsCorporationIdStructures",
        "GetCorporationsCorporationIdStarbases",
        "GetCorporationsCorporationIdStarbasesStarbaseId",
        "GetCorporationsCorporationIdCustomsOffices",
        # Corp Indy
        "GetCorporationsCorporationIdIndustryJobs",
        # Corp Members
        "GetCorporationsCorporationIdMembertracking",
        # Mail endpoitns
        "GetCharactersCharacterIdMailMailId",
        "GetCharactersCharacterIdMail",
        # Misc
        "GetUniverseStationsStationId",
        "GetUniverseStructuresStructureId",
        "GetUniverseSystemsSystemId",
        "GetStatus",
        "GetUniverseCategories",
        # moons
        "GetCorporationCorporationIdMiningObservers",
        "GetCorporationCorporationIdMiningObserversObserverId",
    ]
)
