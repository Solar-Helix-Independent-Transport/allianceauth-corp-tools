import ErrorBoundary from "../components/ErrorBoundary";
import React from "react";
import { Panel } from "react-bootstrap";

const AuditAdmin = () => {
  return (
    <ErrorBoundary>
      <h1>Audit Admin!</h1>
      <Panel.Body className="flex-container"></Panel.Body>
    </ErrorBoundary>
  );
};

export default AuditAdmin;
