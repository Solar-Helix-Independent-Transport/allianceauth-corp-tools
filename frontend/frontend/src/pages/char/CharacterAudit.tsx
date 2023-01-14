import { CharMenuAsync } from "../../components";
import React from "react";
import { Panel } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const CharacterAudit = () => {
  return (
    <>
      <CharMenuAsync />
      <Col>
        <Panel>
          <Outlet /> {/* Render the Children here */}
        </Panel>
      </Col>
    </>
  );
};

export default CharacterAudit;
