import CharAssetLocSelect from "../components/CharAssetLocSelect";
import CharAssetTable from "../components/CharAssetTable";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import { useParams } from "react-router-dom";

const CharAssets = () => {
  const [location, setLocation] = useState(0);
  let { characterID } = useParams();

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <CharAssetLocSelect character_id={characterID} setLocation={setLocation} />
        <CharAssetTable character_id={characterID} location_id={location} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharAssets;
