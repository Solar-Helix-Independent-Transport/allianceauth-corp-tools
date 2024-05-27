import "./PanelLoader.css";
import { Bars } from "@agney/react-loading";
import React from "react";
import { Panel } from "react-bootstrap";

export const PanelLoader = () => {
  return (
    <Panel.Body className="flex-container">
      <Bars className="spinner-size" />
    </Panel.Body>
  );
};
