import { loadCharacterStatus } from "../../api/character";
import CharacterStatusTable from "../../components/CharacterStatusTable";
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
    <div className="d-flex justify-content-center align-items-center flex-row flex-wrap">
      <CharacterStatusTable {...{ isFetching }} data={data?.characters} />
    </div>
  );
};

export default CharacterStatus;
