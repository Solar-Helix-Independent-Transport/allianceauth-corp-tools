import CharMenu from "./CharMenu";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharMenuAsync = () => {
  let { characterID } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["Menu"],
    queryFn: async () => {
      const api = await axios.get(`/audit/api/account/menu`);
      return api.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <CharMenu
      error={error ? true : false}
      characterID={String(characterID)}
      {...{ isLoading, data }}
    />
  );
};

export { CharMenuAsync };
