import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterMarket } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterMarket = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["market", characterID],
    queryFn: () => getCharacterMarket(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterOrder"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("buy_order", {
      header: t("Buy Order"),
      cell: (cell) => {
        return cell.getValue() === true ? (
          <i className="fa-solid fa-square-check text-success text-center w-100"></i>
        ) : (
          <i className="fa-solid fa-square-xmark text-warning text-center w-100"></i>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: t("Date"),
      cell: (row) => {
        return `${new Date(row.getValue()).toUTCString()}`;
      },
    }),
    columnHelper.accessor("item.name", {
      header: t("Item Type"),
    }),
    columnHelper.accessor("location.name", {
      header: t("Location"),
    }),
    columnHelper.accessor("price", {
      header: () => <span className="ms-auto">{t("Price")}</span>,
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor("volume_remain", {
      header: () => <span className="ms-auto">{t("Volume")}</span>,
      cell: (cell) => {
        return `${cell.getValue().toLocaleString()}/${cell.row.original.volume_total.toLocaleString()}`;
      },
    }),
  ];

  return (
    <>
      <h4 className="text-center">{t("Active Orders")}</h4>
      <TableWrapper data={data?.active} {...{ isFetching, columns }} />
      <h4 className="text-center">{t("Expired Orders")}</h4>
      <TableWrapper data={data?.expired} {...{ isFetching, columns }} />
    </>
  );
};

export default CharacterMarket;
