import { CharHeader } from "../../Components/Character/CharacterHeader";
import { CharMenuAsync } from "../../Components/CharacterMenu/CharacterMenuAsync";
import { CharMenuRight } from "../../Components/CharacterMenu/CharacterMenuRight";
import { Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../../Components/Helpers/ErrorBoundary";

const CharacterAudit = () => {
  return (
    <>
      <CharMenuAsync />
      <CharMenuRight />
      <CharHeader />
      <Col>
        <div className="mt-4">
          <ErrorBoundary>
            <Outlet /> {/* Render the Children here */}
          </ErrorBoundary>
        </div>
      </Col>
    </>
  );
};

export default CharacterAudit;
