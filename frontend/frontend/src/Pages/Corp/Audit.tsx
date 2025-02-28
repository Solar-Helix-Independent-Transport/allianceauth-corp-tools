import { CorpMenuPortal } from "../../Components/CorporationMenu/CorpMenuPortal";
import { CorpMenuRight } from "../../Components/CorporationMenu/CorpMenuRight";
import { Card, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const CharacterAudit = () => {
  return (
    <>
      <CorpMenuPortal />
      <CorpMenuRight />
      <Col>
        <Outlet /> {/* Render the Children here */}
      </Col>
    </>
  );
};

export default CharacterAudit;
