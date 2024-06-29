import axios from "axios";

// import Cookies from "js-cookie";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function postCorporationRefresh() {
  return 1;
}

export async function loadCorpGlanceAssetData(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/assets`);
  console.log(`get glance/assets in api ${corporation_id}`);
  return api.data;
}

export async function loadCorpGlanceStatusData(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/character/status`);
  console.log(`get glance/assets in api ${corporation_id}`);
  return api.data;
}

export async function loadCorpGlanceActivityData(corporation_id: number) {
  const api = await axios.get(`/audit/api/corporation/${corporation_id}/glance/activities`);
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
