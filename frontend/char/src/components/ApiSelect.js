import React from "react";
import AsyncSelect from "react-select/async";

const colourStyles = {
  option: (styles) => {
    return {
      ...styles,
      color: "black",
    };
  },
};

export const ApiSelect = ({ setValue, apiLookup }) => {
  function handleChange(newValue) {
    console.log("Selected: " + newValue.label);
    setValue(newValue);
  }

  return (
    <AsyncSelect
      cacheOptions
      styles={colourStyles}
      loadOptions={apiLookup}
      defaultOptions={[]}
      onChange={handleChange}
    />
  );
};
