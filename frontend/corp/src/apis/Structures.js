import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function loadStructures() {
  const api = await axios.get(`/audit/api/corp/structures`);
  console.log(`get structures in api 1`);
  return api.data;
}
