import { loadAssetLocations } from "../apis/Character";
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

const CharAssetLocSelect = ({ character_id, setLocation }) => {
  const { isLoading, data } = useQuery(
    ["asset_loc", character_id],
    () => loadAssetLocations(character_id),
    { refetchOnWindowFocus: false }
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
