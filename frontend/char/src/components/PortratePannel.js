import React from "react";
import { Panel, Glyphicon } from "react-bootstrap";
import CharacterPortrait from "./CharacterPortrait";

export function PortraitPanel({
  children,
  character,
  panelStyles = {},
  isFetching = false,
  headerIcon = false,
}) {
  return (
    <Panel
      key={"panel " + character.character_name}
      {...panelStyles}
      className={"flex-child"}
    >
      <Panel.Heading>
        <h4 className={"text-center"}>
          {headerIcon ? { headerIcon } : <></>}
          {character.character_name}
          {isFetching ? (
            <Glyphicon
              className="glyphicon-refresh-animate pull-right"
              glyph="refresh"
            />
          ) : (
            <></>
          )}
        </h4>
      </Panel.Heading>
      <Panel.Body className="flex-container flex-body">
        <CharacterPortrait character={character} />
        {children}
      </Panel.Body>
    </Panel>
  );
}
