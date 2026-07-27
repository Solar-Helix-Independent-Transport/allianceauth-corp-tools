import axios from "axios";

// import Cookies from "js-cookie";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function loadStatus() {
  const api = await axios.get(`/audit/api/corp/list`);
  console.log(`got corp status in api`);
  const headers = Array.from(
    new Set(
      api.data.reduce((p: any, c: any) => {
        try {
          return p.concat(Object.keys(c.last_updates));
        } catch (err) {
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

export async function loadCorpGlanceAssetData(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/assets`);
  console.log(`get glance/assets in api ${corporation_id}`);
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
  console.log(`get glance/assets in api ${corporation_id}`);
  return api.data;
}

export async function loadCorpGlanceActivityDataPVE(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/activities/pve`);
  console.log(`get glance/activities in api ${corporation_id}`);
  return api.data;
}
export async function loadCorpGlanceActivityDataEco(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/activities/indy`);
  console.log(`get glance/activities in api ${corporation_id}`);
  return api.data;
}
export async function loadCorpGlanceActivityDataMining(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/activities/mining`);
  console.log(`get glance/activities in api ${corporation_id}`);
  return api.data;
}

export async function loadCorpGlanceFactionData(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/faction`);
  console.log(`get glance/faction in api ${corporation_id}`);
  return api.data;
}

export async function loadAllStructures() {
  const api = await axios.get(`/audit/api/corp/structures`);
  console.log(`get structures in api`);
  return api.data;
}

export async function loadStructureFit(structureId: number) {
  const api = await axios.get(`/audit/api/corp/structures/${structureId}`);
  console.log(`get structures in api`);
  return api.data;
}

export async function LoadAllStarbases() {
  const api = await axios.get(`/audit/api/corp/starbases`);
  console.log(`get starbases in api`);
  return api.data;
}

export async function loadStarbaseFit(starbaseID: number) {
  const api = await axios.get(`/audit/api/corp/starbase/${starbaseID}`);
  console.log(`get starbase ${starbaseID} fit in api`);
  return api.data;
}

export async function loadAllPocos() {
  const api = await axios.get(`/audit/api/corp/pocos`);
  console.log(`get pocos in api`);
  return api.data;
}

export async function loadBridges() {
  const api = await axios.get(`/audit/api/dashboard/gates`);
  console.log(`get bridges in api`);
  return api.data;
}

export async function loadDens() {
  const api = await axios.get(`/audit/api/dashboard/dens`);
  console.log(`get dens in api`);
  return api.data;
}

export async function loadSovHubs() {
  const api = await axios.get(`/audit/api/corp/sovhubs`);
  console.log(`get sovhubs in api`);
  return api.data;
}

export async function loadSovHubMap() {
  const api = await axios.get(`/audit/api/corp/sovhubs/map`);
  console.log(`get sovhubs map in api`);
  return api.data;
}

export async function loadPublicSovHubMap() {
  const api = await axios.get(`/audit/api/dash/sovmap`);
  console.log(`get public sovhubs map in api`);
  return api.data;
}

export async function loadSov() {
  const api = await axios.get(`/audit/api/dashboard/sov`);
  console.log(`get sov in api`);
  return api.data;
}

export async function loadAssetLocations(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/asset/locations`);
  console.log(`get asset locations in api ${corporation_id}`);
  return api.data;
}

export async function loadAssetGroups(corporation_id: number, location_id: number) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/asset/${location_id}/groups`,
  );
  console.log(`get asset groups in api ${corporation_id} ${location_id}`);
  return api.data;
}

export async function loadAssetContents(item_id: number) {
  const api = await axios.get(`/audit/api/corporation/asset/${item_id}/contents`);
  console.log(`get asset contents in api ${item_id}`);
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
  console.log(`get asset list in api ${corporation_id} ${location_id}`);
  return api.data;
}

export async function loadWallet(corporation_id: number, refType = "", page = 1) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/wallet`, {
    params: { type_refs: refType, page: page },
  });
  console.log(`get wallet in api ${corporation_id}`);
  return api.data;
}

export async function loadDivisions(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/divisions`);
  console.log(`get divisions in api ${corporation_id}`);
  return api.data;
}

export async function loadRefTypes() {
  const api = await axios.get(`/audit/api/corporation/wallettypes`);
  console.log(`get wallet types in api`);
  return api.data;
}

export async function LoadAgregatedMining(corporationId: Number) {
  const api = await axios.get(`/audit/api/corporation/${corporationId}/mining`);
  console.log(`get mining in api`);
  return api.data;
}
