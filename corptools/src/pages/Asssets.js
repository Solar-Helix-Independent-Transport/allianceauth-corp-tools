import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadAssetLocations } from "../apis/Character";
import CharAssetLocSelect from "../components/CharAssetLocSelect";
import CharAssetGroups from "../components/CharAssetGroups";
const CharAssets = ({ character_id }) => {
  const [assets, setAssets] = useState([]);
  const [location, setLocation] = useState(0);
  const { isLoading, error, data } = useQuery(["asset_loc", character_id], () =>
    loadAssetLocations(character_id)
  );

  return (
    <Panel>
      <Panel.Body className="flex-container-vert-fill">
        <CharAssetLocSelect
          character_id={character_id}
          setLocation={setLocation}
        />
        <CharAssetGroups character_id={character_id} location_id={location} />
      </Panel.Body>
    </Panel>
  );
};

export default CharAssets;
