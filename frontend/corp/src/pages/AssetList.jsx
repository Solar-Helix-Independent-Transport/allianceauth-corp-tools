import CorpAssetLocSelect from "../components/CorpAssetLocSelect";
import CorpAssetTable from "../components/CorpAssetTable";
import CorpSelect from "../components/CorpSelect";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Checkbox, Panel } from "react-bootstrap";

const CorpAssetLists = () => {
  const [location, setLocation] = useState(0);
  const [corporation_id, setCorp] = useState(0);
  const [new_type, setAPI] = useState(true);

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <CorpSelect setCorporation={setCorp} />
        <div class="text-center">
          <Checkbox onChange={(e) => setAPI(e.target.checked)} defaultChecked={new_type}>
            Use New Location API
          </Checkbox>
        </div>
        <CorpAssetLocSelect corporation_id={corporation_id} setLocation={setLocation} />
        <CorpAssetTable
          corporation_id={corporation_id}
          location_id={location}
          new_type={new_type}
        />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CorpAssetLists;
