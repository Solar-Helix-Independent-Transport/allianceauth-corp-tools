import { loadAssetLocations } from "../apis/Corporation";
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
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const CharAssetLocSelect = ({ corporation_id, setLocation }) => {
  const { isLoading, data } = useQuery(["asset_loc", corporation_id], () =>
    loadAssetLocations(corporation_id),
  );

  return (
    <div className="flex-label-container">
      <div className="flex-label">
        <h5>Location Select:</h5>
      </div>
      <Select
        className="flex-select"
        isLoading={isLoading}
        styles={colourStyles}
        options={data}
        isDisabled={!corporation_id ? true : false}
        onChange={(e) => setLocation(e.value)}
      />
    </div>
  );
};

export default CharAssetLocSelect;
