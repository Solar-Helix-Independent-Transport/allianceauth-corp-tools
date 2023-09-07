import { loadPubData } from "../../api/character";
import CharacterPubDataPanels from "../../components/character/CharacterPubDataPanels";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterPubData = () => {
  let { characterID } = useParams();

  const { data, isFetching } = useQuery(["status", characterID], () => loadPubData(characterID), {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {/* <CharacterStatusPanels {...{ isFetching }} data={data} /> */}
      <CharacterPubDataPanels {...{ isFetching }} data={data} />
    </>
  );
};

export default CharacterPubData;
