import CharAssetLocSelect from "../components/CharAssetLocSelect";
import CharAssetTable from "../components/CharAssetTable";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import { useParams } from "react-router-dom";

const AuditAdmin = () => {
  return (
    <ErrorBoundary>
      <h1>Audit Admin!</h1>
      <Panel.Body className="flex-container"></Panel.Body>
    </ErrorBoundary>
  );
};

export default AuditAdmin;
