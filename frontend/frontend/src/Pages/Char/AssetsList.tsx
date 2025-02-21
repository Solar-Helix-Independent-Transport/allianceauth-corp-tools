import { useTranslation } from "react-i18next";
import CharacterAssetLocationSelect from "../../Components/Character/CharacterAssetLocationSelect";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { loadAssetList } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterAssets = () => {
  const { t } = useTranslation();
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
      header: t("Character"),
    }),
    columnHelper.accessor("item.name", {
      header: t("Item Type"),
    }),
    columnHelper.accessor("item.cat", {
      header: t("Category"),
    }),
    columnHelper.accessor("quantity", {
      header: t("Quantity"),
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor("location.name", {
      header: t("Location"),
    }),
  ];

  return (
    <>
      <div className="m-3 d-flex align-items-center">
        <h5 className="me-1">{t("Location Filter")}</h5>
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
