import { CharMenuAsync } from "../../components/CharacterMenu/CharacterMenuAsync";
import { CharMenuRight } from "../../components/CharacterMenu/CharacterMenuRight";
import { CharHeader } from "./CharacterHeader";
import React from "react";
import { Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const CharacterAudit = () => {
  return (
    <>
      <CharMenuAsync />
      <CharMenuRight />
      <CharHeader />
      <Col>
        <Outlet /> {/* Render the Children here */}
      </Col>
    </>
  );
};

export default CharacterAudit;
