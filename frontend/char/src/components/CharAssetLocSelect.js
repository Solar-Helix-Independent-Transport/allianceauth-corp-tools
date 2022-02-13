import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import { loadAssetLocations } from "../apis/Character";

const colourStyles = {
  option: (styles) => {
    return {
      ...styles,
      color: "black",
    };
  },
};

const CharAssetLocSelect = ({ character_id, setLocation }) => {
  const { isLoading, data } = useQuery(["asset_loc", character_id], () =>
    loadAssetLocations(character_id)
  );

  return (
    <Select
      isLoading={isLoading}
      styles={colourStyles}
      options={data}
      onChange={(e) => setLocation(e.value)}
    />
  );
};

export default CharAssetLocSelect;
