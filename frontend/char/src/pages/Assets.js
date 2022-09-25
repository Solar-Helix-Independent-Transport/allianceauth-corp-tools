import CharAssetGroups from "../components/CharAssetGroups";
import CharAssetLocSelect from "../components/CharAssetLocSelect";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import { useParams } from "react-router-dom";

const CharAssets = () => {
  let { characterID } = useParams();
  const [location, setLocation] = useState(0);

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <CharAssetLocSelect character_id={characterID} setLocation={setLocation} />
        <CharAssetGroups character_id={characterID} location_id={location} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharAssets;
