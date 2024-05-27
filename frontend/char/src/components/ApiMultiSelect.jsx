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

export const ApiMultiSelect = ({ setValue, apiLookup, defaultOptions }) => {
  const handleState = (entry) => {
    let values = entry.map((o) => {
      return o.value;
    });
    console.log(values.sort().join(","));
    setValue(values.sort());
  };

  return (
    <AsyncSelect
      className="col-xs-12"
      styles={colourStyles}
      loadOptions={apiLookup}
      defaultOptions={defaultOptions}
      isMulti={true}
      onChange={handleState}
    />
  );
};
