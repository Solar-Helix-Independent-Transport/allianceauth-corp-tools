import axios from "axios";
import cookies from "js-cookies";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

function fetchFromObject(obj, prop) {
  if (typeof obj === "undefined") return "Error";
  var _index = prop.indexOf(".");
  if (_index > -1) {
    return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
  }
  return obj[prop];
}

function return_key_pair(label_key, value_key, ob) {
  return ob.reduce((p, c) => {
    try {
      p.push({
        value: fetchFromObject(c, value_key),
        label: fetchFromObject(c, label_key),
      });
      return p;
    } catch (err) {
      console.log(`ERROR searching for key/val`);
      console.log(err);
      return p;
    }
  }, []);
}

export async function loadStatus(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/status`);
  console.log(`get status in api ${character_id}`);
  const headers = Array.from(
    new Set(
      api.data.characters.reduce((p, c) => {
        try {
          return p.concat(Object.keys(c.last_updates));
        } catch (err) {
          return p;
        }
      }, [])
    )
  );
  headers.sort();

  const data = {
    characters: api.data.characters,
    main: api.data.main,
    headers: headers,
  };
  return data;
}

export async function loadMenu() {
  const api = await axios.get(`/audit/api/account/menu`);
  console.log(`get menu in api`);
  return api.data;
}

export async function loadPubData(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/pubdata`);
  console.log(`get pubdata in api ${character_id}`);
  let data = {
    characters: api.data,
  };
  return data;
}

export async function loadAssetLocations(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/locations`);
  console.log(`get asset locations in api ${character_id}`);
  return api.data;
}

export async function loadSkillHistory(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/skill/history`);
  console.log(`get loadSkillHistory in api ${character_id}`);
  return api.data;
}

export async function loadAssetGroups(character_id, location_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/${location_id}/groups`);
  console.log(`get asset groups in api ${character_id} ${location_id}`);
  return api.data;
}

export async function loadAssetList(character_id, location_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/${location_id}/list`);
  console.log(`get asset list in api ${character_id} ${location_id}`);
  return api.data;
}

export async function loadContracts(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/contracts`);
  console.log(`get Contracts in api ${character_id}`);
  return api.data;
}

export async function loadMail(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/mail`);
  console.log(`get Contracts in api ${character_id}`);
  return api.data;
}

export async function loadAssetContents(character_id, item_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/${item_id}/contents`);
  console.log(`get asset contents in api ${character_id} ${item_id}`);
  return api.data;
}

export async function loadSkills(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/skills`);
  console.log(`get skills in api ${character_id}`);
  return api.data;
}

export async function loadLoyaltyPoints(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/loyalty`);
  console.log(`get loyalty in api ${character_id}`);
  return api.data;
}

export async function loadDoctrines(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/doctrines`);
  console.log(`get doctrines in api ${character_id}`);
  return api.data;
}

export async function loadSkillQueues(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/skillqueues`);
  console.log(`get skillqueues in api ${character_id}`);
  return api.data;
}

export async function loadClones(character_id, location_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/clones`);
  console.log(`get clones in api ${character_id}`);
  return api.data;
}

export async function loadRoles(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/roles`);
  console.log(`get roles in api ${character_id}`);
  return api.data;
}

export async function loadMining(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/mining?look_back=150`);
  console.log(`get mining in api ${character_id}`);
  return api.data;
}

export async function loadNotifications(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/notifications`);
  console.log(`get notifications in api ${character_id}`);
  return api.data;
}

export async function loadWallet(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/wallet`);
  console.log(`get wallet in api ${character_id}`);
  return api.data;
}

export async function loadMarket(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/market`);
  console.log(`get wallet in api ${character_id}`);
  return api.data;
}

export async function loadWalletActivity(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/wallet/activity`);
  console.log(`get wallet activity in api ${character_id}`);
  return api.data;
}

export async function loadContacts(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/contacts`);
  console.log(`get contacts in api ${character_id}`);
  return api.data;
}

export async function loadAccountList(character_id) {
  const api = await axios.get(`/audit/api/account/list`);
  console.log(`get account list in api`);
  return api.data;
}

export async function postRefresh(character_id) {
  const api = await axios.post(`/audit/api/characters/refresh`, {
    character_id: character_id,
  });
  console.log(`sent character refresh ${character_id}`);
  return api.data;
}

export async function postAccountRefresh(character_id) {
  console.log(`sent account refresh ${character_id}`);
  const api = await axios.post(
    `/audit/api/account/refresh?character_id=${character_id}`,
    { character_id: character_id },
    { headers: { "X-CSRFToken": cookies.getItem("csrftoken") } }
  );
  return api.data;
}

export async function getMailBody(character_id, mail_id) {
  console.log(`sent postMailBody ${character_id}, ${mail_id}`);
  if (!character_id && !mail_id) {
    return {};
  }
  const api = await axios.get(`/audit/api/account/${character_id}/mail/${mail_id}`);
  console.log(`search mail body in api ${character_id}, ${mail_id}`);

  return api.data;
}

export async function searchSystem(system_id) {
  const api = await axios.get(`/audit/api/search/system/${system_id}`);
  console.log(`search systems in api ${system_id}`);
  const systems = return_key_pair("name", "id", api.data);
  systems.sort();
  return systems;
}

export async function searchLocation(location_id) {
  const api = await axios.get(`/audit/api/search/location/${location_id}`);
  console.log(`search locations in api ${location_id}`);
  const locations = return_key_pair("name", "id", api.data);
  locations.sort();
  return locations;
}

export async function searchItemGroup(group_id) {
  const api = await axios.get(`/audit/api/search/item/group/${group_id}`);
  console.log(`search item group in api ${group_id}`);
  const groups = return_key_pair("name", "id", api.data);
  groups.sort();
  return groups;
}

export async function postTestPing(
  message,
  structures,
  locations,
  itemGroups,
  filter_charges = false,
  ships_only = false,
  caps_only = false
) {
  console.log(`sent ping test ${message}`);
  const api = await axios.post(`/audit/api/pingbot/assets/counts`, null, {
    headers: { "X-CSRFToken": cookies.getItem("csrftoken") },
    params: {
      message: message,
      structures: structures.join(","),
      systems: locations.join(","),
      itemGroups: itemGroups.join(","),
      filter_charges: filter_charges,
      ships_only: ships_only,
      capitals_only: caps_only,
    },
  });
  return api.data;
}

export async function postSendPing(
  message,
  structures,
  locations,
  itemGroups,
  filter_charges = false,
  ships_only = false,
  caps_only = false
) {
  console.log(`sent ping test ${message}`);
  const api = await axios.post(`/audit/api/pingbot/assets/send`, null, {
    headers: { "X-CSRFToken": cookies.getItem("csrftoken") },
    params: {
      message: message,
      structures: structures.join(","),
      systems: locations.join(","),
      itemGroups: itemGroups.join(","),
      filter_charges: filter_charges,
      ships_only: ships_only,
      capitals_only: caps_only,
    },
  });
  return api.data;
}
