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
