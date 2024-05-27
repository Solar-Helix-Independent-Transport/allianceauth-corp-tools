import React, { useState } from "react";
import { Collapse, Glyphicon } from "react-bootstrap";

export function PanelCollapseBlock({ children, heading }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h4 className="text-center full-width">
        {heading}
        <Glyphicon
          onClick={() => setOpen(!open)}
          className="pull-right"
          glyph={open ? "menu-up" : "menu-down"}
        />
      </h4>

      <Collapse in={open}>{children}</Collapse>
    </>
  );
}
