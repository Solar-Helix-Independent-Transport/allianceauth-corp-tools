import axios from "axios";
import cookies from "js-cookies";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

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
  const api = await axios.get(
    `/audit/api/account/${character_id}/asset/locations`
  );
  console.log(`get asset locations in api ${character_id}`);
  return api.data;
}

export async function loadAssetGroups(character_id, location_id) {
  const api = await axios.get(
    `/audit/api/account/${character_id}/asset/${location_id}/groups`
  );
  console.log(`get asset groups in api ${character_id} ${location_id}`);
  return api.data;
}

export async function loadAssetList(character_id, location_id) {
  const api = await axios.get(
    `/audit/api/account/${character_id}/asset/${location_id}/list`
  );
  console.log(`get asset list in api ${character_id} ${location_id}`);
  return api.data;
}

export async function loadAssetContents(character_id, item_id) {
  const api = await axios.get(
    `/audit/api/account/${character_id}/asset/${item_id}/contents`
  );
  console.log(`get asset contents in api ${character_id} ${item_id}`);
  return api.data;
}

export async function loadSkills(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/skills`);
  console.log(`get skills in api ${character_id}`);
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

export async function loadNotifications(character_id) {
  const api = await axios.get(
    `/audit/api/account/${character_id}/notifications`
  );
  console.log(`get notifications in api ${character_id}`);
  return api.data;
}

export async function loadWallet(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/wallet`);
  console.log(`get wallet in api ${character_id}`);
  return api.data;
}

export async function loadWalletActivity(character_id) {
  const api = await axios.get(
    `/audit/api/account/${character_id}/wallet/activity`
  );
  console.log(`get wallet activity in api ${character_id}`);
  return api.data;
}

export async function loadMarket(character_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/orders`);
  console.log(`get wallet in api ${character_id}`);
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
