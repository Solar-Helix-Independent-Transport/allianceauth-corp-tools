import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";

function MyTooltip({ bad_chars }) {
  return <Tooltip id="character_tooltip">{bad_chars.join(", ")}</Tooltip>;
}

function CharActiveBadge({ characters }) {
  const bad_chars = characters
    .filter((char) => !char.active)
    .map((char) => char.character.character_name);

  return (
    <>
      {bad_chars.length == 0 ? (
        <Button className="btn-success">Status</Button>
      ) : (
        <OverlayTrigger placement="top" overlay={MyTooltip({ bad_chars })}>
          <Button className="btn-danger" href={`#/account/status`}>
            {bad_chars.length} Characters Require Attention
          </Button>
        </OverlayTrigger>
      )}
    </>
  );
}

export default CharActiveBadge;
