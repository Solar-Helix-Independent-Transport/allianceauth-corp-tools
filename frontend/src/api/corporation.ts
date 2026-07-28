import axios from "axios";
import { Starbase, StarbaseFit } from "../Components/Modals/StarbaseTypes";
import { BridgePair } from "../Components/Corporation/BridgeTypes";
import { StructureType } from "../Components/Corporation/Structures";
import { Den } from "../Components/Corporation/DenTypes";
import { Poco } from "../Components/Corporation/PocoTypes";
import { components } from "./CtApi";

// import Cookies from "js-cookie";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

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

export async function postCorporationRefresh() {
  return 1;
}

export async function loadCorpGlanceAssetData(
  corporation_id: number,
): Promise<components["schemas"]["GlanceCorporateAssets"]> {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/assets`);
  return api.data;
}

export async function loadCorporationActivityMapAssets(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/assets`);
  return api.data;
}

export async function loadCorporationActivityMapAssetsShips(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/assets/ships`);
  return api.data;
}

export async function loadCorporationActivityMapAssetsCapitals(corporation_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/assets/capitals`,
  );
  return api.data;
}

export async function loadCorporationActivityMapAssetsMembers(corporation_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/assets/members`,
  );
  return api.data;
}

export async function loadCorporationActivityMapAssetsMembersShips(corporation_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/assets/members/ships`,
  );
  return api.data;
}

export async function loadCorporationActivityMapAssetsMembersCapitals(corporation_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/assets/members/capitals`,
  );
  return api.data;
}

export async function loadCorporationActivityMapStructures(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/structures`);
  return api.data;
}

export async function loadCorporationActivityMapStarbases(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/starbases`);
  return api.data;
}

export async function loadCorporationActivityMapPocos(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/pocos`);
  return api.data;
}

export async function loadCorporationActivityMapPocosRevenue(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/pocos/revenue`);
  return api.data;
}

export async function loadCorporationActivityMapOrders(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/orders`);
  return api.data;
}

export async function loadCorporationActivityMapOrdersMembers(corporation_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/orders/members`,
  );
  return api.data;
}

export async function loadCorporationActivityMapContracts(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/contracts`);
  return api.data;
}

export async function loadCorporationActivityMapContractsSales(corporation_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/contracts/sales`,
  );
  return api.data;
}

export async function loadCorporationActivityMapContractsLogistics(corporation_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/contracts/logistics`,
  );
  return api.data;
}

export async function loadCorporationActivityMapIndustry(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/industry`);
  return api.data;
}

export async function loadCorporationActivityMapPi(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/pi`);
  return api.data;
}

export async function loadCorporationActivityMapLocation(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/location`);
  return api.data;
}

export async function loadCorporationActivityMapClonesHome(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/clones/home`);
  return api.data;
}

export async function loadCorporationActivityMapClonesJump(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/clones/jump`);
  return api.data;
}

export async function loadCorporationActivityMapMercenaryDens(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/mercenarydens`);
  return api.data;
}

export async function loadCorporationActivityMapMercenaryTacticalOperations(
  corporation_id: number,
) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/activitymap/mercenarytacticaloperations`,
  );
  return api.data;
}

export async function loadCorporationActivityMapMining(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/mining`);
  return api.data;
}

export async function loadCorporationActivityMapRatting(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/activitymap/ratting`);
  return api.data;
}

export async function loadCorpGlanceStatusData(corporation_id: number) {
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

export async function loadStructureFit(structureId: number) {
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

export async function loadSovHubs() {
  const api = await axios.get(`/audit/api/corp/sovhubs`);
  return api.data;
}

export async function loadSovHubMap() {
  const api = await axios.get(`/audit/api/corp/sovhubs/map`);
  return api.data;
}

export async function loadPublicSovHubMap() {
  const api = await axios.get(`/audit/api/dash/sovmap`);
  return api.data;
}

export async function loadSov() {
  const api = await axios.get(`/audit/api/dashboard/sov`);
  return api.data;
}

export async function loadAssetLocations(
  corporation_id: number,
): Promise<{ value: number; label: string }[]> {
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
) {
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

export async function LoadAgregatedMining(corporationId: number) {
  const api = await axios.get(`/audit/api/corporation/${corporationId}/mining`);
  return api.data;
}
