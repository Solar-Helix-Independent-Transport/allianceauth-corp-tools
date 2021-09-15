import axios from "axios";

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
  console.log(`get asset locations in api ${character_id} ${location_id}`);
  return api.data;
}
export async function loadClones(character_id, location_id) {
  const api = await axios.get(`/audit/api/account/${character_id}/clones`);
  console.log(`get clones in api ${character_id}`);
  return api.data;
}
