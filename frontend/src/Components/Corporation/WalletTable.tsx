import { useTranslation } from "react-i18next";
import TableWrapper from "../Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { loadWallet } from "../../api/corporation";

const CorporationWalletTable = ({
  corporationID,
  refTypes,
}: {
  corporationID: number;
  refTypes: string;
}) => {
  const { t } = useTranslation();

  const page = 1;

  const { data, isFetching } = useQuery({
    queryKey: ["wallet", corporationID, refTypes, page],
    queryFn: () => loadWallet(Number(corporationID), refTypes, page),
    refetchOnWindowFocus: false,
    initialData: { characters: [], main: undefined, headers: [] },
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("date", {
      header: t("Date"),
    }),
    columnHelper.accessor("ref_type", {
      header: t("Type"),
      cell: (cell) => (
        <span style={{ textTransform: "capitalize" }}>{cell.getValue().replaceAll("_", " ")}</span>
      ),
    }),
    columnHelper.accessor("division", {
      header: t("Division"),
    }),
    columnHelper.accessor("first_party.name", {
      header: t("First Party"),
    }),
    columnHelper.accessor("second_party.name", {
      header: t("Second Party"),
    }),
    columnHelper.accessor("amount", {
      header: () => <span className="ms-auto">{t("Amount")}</span>,
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor("balance", {
      header: () => <span className="ms-auto">{t("Balance")}</span>,
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor("reason", {
      header: t("Reason"),
    }),
  ];

  return (
    <>
      <TableWrapper {...{ isFetching, data, columns }} />
    </>
  );
};

export default CorporationWalletTable;
