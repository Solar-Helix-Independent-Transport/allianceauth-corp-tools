import CharacterPubDataPanels from "../../Components/Character/CharacterPubDataPanels";
import { loadPubData } from "../../api/character";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterPubData = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery(
    ["pubdata", characterID],
    () => loadPubData(characterID ? Number(characterID) : 0),
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      {/* <CharacterStatusPanels {...{ isFetching }} data={data} /> */}
      <CharacterPubDataPanels {...{ isFetching, data }} />
    </>
  );
};

export default CharacterPubData;
