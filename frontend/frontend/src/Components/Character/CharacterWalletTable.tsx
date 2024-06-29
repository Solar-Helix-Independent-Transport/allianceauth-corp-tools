import BaseTable from "../Tables/BaseTable/BaseTable";
import { createColumnHelper } from "@tanstack/react-table";

type Character = {
  character_name: string;
  corporation_name: string;
  alliance_name: string;
};

type BaseItemType = {
  id: number;
  name: string;
  cat: string;
};

type AssetType = {
  character: Character;
  item: BaseItemType;
  location: BaseItemType;
  active: boolean;
  quantity: number;
};

const CharacterAssetTable = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  const columnHelper = createColumnHelper<AssetType>();

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

  return <BaseTable {...{ isFetching, columns, data }} />;
};

export default CharacterAssetTable;
