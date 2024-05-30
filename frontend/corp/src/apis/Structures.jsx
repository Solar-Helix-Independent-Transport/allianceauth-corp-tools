import axios from "axios";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function loadStructures() {
  const api = await axios.get(`/audit/api/corp/structures`);
  console.log(`get structures in api 1`);
  return api.data;
}

export async function loadPocos() {
  const api = await axios.get(`/audit/api/corp/pocos`);
  console.log(`get pocos in api 1`);
  return api.data;
}
