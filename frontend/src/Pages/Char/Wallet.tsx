import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { loadWallet } from "../../api/character";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ChangeEvent, useState } from "react";
import { Form } from "react-bootstrap";
import RefTypeLabel from "../../Components/Helpers/RefTypeLabel";
import { getRefTypeLabel } from "../../Components/Helpers/refTypeFormat";

const CharacterWallet = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const [showAll, setShowAll] = useState(true);

  const { data, isFetching } = useQuery({
    queryKey: ["wallet", characterID],
    queryFn: () => loadWallet(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterWalletEvent"]>();

  const columns: ColumnDef<components["schemas"]["CharacterWalletEvent"], unknown>[] = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
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
    columnHelper.accessor("description", {
      header: t("Description"),
      cell: (cell) => {
        return <span style={{ whiteSpace: "pre-line" }}>{cell.getValue()}</span>;
      },
    }),
    columnHelper.accessor("reason", {
      header: t("Reason"),
      cell: (cell) => {
        return <span style={{ whiteSpace: "pre-line" }}>{cell.getValue()}</span>;
      },
    }),
  ];

  const data_out = data?.filter((row) => {
    if (showAll) {
      return true;
    } else {
      return !row.own_account;
    }
  });
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label={t("Show Own Account Activity")}
        className="float-end"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setShowAll(event.target.checked);
        }}
        defaultChecked={showAll}
      />

      <TableWrapper data={data_out} {...{ isFetching, columns }} />
    </>
  );
};

export default CharacterWallet;
