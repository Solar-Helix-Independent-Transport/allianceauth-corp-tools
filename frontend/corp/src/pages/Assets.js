import CorpAssetGroups from "../components/CorpAssetGroups";
import CorpAssetLocSelect from "../components/CorpAssetLocSelect";
import CorpSelect from "../components/CorpSelect";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Panel } from "react-bootstrap";

const CorpAssets = () => {
  const [location, setLocation] = useState(0);
  const [corporation_id, setCorp] = useState(0);

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <CorpSelect setCorporation={setCorp} />
        <CorpAssetLocSelect corporation_id={corporation_id} setLocation={setLocation} />
        <CorpAssetGroups corporation_id={corporation_id} location_id={location} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CorpAssets;
