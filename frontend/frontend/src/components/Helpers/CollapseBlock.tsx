import React, { JSXElementConstructor, ReactElement, useState } from "react";
import { Collapse } from "react-bootstrap";
import { Row } from "react-bootstrap";

export declare interface CollapseBlockProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>; // best, accepts everything React can render
  style?: React.CSSProperties; // to pass through style props
  heading: String;
}

export function CollapseBlock({ heading, children }: CollapseBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Row className="justify-content-between flex-nowrap">
        <div className="w-auto">
          <h5>{heading}</h5>
        </div>
        <div className="w-auto">
          <h5>
            <i
              onClick={() => setOpen(!open)}
              className={`text-right fas fa-chevron-${open ? "up" : "down"} fa-fw`}
            ></i>
          </h5>
        </div>
      </Row>
      <Collapse in={open}>{children}</Collapse>
    </>
  );
}
