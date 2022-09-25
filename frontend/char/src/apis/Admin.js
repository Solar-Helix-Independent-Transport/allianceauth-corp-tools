import axios from "axios";
import cookies from "js-cookies";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export async function loadEveModels(character_id) {
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
