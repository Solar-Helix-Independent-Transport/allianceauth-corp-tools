import React from "react";
import { Bars } from "@agney/react-loading";
import { Panel } from "react-bootstrap";
import "./PanelLoader.css";

export const PanelLoader = () => {
  return (
    <Panel.Body className="flex-container">
      <Bars className="spinner-size" />
    </Panel.Body>
  );
};
