import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterMarket } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterMarket = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["market", characterID],
    queryFn: () => getCharacterMarket(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterOrder"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("buy_order", {
      header: "Buy Order",
      cell: (cell) => {
        return cell.getValue() === true ? (
          <i className="fa-solid fa-square-check text-success text-center w-100"></i>
        ) : (
          <i className="fa-solid fa-square-xmark text-warning text-center w-100"></i>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (row) => {
        return `${new Date(row.getValue()).toUTCString()}`;
      },
    }),
    columnHelper.accessor("item.name", {
      header: "Type",
    }),
    columnHelper.accessor("location.name", {
      header: "Location",
    }),
    columnHelper.accessor("price", {
      header: "Price",
    }),
    columnHelper.accessor("volume_remain", {
      header: "Volume",
      cell: (cell) => {
        return `${cell.getValue()}/${cell.row.original.volume_total}`;
      },
    }),
  ];

  return (
    <>
      <h4 className="text-center">Active Orders</h4>
      <TableWrapper data={data?.active} {...{ isFetching, columns }} />
      <h4 className="text-center">Expired Orders</h4>
      <TableWrapper data={data?.expired} {...{ isFetching, columns }} />
    </>
  );
};

export default CharacterMarket;
