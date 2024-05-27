import React from "react";
import Select from "react-select";

const colourStyles = {
  option: (styles) => {
    return {
      ...styles,
      color: "black",
    };
  },
};

export const SelectFilter = ({ setFilter, options, labelText }) => {
  return (
    <div className="flex-label-container">
      <div className="flex-label">
        <h5>{labelText}</h5>
      </div>
      <Select
        className="flex-select"
        styles={colourStyles}
        options={options}
        onChange={(e) => setFilter(e.value)}
        defaultValue={options[0]}
      />
    </div>
  );
};
