import React from "react";
import { FormControl } from "react-bootstrap";

export const TextFilter = ({ setFilterText, labelText }) => {
  return (
    <div className="flex-label-container">
      <div className="flex-label">
        <h5>{labelText}</h5>
      </div>
      <FormControl
        className="flex-select"
        type="text"
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>
  );
};
