import React, { useState } from "react";
import { Collapse, Glyphicon } from "react-bootstrap";

export declare interface ColapseBlockProps {
  children: React.ReactNode; // best, accepts everything React can render
  style?: React.CSSProperties; // to pass through style props
  heading: String;
}

export function CollapseBlock({ heading, children }: ColapseBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h4 className="full-width">
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
