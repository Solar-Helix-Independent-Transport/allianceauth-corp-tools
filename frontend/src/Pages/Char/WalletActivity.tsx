import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { loadWalletActivity } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Form } from "react-bootstrap";
import WalletActivityChord from "../../Components/Graphs/WalletActivityChord";

const CharacterWalletActivity = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const [showAll, setShowAll] = useState(true);

  const { data, isFetching } = useQuery({
    queryKey: ["wallet-activity", characterID],
    queryFn: () => loadWalletActivity(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("fpn", {
      header: t("From"),
      cell: (cell) => (
        <div className="d-flex justify-content-between align-items-center">
          {cell.getValue()}
          <a
            className="btn btn-sm btn-primary"
            href={`https://zkillboard.com/${cell.row.original.firstParty.cat}/${cell.row.original.firstParty.id}/`}
          >
            <i className="fa fa-external-link" aria-hidden="true"></i>
          </a>
        </div>
      ),
    }),
    columnHelper.accessor("spn", {
      header: t("To"),
      cell: (cell) => (
        <div className="d-flex justify-content-between align-items-center">
          {cell.getValue()}
          <a
            className="btn btn-sm btn-primary"
            href={`https://zkillboard.com/${cell.row.original.secondParty.cat}/${cell.row.original.secondParty.id}/`}
          >
            <i className="fa fa-external-link" aria-hidden="true"></i>
          </a>
        </div>
      ),
    }),
    columnHelper.accessor("value", {
      header: () => <span className="ms-auto">{t("Amount")}</span>,
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor("interactions", {
      header: () => <span className="ms-auto">{t("Interaction Count")}</span>,
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
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
      <div className="d-flex justify-content-end mb-2">
        <Form.Check
          type="switch"
          id="custom-switch"
          label={t("Show Own Account Activity")}
          onChange={(event: any) => setShowAll(event.target.checked)}
          defaultChecked={showAll}
        />
      </div>
      <WalletActivityChord data={data_out ?? []} />
      <TableWrapper data={data_out} {...{ isFetching, columns }} />
    </>
  );
};

export default CharacterWalletActivity;
