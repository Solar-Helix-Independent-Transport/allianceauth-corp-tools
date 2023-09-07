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

export async function postAccountRefresh(character_id: any) {
  console.log(`sent account refresh ${character_id}`);
  const api = await axios.post(
    `/audit/api/account/refresh?character_id=${character_id}`,
    { character_id: character_id },
    { headers: { "X-CSRFToken": Cookies.get("csrftoken") } }
  );
  return api.data;
}
