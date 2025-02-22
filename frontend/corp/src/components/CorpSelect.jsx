import { loadStatus } from "../apis/Corporation";
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
  menuList: (base) => ({ ...base, zIndex: 9999 }),
};

const CorpSelect = ({ setCorporation }) => {
  const { isLoading, data } = useQuery(["corp-status"], () => loadStatus());
  let options = [];
  if (!isLoading) {
    options = data.corps.map((corp) => {
      return {
        value: corp.corporation.corporation_id,
        label: corp.corporation.corporation_name,
      };
    });
    if (data.corps.length === 1) {
      setCorporation(options[0].value);
    }
  }
  return (
    <div className="flex-label-container">
      <div className="flex-label">
        <h5>Corporation Select:</h5>
      </div>
      <Select
        className="flex-select"
        isLoading={isLoading}
        styles={colourStyles}
        options={options}
        onChange={(e) => setCorporation(e.value)}
      />
    </div>
  );
};

export default CorpSelect;
