import axios from "axios";
import cookies from "js-cookies";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function loadStatus() {
  const api = await axios.get(`/audit/api/corp/list`);
  console.log(`got corp status in api`);
  const headers = Array.from(
    new Set(
      api.data.reduce((p, c) => {
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
    corps: api.data,
    headers: headers,
  };
  return data;
}

export async function postCorporationRefresh() {
  console.log(`Sent Corp refresh`);
  const api = await axios.post(`/audit/api/corporation/refresh`, {
    headers: { "X-CSRFToken": cookies.getItem("csrftoken") },
  });
  return api.data;
}

export async function loadAssetLocations(corporation_id) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/asset/locations`
  );
  console.log(`get asset locations in api ${corporation_id}`);
  return api.data;
}

export async function loadAssetGroups(corporation_id, location_id) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/asset/${location_id}/groups`
  );
  console.log(`get asset groups in api ${corporation_id} ${location_id}`);
  return api.data;
}

export async function loadAssetContents(item_id) {
  const api = await axios.get(
    `/audit/api/corporation/asset/${item_id}/contents`
  );
  console.log(`get asset contents in api ${item_id}`);
  return api.data;
}

export async function loadAssetList(corporation_id, location_id) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/asset/${location_id}/list`
  );
  console.log(`get asset list in api ${corporation_id} ${location_id}`);
  return api.data;
}

export async function loadWallet(corporation_id) {
  const api = await axios.get(
    `/audit/api/corporation/${corporation_id}/wallet`
  );
  console.log(`get wallet in api ${corporation_id}`);
  return api.data;
}
