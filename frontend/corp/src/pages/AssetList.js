import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import CorpAssetLocSelect from "../components/CorpAssetLocSelect";
import ErrorBoundary from "../components/ErrorBoundary";
import CorpSelect from "../components/CorpSelect";
import CorpAssetTable from "../components/CorpAssetTable";

const CorpAssetLists = () => {
  const [location, setLocation] = useState(0);
  const [corporation_id, setCorp] = useState(0);

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <CorpSelect setCorporation={setCorp} />
        <CorpAssetLocSelect
          corporation_id={corporation_id}
          setLocation={setLocation}
        />
        <CorpAssetTable
          corporation_id={corporation_id}
          location_id={location}
        />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CorpAssetLists;
