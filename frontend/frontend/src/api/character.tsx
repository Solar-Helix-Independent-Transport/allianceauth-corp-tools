import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function loadCharacterStatus(character_id: any) {
  const api = await axios.get(`/audit/api/account/${character_id}/status`);
  console.log(`got character status from api for '${character_id}'`);
  const headers = Array.from(
    new Set(
      api.data.characters.reduce((p: any, c: any) => {
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

export async function loadPubData(character_id: any) {
  const api = await axios.get(`/audit/api/account/${character_id}/pubdata`);
  console.log(`get pubdata in api ${character_id}`);
  let data = {
    characters: api.data,
  };
  return data;
}

export async function loadGlanceAssetData(character_id: any) {
  const api = await axios.get(`/audit/api/account/${character_id}/glance/assets`);
  console.log(`get glance/assets in api ${character_id}`);
  return api.data;
}

export async function loadGlanceActivityData(character_id: any) {
  const api = await axios.get(`/audit/api/account/${character_id}/glance/activities`);
  console.log(`get glance/activities in api ${character_id}`);
  return api.data;
}

export async function loadGlanceFactionData(character_id: any) {
  const api = await axios.get(`/audit/api/account/${character_id}/glance/faction`);
  console.log(`get glance/faction in api ${character_id}`);
  return api.data;
}

export async function postAccountRefresh(character_id: any) {
  console.log(`sent account refresh ${character_id}`);
  const api = await axios.post(
    `/audit/api/account/refresh?character_id=${character_id}`,
    { character_id: character_id },
    { headers: { "X-CSRFToken": Cookies.get("csrftoken") } }
  );
  return api.data;
}

export async function loadAssetList(
  character_id: number | undefined,
  location_id: number | undefined
) {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/${location_id}/list`);
  console.log(`get asset list in api ${character_id} ${location_id}`);
  return api.data;
}

export async function loadAssetLocations(character_id: number | undefined) {
  const api = await axios.get(`/audit/api/account/${character_id}/asset/locations`);
  console.log(`get asset locations in api ${character_id}`);
  return api.data;
}
