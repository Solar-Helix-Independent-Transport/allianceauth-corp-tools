import { Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../../Components/Helpers/ErrorBoundary";

// Deliberately no CorpMenuPortal/CorpMenuRight here (unlike Pages/Corp/Audit)
// - this area isn't scoped to one selected corp, it's a single alliance-wide
// public dashboard, so there's no per-corp menu or corp picker to show.
const DashAudit = () => {
  return (
    <Col>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </Col>
  );
};

export default DashAudit;
