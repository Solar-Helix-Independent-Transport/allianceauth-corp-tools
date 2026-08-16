import { useTranslation } from "react-i18next";
import TableWrapper from "../Tables/BaseTable/TableWrapper";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { loadWallet } from "../../api/corporation";
import { components } from "../../api/CtApi";
import RefTypeLabel from "../Helpers/RefTypeLabel";
import { getRefTypeLabel } from "../Helpers/refTypeFormat";

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
    initialData: [] as components["schemas"]["CorporationWalletEvent"][],
  });

  const columnHelper = createColumnHelper<components["schemas"]["CorporationWalletEvent"]>();

  const columns: ColumnDef<components["schemas"]["CorporationWalletEvent"], unknown>[] = [
    columnHelper.accessor("date", {
      header: t("Date"),
    }),
    // accessorFn (not the raw ref_type field) so the column filter's option
    // list - built from this accessor's own values, see BaseTableFilter's
    // SelectFilter - facets on the exact same friendly label the cell
    // renders, including RefTypeLabel's title-cased fallback for ref_types
    // the SDE doesn't have a name for yet, rather than the raw machine key.
    columnHelper.accessor((row) => getRefTypeLabel(row.ref_type, row.ref_type_name), {
      id: "ref_type",
      header: t("Type"),
      cell: (cell) => (
        <RefTypeLabel
          refType={cell.row.original.ref_type}
          name={cell.row.original.ref_type_name}
          description={cell.row.original.ref_type_description}
        />
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
