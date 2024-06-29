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
        <Card className="mt-4">
          <Outlet /> {/* Render the Children here */}
        </Card>
      </Col>
    </>
  );
};

export default CharacterAudit;
