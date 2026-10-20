import { getCatApi, GetEndpoint, unwrap } from "./Api";
import type { components } from "./CtApi";

export async function getCharacterEndpoint<Endpoint extends GetEndpoint>(
  endpoint: Endpoint,
  characterID: number,
) {
  const { GET } = getCatApi();
  const init = {
    params: {
      path: { character_id: characterID },
    },
  };
  // Every corptools character endpoint takes exactly {character_id} as its
  // path param, but TS can't verify that generically across the full union
  // of possible Endpoints from inside this function body - callers get the
  // real, narrowed response type from `Endpoint` regardless.
  // @ts-expect-error - init shape is correct for every concrete Endpoint this is called with
  return unwrap(GET(endpoint, init));
}

export async function getCharacterContacts(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/contacts", characterID);
}

export async function getCharacterActivityMapAssets(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/activitymap/assets", characterID);
}

export async function getCharacterActivityMapAssetsShips(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/assets/ships",
    characterID,
  );
}

export async function getCharacterActivityMapAssetsCapitals(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/assets/capitals",
    characterID,
  );
}

export async function getCharacterActivityMapContracts(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/contracts",
    characterID,
  );
}

export async function getCharacterActivityMapContractsSales(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/contracts/sales",
    characterID,
  );
}

export async function getCharacterActivityMapContractsLogistics(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/contracts/logistics",
    characterID,
  );
}

export async function getCharacterActivityMapIndustry(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/industry",
    characterID,
  );
}

export async function getCharacterActivityMapRatting(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/activitymap/ratting", characterID);
}

export async function getCharacterActivityMapPi(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/activitymap/pi", characterID);
}

export async function getCharacterActivityMapOrders(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/activitymap/orders", characterID);
}

export async function getCharacterActivityMapMercenaryDens(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/mercenarydens",
    characterID,
  );
}

export async function getCharacterActivityMapMercenaryTacticalOperations(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/mercenarytacticaloperations",
    characterID,
  );
}

export async function getCharacterActivityMapLocation(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/location",
    characterID,
  );
}

export async function getCharacterActivityMapClonesHome(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/clones/home",
    characterID,
  );
}

export async function getCharacterActivityMapClonesJump(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/activitymap/clones/jump",
    characterID,
  );
}

export async function getCharacterActivityMapMining(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/activitymap/mining", characterID);
}

export async function getCharacterLP(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/loyalty", characterID);
}

export async function getCharacterNotifications(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/notifications", characterID);
}

export async function getCharacterClones(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/clones", characterID);
}

export async function getCharacterMercenaryDens(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/mercenarydens", characterID);
}

export async function getCharacterMercenaryTacticalOperations(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/mercenarytacticaloperations",
    characterID,
  );
}

export async function getCharacterRoles(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/roles", characterID);
}
export async function loadGlanceRattingData(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/glance/ratting", characterID);
}
export async function loadGlanceAssetData(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/glance/assets", characterID);
}
export async function loadGlanceActivityData(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/glance/activities", characterID);
}

export async function loadGlanceActivityHeatmapData(characterID: number) {
  return getCharacterEndpoint(
    "/audit/api/account/{character_id}/glance/activity_heatmap",
    characterID,
  );
}

export async function loadGlanceFactionData(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/glance/faction", characterID);
}

export async function getCharacterMarket(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/market", characterID);
}

export async function getCharacterContracts(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/contracts", characterID);
}

export async function getCharacterSkills(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/skills", characterID);
}

export async function getCharacterSkillGraph(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/skillgraph", characterID);
}

export async function getCharacterSkillQueues(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/skillqueues", characterID);
}

export async function getAccountDoctrines(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/doctrines", characterID);
}

export async function getFitCheck(body: string, characterID: number) {
  const { POST } = getCatApi();
  return unwrap(
    POST("/audit/api/extras/fitting2skills/{character_id}", {
      params: { path: { character_id: characterID } },
      body,
      // the backend reads the raw EFT text, so send it as-is rather than
      // JSON-encoded
      bodySerializer: (b) => b,
      headers: { "Content-Type": "text/plain" },
    }),
  );
}

export async function getCharacterMenu() {
  const { GET } = getCatApi();
  return unwrap(GET("/audit/api/account/menu"));
}

export async function getCharacterList() {
  const { GET } = getCatApi();

  return unwrap(GET("/audit/api/account/list"));
}

export async function getAssetGroups(characterID: number, locationID: number) {
  const { GET } = getCatApi();

  return unwrap(
    GET("/audit/api/account/{character_id}/asset/{location_id}/groups", {
      params: { path: { character_id: characterID, location_id: locationID } },
    }),
  );
}

export async function loadCharacterStatus(character_id: number) {
  const { GET } = getCatApi();
  const status = await unwrap(
    GET("/audit/api/account/{character_id}/status", {
      params: { path: { character_id } },
    }),
  );
  const headers = Array.from(
    new Set<string>((status.characters ?? []).flatMap((c) => Object.keys(c.last_updates ?? {}))),
  );
  headers.sort();

  const data: {
    characters: components["schemas"]["CharacterStatus"][];
    main: components["schemas"]["Character"] | undefined;
    headers: string[];
  } = {
    characters: status.characters ?? [],
    main: status.main,
    headers: headers,
  };
  return data;
}

export async function loadPubData(character_id: number) {
  const { GET } = getCatApi();
  const characters = await unwrap(
    GET("/audit/api/account/{character_id}/pubdata", {
      params: { path: { character_id } },
    }),
  );
  return { characters };
}

export async function loadMail(character_id: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/mail", character_id);
}

export async function getMailBody(character_id: number, mail_id: number) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/account/{character_id}/mail/{mail_id}", {
      params: { path: { character_id, mail_id } },
    }),
  );
}

export async function loadMining(character_id: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/mining", character_id);
}

export async function postAccountRefresh(character_id: number) {
  const { POST } = getCatApi();
  return unwrap(
    POST("/audit/api/account/refresh", {
      params: { query: { character_id } },
    }),
  );
}

export async function postContractItemsRefresh(character_id: number, contract_id: number) {
  const { POST } = getCatApi();
  return unwrap(
    POST("/audit/api/account/{character_id}/contract/{contract_id}/items/refresh", {
      params: { path: { character_id, contract_id } },
    }),
  );
}

export async function loadAssetList(character_id: number, location_id: number) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/account/{character_id}/asset/{location_id}/list", {
      params: { path: { character_id, location_id } },
    }),
  );
}

export async function loadAssetContents(character_id: number, item_id: number) {
  const { GET } = getCatApi();
  return unwrap(
    GET("/audit/api/account/{character_id}/asset/{item_id}/contents", {
      params: { path: { character_id, item_id } },
    }),
  );
}

export async function loadAssetLocations(character_id: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/asset/locations", character_id);
}

export async function loadNotifications(character_id: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/notifications", character_id);
}

export async function loadWallet(character_id: number) {
  const wallet = await getCharacterEndpoint(
    "/audit/api/account/{character_id}/wallet",
    character_id,
  );
  return wallet.items;
}

export async function loadMarket(character_id: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/market", character_id);
}

export async function loadWalletActivity(character_id: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/wallet/activity", character_id);
}
