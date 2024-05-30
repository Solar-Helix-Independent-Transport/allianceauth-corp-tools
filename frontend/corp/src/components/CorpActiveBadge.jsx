import React from "react";
import { Button, ButtonGroup, Glyphicon, OverlayTrigger, Tooltip } from "react-bootstrap";

//import { useMutation } from "react-query";
//import { postAccountRefresh } from "../apis/Character";
function MyTooltip({ message }) {
  return <Tooltip id="character_tooltip">{message}</Tooltip>;
}

function CorpActiveBadge() {
  //const { mutate } = useMutation(postAccountRefresh);

  return (
    <ButtonGroup>
      <OverlayTrigger placement="top" overlay={MyTooltip({ message: "Add New Corporation Token" })}>
        <Button className="btn-info" href="/audit/corp/add/">
          <Glyphicon glyph="plus" />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={MyTooltip({ message: "Refresh Corporation Data" })}>
        <Button className="btn-success">
          <Glyphicon glyph="refresh" />
        </Button>
      </OverlayTrigger>
    </ButtonGroup>
  );
}

export default CorpActiveBadge;
