import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { loadWallet } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Form } from "react-bootstrap";

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

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("date", {
      header: t("Date"),
    }),
    columnHelper.accessor("ref_type", {
      header: t("Type"),
      cell: (cell) => (
        <span style={{ textTransform: "capitalize" }}>{cell.getValue().replaceAll("_", " ")}</span>
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

  const data_out = data?.filter((row: any) => {
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
        onChange={(event: any) => {
          setShowAll(event.target.checked);
        }}
        defaultChecked={showAll}
      />

      <TableWrapper data={data_out} {...{ isFetching, columns }} />
    </>
  );
};

export default CharacterWallet;
