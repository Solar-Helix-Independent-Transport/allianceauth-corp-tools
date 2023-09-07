import { loadCharacterStatus } from "../../api/character";
import CharacterStatusPanels from "../../components/character/CharacterStatusPanels";
import CharacterStatusTable from "../../components/character/CharacterStatusTable";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterStatus = () => {
  let { characterID } = useParams();

  const { data, isFetching } = useQuery(
    ["status", characterID],
    () => loadCharacterStatus(characterID),
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      {/* <CharacterStatusPanels {...{ isFetching }} data={data} /> */}
      <CharacterStatusTable {...{ isFetching }} data={data} />
    </>
  );
};

export default CharacterStatus;
