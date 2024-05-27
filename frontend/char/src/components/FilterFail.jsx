import "./PanelLoader.css";
import React from "react";
import { Panel } from "react-bootstrap";

export const FilterFail = () => {
  return (
    <Panel.Body className="flex-container">
      <div className="text-center">
        <div className="error-size bottom-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            fill="currentColor"
            class="bi bi-search error-anim"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </div>
        <h3 className="text-margin">Nothing Matching Filter</h3>
      </div>
    </Panel.Body>
  );
};
