import CharHeader from "../components/CharHeader";
import CharMenu from "../components/CharMenu";
import React from "react";
import { Panel } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";

const CharacterAudit = () => {
  let { characterID } = useParams();
  return (
    <>
      <CharHeader character_id={characterID}></CharHeader>
      <CharMenu character_id={characterID}></CharMenu>
      <Col>
        <Panel>
          <Outlet /> {/* Render the Children here */}
        </Panel>
      </Col>
    </>
  );
};

export default CharacterAudit;
