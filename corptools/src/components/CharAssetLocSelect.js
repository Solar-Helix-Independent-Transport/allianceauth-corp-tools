import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import { loadAssetLocations } from "../apis/Character";

const CharAssetLocSelect = ({ character_id, setLocation }) => {
  const { isLoading, error, data } = useQuery(["asset_loc", character_id], () =>
    loadAssetLocations(character_id)
  );

  return (
    <Select
      isLoading={isLoading}
      options={data}
      onChange={(e) => setLocation(e.value)}
    />
  );
};

export default CharAssetLocSelect;
