import { CharHeader } from "../../Components/Character/CharacterHeader";
import { CharMenuAsync } from "../../Components/CharacterMenu/CharacterMenuAsync";
import { CharMenuRight } from "../../Components/CharacterMenu/CharacterMenuRight";
import { Card, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const CharacterAudit = () => {
  return (
    <>
      <CharMenuAsync />
      <CharMenuRight />
      <CharHeader />
      <Col>
        <Card className="mt-4">
          <Outlet /> {/* Render the Children here */}
        </Card>
      </Col>
    </>
  );
};

export default CharacterAudit;
