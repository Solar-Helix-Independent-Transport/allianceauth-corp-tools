import CharacterAssetLocationSelect from "../../Components/Character/CharacterAssetLocationSelect";
import CharacterAssetTable from "../../Components/Character/CharacterAssetsTable";
import { loadAssetList } from "../../api/character";
import { useState } from "react";
import { Card } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterAssets = () => {
  const { characterID } = useParams();

  const [location_id, setLocation] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["assetList", characterID, location_id],
    queryFn: () => loadAssetList(Number(characterID), location_id),
    refetchOnWindowFocus: false,
    initialData: { characters: [], main: undefined, headers: [] },
  });

  return (
    <>
      <Card.Title className="mt-3 text-center">Location Filter</Card.Title>
      <div className="m-3">
        <CharacterAssetLocationSelect {...{ characterID, setLocation }} />
      </div>
      <CharacterAssetTable {...{ isFetching, data }} />
    </>
  );
};

export default CharacterAssets;
