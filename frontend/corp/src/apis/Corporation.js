import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function loadCorpStatus() {
  const api = await axios.get(`/audit/api/corp/1/status`);
  console.log(`get status in api 1`);
  return api.data;
}
