import CharacterAssetLocationSelect from "../../Components/Character/CharacterAssetLocationSelect";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { loadAssetList } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
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

  const columnHelper = createColumnHelper<components["schemas"]["CharacterAssetItem"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("item.name", {
      header: "Type",
    }),
    columnHelper.accessor("item.cat", {
      header: "Category",
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
    }),
    columnHelper.accessor("location.name", {
      header: "Location",
    }),
  ];

  return (
    <>
      <div className="m-3 d-flex align-items-center">
        <h5 className="me-1">Location Filter</h5>
        <div className="flex-grow-1">
          <CharacterAssetLocationSelect
            characterID={characterID ? Number(characterID) : 0}
            {...{ setLocation }}
          />
        </div>
      </div>
      <TableWrapper {...{ isFetching, data, columns }} />
    </>
  );
};

export default CharacterAssets;
