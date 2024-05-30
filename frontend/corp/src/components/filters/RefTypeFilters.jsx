import { loadRefTypes } from "../../apis/Corporation";
import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";

const colourStyles = {
  option: (styles) => {
    return {
      ...styles,
      color: "black",
    };
  },
};

export const RefTypeSelect = ({ setFilter, labelText }) => {
  const { isFetching, data } = useQuery(["ref_types"], () => loadRefTypes(), {
    initialData: [],
  });
  let options = data.map((ref) => {
    return {
      value: ref,
      label: ref,
    };
  });
  return (
    <div className="flex-label-container">
      <div className="flex-label">
        <h5>{labelText}</h5>
      </div>
      <Select
        className="flex-select"
        styles={colourStyles}
        options={options}
        isLoading={isFetching}
        isMulti={true}
        onChange={setFilter}
      />
    </div>
  );
};
