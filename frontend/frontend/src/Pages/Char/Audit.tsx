import { CharHeader } from "../../Components/Character/CharacterHeader";
import { CharMenuAsync } from "../../Components/CharacterMenu/CharacterMenuAsync";
import { CharMenuRight } from "../../Components/CharacterMenu/CharacterMenuRight";
import { Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const CharacterAudit = () => {
  return (
    <>
      <CharMenuAsync />
      <CharMenuRight />
      <CharHeader />
      <Col>
        <div className="mt-4">
          <Outlet /> {/* Render the Children here */}
        </div>
      </Col>
    </>
  );
};

export default CharacterAudit;
