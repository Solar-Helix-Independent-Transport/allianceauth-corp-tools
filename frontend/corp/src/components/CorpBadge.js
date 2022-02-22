import React from "react";

import { Glyphicon, Tooltip, OverlayTrigger, NavItem } from "react-bootstrap";
import { useMutation } from "react-query";
import { postCorporationRefresh } from "../apis/Corporation";
function MyTooltip({ message }) {
  return <Tooltip id="character_tooltip">{message}</Tooltip>;
}

function CorpBadge() {
  const { mutate } = useMutation(postCorporationRefresh);

  return (
    <>
      <NavItem href="/audit/corp/add">
        <OverlayTrigger
          placement="top"
          overlay={MyTooltip({ message: "Add New Token" })}
        >
          <Glyphicon glyph="plus" />
        </OverlayTrigger>
      </NavItem>
      <NavItem onClick={() => mutate()}>
        <Glyphicon glyph="refresh" />
      </NavItem>
    </>
  );
}

export default CorpBadge;
