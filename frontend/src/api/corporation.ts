import axios from "axios";
import { Starbase, StarbaseFit } from "../Components/Modals/StarbaseTypes";
import { BridgePair } from "../Components/Corporation/BridgeTypes";
import { StructureType } from "../Components/Corporation/Structures";
import { Den } from "../Components/Corporation/DenTypes";
import { Poco } from "../Components/Corporation/PocoTypes";
import { getCatApi, GetEndpoint } from "./Api";
import { components } from "./CtApi";
import type { ActivityMapResponse } from "../Components/ActivityMap/types";
import type { MiningLedgerData } from "../Components/Graphs/LedgerGraph";
import type { StructureFitData } from "../Components/Modals/FittingModal";
import type { SovHub } from "../Components/Corporation/sovereigntyShared";
import type { SovMapResponse } from "../Components/Corporation/SovereigntyMap/types";

export async function getCorporationEndpoint<Endpoint extends GetEndpoint>(
  endpoint: Endpoint,
  corporationID: number,
) {
  const { GET } = getCatApi();
  const init = {
    params: {
      path: { corporation_id: corporationID },
    },
  };
  // Same shape as getCharacterEndpoint in character.ts - every corptools
  // corporation endpoint takes exactly {corporation_id} as its path param,
  // but TS can't verify that generically from inside this function body.
  // @ts-expect-error - init shape is correct for every concrete Endpoint this is called with
  const { data, error } = await GET(endpoint, init);
  if (error) {
    throw error;
  }
  return data;
}

// The backend under-specifies these endpoints' OpenAPI schema (loose object
// rather than the real shape), so the response is cast to the shape the map
// component actually consumes - same as getCharacterActivityMapEndpoint.
async function getCorporationActivityMapEndpoint(
  endpoint: GetEndpoint,
  corporationID: number,
): Promise<ActivityMapResponse> {
  return getCorporationEndpoint(endpoint, corporationID) as unknown as Promise<ActivityMapResponse>;
}

export interface CorpUpdateStatus {
  update: string | null;
  change: string | null;
}

export interface CorpStatus {
  corporation: { corporation_id: number; corporation_name: string };
  last_updates: Record<string, CorpUpdateStatus>;
}

export async function loadStatus(): Promise<{ corps: CorpStatus[]; headers: string[] }> {
  const api = await axios.get(`/audit/api/corp/list`);
  const headers = Array.from(
    new Set<string>(
      api.data.reduce((p: string[], c: CorpStatus) => {
        try {
          return p.concat(Object.keys(c.last_updates));
        } catch {
          return p;
        }
      }, []),
    ),
  );
  headers.sort();

  const data = {
    corps: api.data,
    headers: headers,
  };
  return data;
}

export async function loadCorpGlanceAssetData(
  corporation_id: number,
): Promise<components["schemas"]["GlanceCorporateAssets"]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/assets`);
  return api.data;
}

export async function loadCorporationActivityMapAssets(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsShips(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/ships",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsCapitals(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/capitals",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsMembers(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/members",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsMembersShips(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/members/ships",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsMembersCapitals(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/members/capitals",
    corporation_id,
  );
}

export async function loadCorporationActivityMapStructures(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/structures",
    corporation_id,
  );
}

export async function loadCorporationActivityMapStarbases(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/starbases",
    corporation_id,
  );
}

export async function loadCorporationActivityMapPocos(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/pocos",
    corporation_id,
  );
}

export async function loadCorporationActivityMapPocosRevenue(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/pocos/revenue",
    corporation_id,
  );
}

export async function loadCorporationActivityMapOrders(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/orders",
    corporation_id,
  );
}

export async function loadCorporationActivityMapOrdersMembers(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/orders/members",
    corporation_id,
  );
}

export async function loadCorporationActivityMapContracts(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/contracts",
    corporation_id,
  );
}

export async function loadCorporationActivityMapContractsSales(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/contracts/sales",
    corporation_id,
  );
}

export async function loadCorporationActivityMapContractsLogistics(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/contracts/logistics",
    corporation_id,
  );
}

export async function loadCorporationActivityMapIndustry(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/industry",
    corporation_id,
  );
}

export async function loadCorporationActivityMapPi(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/pi",
    corporation_id,
  );
}

export async function loadCorporationActivityMapLocation(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/location",
    corporation_id,
  );
}

export async function loadCorporationActivityMapClonesHome(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/clones/home",
    corporation_id,
  );
}

export async function loadCorporationActivityMapClonesJump(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/clones/jump",
    corporation_id,
  );
}

export async function loadCorporationActivityMapMercenaryDens(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/mercenarydens",
    corporation_id,
  );
}

export async function loadCorporationActivityMapMercenaryTacticalOperations(
  corporation_id: number,
) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/mercenarytacticaloperations",
    corporation_id,
  );
}

export async function loadCorporationActivityMapMining(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/mining",
    corporation_id,
  );
}

export async function loadCorporationActivityMapRatting(corporation_id: number) {
  return getCorporationActivityMapEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/ratting",
    corporation_id,
  );
}

// The backend under-specifies this endpoint's schema (loose dict), so the
// real shape is declared here to match what get_corporation_character_status
// actually returns (corptools/api/corporation/status.py).
export interface CorpGlanceStatusData {
  characters: {
    known_and_alts: number;
    known_in_corp: number;
    bad: number;
    in_corp: number;
    liquid: number;
  };
  corporation: {
    id: number;
    name: string;
  };
}

export async function loadCorpGlanceStatusData(
  corporation_id: number,
): Promise<CorpGlanceStatusData> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/character/status`);
  return api.data;
}

