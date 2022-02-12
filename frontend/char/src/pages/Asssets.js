import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import CharAssetLocSelect from "../components/CharAssetLocSelect";
import CharAssetGroups from "../components/CharAssetGroups";

const CharAssets = ({ character_id }) => {
  const [location, setLocation] = useState(0);

  return (
    <Panel.Body className="flex-container-vert-fill">
      <CharAssetLocSelect
        character_id={character_id}
        setLocation={setLocation}
      />
      <CharAssetGroups character_id={character_id} location_id={location} />
    </Panel.Body>
  );
};

export default CharAssets;
