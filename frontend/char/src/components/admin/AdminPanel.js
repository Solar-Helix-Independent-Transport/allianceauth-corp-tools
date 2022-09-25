import React from "react";
import { Glyphicon, Panel } from "react-bootstrap";

const AdminPanel = ({
  title = "Admin Panel",
  children,
  character,
  panelStyles = {},
  isFetching = false,
  headerIcon = false,
}) => {
  return (
    <Panel key={`panel-${title}`} {...panelStyles} className={"flex-child"}>
      <Panel.Heading>
        <h4 className={"text-center"}>
          {headerIcon && <Glyphicon className="pull-left" glyph={headerIcon} />}
          {character.character_name}
          {isFetching && (
            <Glyphicon className="glyphicon-refresh-animate pull-right" glyph="refresh" />
          )}
        </h4>
      </Panel.Heading>
      <Panel.Body className="flex-container flex-body">{children}</Panel.Body>
    </Panel>
  );
};

export default AdminPanel;
