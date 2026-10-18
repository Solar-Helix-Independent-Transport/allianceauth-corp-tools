import { Col } from "react-bootstrap";
import { Outlet } from "react-router";
import PageErrorBoundary from "../../Components/Helpers/PageErrorBoundary";

// Deliberately no CorpMenuPortal/CorpMenuRight here (unlike Pages/Corp/Audit)
// - this area isn't scoped to one selected corp, it's a single alliance-wide
// public dashboard, so there's no per-corp menu or corp picker to show.
const DashAudit = () => {
  return (
    <Col>
      <PageErrorBoundary>
        <Outlet />
      </PageErrorBoundary>
    </Col>
  );
};

export default DashAudit;
