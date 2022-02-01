import React from "react";
import {
  Button,
  ButtonGroup,
  Glyphicon,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { useMutation } from "react-query";
import { postAccountRefresh } from "../apis/Character";
function MyTooltip({ message }) {
  return <Tooltip id="character_tooltip">{message}</Tooltip>;
}

function CharActiveBadge({ characters, character_id }) {
  const bad_chars = characters
    .filter((char) => !char.active)
    .map((char) => char.character.character_name);
  const { mutate } = useMutation(postAccountRefresh);

  return (
    <ButtonGroup>
      <OverlayTrigger
        placement="top"
        overlay={MyTooltip({ message: "Add New Token" })}
      >
        <Button className="btn-info" href="/audit/char/add/">
          <Glyphicon glyph="plus" />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        overlay={MyTooltip({ message: "Refresh Account" })}
      >
        <Button className="btn-success" onClick={() => mutate(character_id)}>
          <Glyphicon glyph="refresh" />
        </Button>
      </OverlayTrigger>
      {bad_chars.length === 0 ? (
        <OverlayTrigger
          placement="bottom"
          overlay={MyTooltip({ message: "No Account Flags" })}
        >
          <Button className="btn-success">
            <Glyphicon glyph="ok" />
          </Button>
        </OverlayTrigger>
      ) : (
        <OverlayTrigger
          placement="bottom"
          overlay={MyTooltip({
            message: `Character Flags: ${bad_chars.join(", ")}`,
          })}
        >
          <Button className="btn-danger" href={`#/account/status`}>
            {bad_chars.length}
          </Button>
        </OverlayTrigger>
      )}
    </ButtonGroup>
  );
}

export default CharActiveBadge;
