import { CorpMenuPortal } from "../../Components/CorporationMenu/CorpMenuPortal";
import { CorpMenuRight } from "../../Components/CorporationMenu/CorpMenuRight";
import { Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../../Components/Helpers/ErrorBoundary";

const CharacterAudit = () => {
  return (
    <>
      <CorpMenuPortal />
      <CorpMenuRight />
      <Col>
        <ErrorBoundary>
          <Outlet /> {/* Render the Children here */}
        </ErrorBoundary>
      </Col>
    </>
  );
};

export default CharacterAudit;
