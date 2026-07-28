import { getCatApi, GetEndpoint } from "./Api";
import type { components } from "./CtApi";
import axios from "axios";
import Cookies from "js-cookie";
import type { ActivityMapResponse } from "../Components/ActivityMap/types";
import type { MailBody, MailListItem } from "../Components/Mail/MailTypes";

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
  const { data, error } = await GET(endpoint, init);
  if (error) {
    throw error;
  }
  return data;
}

export async function getCharacterContacts(characterID: number) {
  return getCharacterEndpoint("/audit/api/account/{character_id}/contacts", characterID);
}

// The backend under-specifies these endpoints' OpenAPI schema (loose
// object rather than the real shape), so the response is cast to the
// shape the map component actually consumes.
async function getCharacterActivityMapEndpoint(
  endpoint: GetEndpoint,
  characterID: number,
): Promise<ActivityMapResponse> {
  return getCharacterEndpoint(endpoint, characterID) as unknown as Promise<ActivityMapResponse>;
}

export async function getCharacterActivityMapAssets(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/assets",
    characterID,
  );
}

export async function getCharacterActivityMapAssetsShips(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/assets/ships",
    characterID,
  );
}

export async function getCharacterActivityMapAssetsCapitals(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/assets/capitals",
    characterID,
  );
}

export async function getCharacterActivityMapContracts(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/contracts",
    characterID,
  );
}

export async function getCharacterActivityMapContractsSales(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/contracts/sales",
    characterID,
  );
}

export async function getCharacterActivityMapContractsLogistics(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/contracts/logistics",
    characterID,
  );
}

export async function getCharacterActivityMapIndustry(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/industry",
    characterID,
  );
}

export async function getCharacterActivityMapRatting(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/ratting",
    characterID,
  );
}

export async function getCharacterActivityMapPi(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/pi",
    characterID,
  );
}

export async function getCharacterActivityMapOrders(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/orders",
    characterID,
  );
}

export async function getCharacterActivityMapMercenaryDens(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/mercenarydens",
    characterID,
  );
}

export async function getCharacterActivityMapMercenaryTacticalOperations(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/mercenarytacticaloperations",
    characterID,
  );
}

export async function getCharacterActivityMapLocation(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/location",
    characterID,
  );
}

export async function getCharacterActivityMapClonesHome(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/clones/home",
    characterID,
  );
}

export async function getCharacterActivityMapClonesJump(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/clones/jump",
    characterID,
  );
}

export async function getCharacterActivityMapMining(characterID: number) {
  return getCharacterActivityMapEndpoint(
    "/audit/api/account/{character_id}/activitymap/mining",
    characterID,
  );
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
  const api = await axios.post(`/audit/api/extras/fitting2skills/${characterID}`, body, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      contentType: "text/plain",
    },
  });

  return api.data;
}

export async function getCharacterList() {
  const { GET } = getCatApi();

  const { data, error } = await GET(`/audit/api/account/list`);
  if (error) {
    throw error;
  }
  return data;
}

export async function getAssetGroups(characterID: number, locationID: number) {
  const { GET } = getCatApi();

  const { data, error } = await GET(
    `/audit/api/account/{character_id}/asset/{location_id}/groups`,
    {
      params: {
        path: {
          character_id: characterID,
          location_id: locationID,
        },
      },
    },
  );
  if (error) {
    throw error;
  }
  return data;
}

export async function loadCharacterStatus(character_id: number) {
  const api = await axios.get(`/audit/api/account/${character_id}/status`);
  const headers = Array.from(
    new Set<string>(
      api.data.characters?.reduce((p: string[], c: components["schemas"]["CharacterStatus"]) => {
        try {
          return p.concat(Object.keys(c.last_updates ?? {}));
        } catch {
          return p;
        }
      }, []),
    ),
  );
  headers.sort();

  const data: {
    characters: components["schemas"]["CharacterStatus"][];
    main: components["schemas"]["Character"] | undefined;
    headers: string[];
  } = {
    characters: api.data.characters,
    main: api.data.main,
    headers: headers,
  };
  return data;
}

export async function loadPubData(
  character_id: number,
): Promise<{ characters: components["schemas"]["CharacterHistory"][] }> {
  const api = await axios.get(`/audit/api/account/${character_id}/pubdata`);
  const data = {
    characters: api.data,
  };
  return data;
}

export async function loadMail(character_id: number): Promise<MailListItem[]> {
  const api = await axios.get(`/audit/api/account/${character_id}/mail`);
  return api.data;
}

export async function getMailBody(
  character_id: number,
  mail_id: number,
): Promise<MailBody | Record<string, never>> {
  if (!character_id && !mail_id) {
    return {};
  }
  const api = await axios.get(`/audit/api/account/${character_id}/mail/${mail_id}`);

  return api.data;
}

export async function loadMining(character_id: number) {
  const api = await axios.get(`/audit/api/account/${character_id}/mining`);
  return api.data;
}

export async function postAccountRefresh(character_id: number) {
  const api = await axios.post(
    `/audit/api/account/refresh?character_id=${character_id}`,
    { character_id: character_id },
    { headers: { "X-CSRFToken": Cookies.get("csrftoken") } },
  );
  return api.data;
}

export async function loadAssetList(character_id: number, location_id: number) {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/${location_id}/list`);
  return api.data;
}

export async function loadAssetContents(
  character_id: number,
  item_id: number,
): Promise<components["schemas"]["CharacterAssetItem"][]> {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/${item_id}/contents`);
  return api.data;
}

export async function loadAssetLocations(
  character_id: number,
): Promise<components["schemas"]["ValueLabel"][]> {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/locations`);
  return api.data;
}

export async function loadNotifications(character_id: number) {
  const api = await axios.get(`/audit/api/account/${character_id}/notifications`);
  return api.data;
}
export async function loadWallet(
  character_id: number,
): Promise<components["schemas"]["CharacterWalletEvent"][]> {
  const api = await axios.get(`/audit/api/account/${character_id}/wallet`);
  return api.data["items"];
}

export async function loadMarket(character_id: number) {
  const api = await axios.get(`/audit/api/account/${character_id}/market`);
  return api.data;
}

export async function loadWalletActivity(
  character_id: number,
): Promise<components["schemas"]["WalletActivityEntry"][]> {
  const api = await axios.get(`/audit/api/account/${character_id}/wallet/activity`);
  return api.data;
}