export async function loadCorpGlanceActivityDataPVE(
  corporation_id: number,
): Promise<components["schemas"]["GlancePveActivities"]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/activities/pve`);
  return api.data;
}
export async function loadCorpGlanceActivityDataEco(
  corporation_id: number,
): Promise<components["schemas"]["GlanceIndyActivities"]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/activities/indy`);
  return api.data;
}
export async function loadCorpGlanceActivityDataMining(
  corporation_id: number,
): Promise<components["schemas"]["GlanceMiningActivities"]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/activities/mining`);
  return api.data;
}

export async function loadCorpGlanceFactionData(
  corporation_id: number,
): Promise<components["schemas"]["GlanceFaction"]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/faction`);
  return api.data;
}

export async function loadAllStructures(): Promise<StructureType[]> {
  const api = await axios.get(`/audit/api/corp/structures`);
  return api.data;
}

export async function loadStructureFit(structureId: number): Promise<StructureFitData> {
  const api = await axios.get(`/audit/api/corp/structures/${structureId}`);
  return api.data;
}

export async function LoadAllStarbases(): Promise<Starbase[]> {
  const api = await axios.get(`/audit/api/corp/starbases`);
  return api.data;
}

export async function loadStarbaseFit(starbaseID: number): Promise<StarbaseFit> {
  const api = await axios.get(`/audit/api/corp/starbase/${starbaseID}`);
  return api.data;
}

export async function loadAllPocos(): Promise<Poco[]> {
  const api = await axios.get(`/audit/api/corp/pocos`);
  return api.data;
}

export async function loadBridges(): Promise<BridgePair[]> {
  const api = await axios.get(`/audit/api/dashboard/gates`);
  return api.data;
}

export async function loadDens(): Promise<Den[]> {
  const api = await axios.get(`/audit/api/dashboard/dens`);
  return api.data;
}

export async function loadSovHubs(): Promise<SovHub[]> {
  const api = await axios.get(`/audit/api/corp/sovhubs`);
  return api.data;
}

export async function loadSovHubMap(): Promise<SovMapResponse> {
  const api = await axios.get(`/audit/api/corp/sovhubs/map`);
  return api.data;
}

export async function loadPublicSovHubMap(): Promise<SovMapResponse> {
  const api = await axios.get(`/audit/api/dash/sovmap`);
  return api.data;
}

export async function loadAssetLocations(
  corporation_id: number,
): Promise<components["schemas"]["ValueLabel"][]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/asset/locations`);
  return api.data;
}

export async function loadAssetGroups(
  corporation_id: number,
  location_id: number,
): Promise<components["schemas"]["CharacterAssetGroups"][]> {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/asset/${location_id}/groups`,
  );
  return api.data;
}

export async function loadAssetContents(
  item_id: number,
): Promise<components["schemas"]["AssetItem"][]> {
  const api = await axios.get(`/audit/api/corporation/asset/${item_id}/contents`);
  return api.data;
}

export async function loadAssetList(
  corporation_id: number,
  location_id: number,
  new_type: boolean,
): Promise<components["schemas"]["AssetItem"][]> {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/asset/${location_id}/list?new_asset_tree=${new_type}`,
  );
  return api.data;
}

export async function loadWallet(
  corporation_id: number,
  refType = "",
  page = 1,
): Promise<components["schemas"]["CorporationWalletEvent"][]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/wallet`, {
    params: { type_refs: refType, page: page },
  });
  return api.data;
}

export interface CorpDivision {
  division: number;
  name: string;
  balance: number;
}

export async function loadDivisions(corporation_id: number): Promise<CorpDivision[]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/divisions`);
  return api.data;
}

export async function loadRefTypes(): Promise<string[]> {
  const api = await axios.get(`/audit/api/corporation/wallettypes`);
  return api.data;
}

export async function LoadAgregatedMining(corporationId: number): Promise<MiningLedgerData> {
  const api = await axios.get(`/audit/api/corporation/${corporationId}/mining`);
  return api.data;
}
