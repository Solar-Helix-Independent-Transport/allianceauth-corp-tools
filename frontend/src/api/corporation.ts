import { getCatApi, GetEndpoint, unwrap } from "./Api";
import type { components } from "./CtApi";

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
  return unwrap(GET(endpoint, init));
}

export async function getCorporationMenu() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/corp/menu"));
}

export interface CorpUpdateStatus {
  update: string | null;
  change: string | null;
}

// corp/list and corp/{id}/status share the CorpStatus schema but put
// different values in last_updates, so the schema leaves it as a plain
// dict. corp/list always sends it, in this shape.
export type CorpStatus = Omit<components["schemas"]["CorpStatus"], "last_updates"> & {
  last_updates: Record<string, CorpUpdateStatus>;
};

export async function loadStatus() {
  const { GET } = getCatApi();
  const corps = (await unwrap(GET("/audit/api/corp/list"))) as CorpStatus[];
  const headers = Array.from(
    new Set<string>(corps.flatMap((c) => Object.keys(c.last_updates ?? {}))),
  );
  headers.sort();

  return { corps, headers };
}

export async function loadCorpGlanceAssetData(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/glance/assets",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssets(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsShips(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/ships",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsCapitals(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/capitals",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsMembers(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/members",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsMembersShips(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/members/ships",
    corporation_id,
  );
}

export async function loadCorporationActivityMapAssetsMembersCapitals(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/assets/members/capitals",
    corporation_id,
  );
}

export async function loadCorporationActivityMapStructures(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/structures",
    corporation_id,
  );
}

export async function loadCorporationActivityMapStarbases(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/starbases",
    corporation_id,
  );
}

export async function loadCorporationActivityMapPocos(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/pocos",
    corporation_id,
  );
}

export async function loadCorporationActivityMapPocosRevenue(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/pocos/revenue",
    corporation_id,
  );
}

export async function loadCorporationActivityMapOrders(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/orders",
    corporation_id,
  );
}

export async function loadCorporationActivityMapOrdersMembers(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/orders/members",
    corporation_id,
  );
}

export async function loadCorporationActivityMapContracts(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/contracts",
    corporation_id,
  );
}

export async function loadCorporationActivityMapContractsSales(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/contracts/sales",
    corporation_id,
  );
}

export async function loadCorporationActivityMapContractsLogistics(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/contracts/logistics",
    corporation_id,
  );
}

export async function loadCorporationActivityMapIndustry(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/industry",
    corporation_id,
  );
}

export async function loadCorporationActivityMapPi(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/pi",
    corporation_id,
  );
}

export async function loadCorporationActivityMapLocation(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/location",
    corporation_id,
  );
}

export async function loadCorporationActivityMapClonesHome(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/clones/home",
    corporation_id,
  );
}

export async function loadCorporationActivityMapClonesJump(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/clones/jump",
    corporation_id,
  );
}

export async function loadCorporationActivityMapMercenaryDens(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/mercenarydens",
    corporation_id,
  );
}

export async function loadCorporationActivityMapMercenaryTacticalOperations(
  corporation_id: number,
) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/mercenarytacticaloperations",
    corporation_id,
  );
}

export async function loadCorporationActivityMapMining(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/mining",
    corporation_id,
  );
}

export async function loadCorporationActivityMapRatting(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/activitymap/ratting",
    corporation_id,
  );
}

export async function loadCorpGlanceStatusData(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/character/status",
    corporation_id,
  );
}

export async function loadCorpGlanceActivityDataPVE(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/glance/activities/pve",
    corporation_id,
  );
}

export async function loadCorpGlanceActivityDataEco(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/glance/activities/indy",
    corporation_id,
  );
}

export async function loadCorpGlanceActivityDataMining(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/glance/activities/mining",
    corporation_id,
  );
}

export async function loadCorpGlanceFactionData(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/glance/faction",
    corporation_id,
  );
}

export async function loadAllStructures() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/corp/structures"));
}

export async function loadStructureFit(structure_id: number) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/corp/structures/{structure_id}", {
      params: { path: { structure_id } },
    }),
  );
}

export async function LoadAllStarbases() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/corp/starbases"));
}

export async function loadStarbaseFit(starbase_id: number) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/corp/starbase/{starbase_id}", {
      params: { path: { starbase_id } },
    }),
  );
}

export async function loadAllPocos() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/corp/pocos"));
}

export async function loadBridges() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/dashboard/gates"));
}

export async function loadDens() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/dashboard/dens"));
}

export async function loadSovHubs() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/corp/sovhubs"));
}

export async function loadSovHubMap() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/corp/sovhubs/map"));
}

export async function loadPublicSovHubMap() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/dash/sovmap"));
}

export async function loadAssetLocations(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/asset/locations",
    corporation_id,
  );
}

export async function loadAssetGroups(corporation_id: number, location_id: number) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/corporation/{corporation_id}/asset/{location_id}/groups", {
      params: { path: { corporation_id, location_id } },
    }),
  );
}

export async function loadAssetContents(item_id: number) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/corporation/asset/{item_id}/contents", {
      params: { path: { item_id } },
    }),
  );
}

export async function loadAssetList(
  corporation_id: number,
  location_id: number,
  new_type: boolean,
) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/corporation/{corporation_id}/asset/{location_id}/list", {
      params: {
        path: { corporation_id, location_id },
        query: { new_asset_tree: new_type },
      },
    }),
  );
}

export async function loadWallet(corporation_id: number, refType = "", page = 1) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/corporation/{corporation_id}/wallet", {
      params: {
        path: { corporation_id },
        query: { type_refs: refType, page },
      },
    }),
  );
}

export type CorpDivision = components["schemas"]["WalletDivision"];

export async function loadDivisions(corporation_id: number) {
  return getCorporationEndpoint(
    "/audit/api/corporation/{corporation_id}/divisions",
    corporation_id,
  );
}

export async function loadRefTypes() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/corporation/wallettypes"));
}

export async function LoadAgregatedMining(corporation_id: number) {
  return getCorporationEndpoint("/audit/api/corporation/{corporation_id}/mining", corporation_id);
}
