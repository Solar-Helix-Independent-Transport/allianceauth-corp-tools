import CorpSelect from "../components/CorpSelect";
import CorpWalletTable from "../components/CorpWalletTable";
import ErrorBoundary from "../components/ErrorBoundary";
import { CorpLoader } from "../components/NoCorp";
import { RefTypeSelect } from "../components/filters/RefTypeFilters";
import React, { useState } from "react";
import { Panel } from "react-bootstrap";

const CorpWallet = () => {
  const [corporation_id, setCorp] = useState(0);
  const [ref_types, setRefs] = useState("");

  const RefsToState = (entry) => {
    let values = entry.map((o) => {
      return o.value;
    });
    console.log(values.sort().join(","));
    setRefs(values.sort().join(","));
  };
  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <RefTypeSelect labelText={"Reference Type Filter"} setFilter={RefsToState} />
        <CorpSelect setCorporation={setCorp} />
        {corporation_id && ref_types !== "" ? (
          <CorpWalletTable corporation_id={corporation_id} refTypes={ref_types} />
        ) : (
          <CorpLoader />
        )}
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CorpWallet;
