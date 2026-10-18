import { CorpMenuPortal } from "../../Components/CorporationMenu/CorpMenuPortal";
import { CorpMenuRight } from "../../Components/CorporationMenu/CorpMenuRight";
import { Col } from "react-bootstrap";
import { Outlet } from "react-router";
import PageErrorBoundary from "../../Components/Helpers/PageErrorBoundary";

const CharacterAudit = () => {
  return (
    <>
      <CorpMenuPortal />
      <CorpMenuRight />
      <Col>
        <PageErrorBoundary>
          <Outlet /> {/* Render the Children here */}
        </PageErrorBoundary>
      </Col>
    </>
  );
};

export default CharacterAudit;
