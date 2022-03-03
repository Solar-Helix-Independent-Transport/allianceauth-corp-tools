import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import ErrorBoundary from "../components/ErrorBoundary";
import CorpSelect from "../components/CorpSelect";
import CorpWalletTable from "../components/CorpWalletTable";

const CorpWallet = () => {
  const [corporation_id, setCorp] = useState(0);

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <CorpSelect setCorporation={setCorp} />
        <CorpWalletTable corporation_id={corporation_id} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CorpWallet;
