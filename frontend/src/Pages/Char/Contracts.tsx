import CharacterContractModal from "../../Components/Character/CharacterContractModal";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterContracts } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterContracts = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const [showModal, setModal] = useState(false);
  const [modalData, setData] = useState(null as components["schemas"]["CharacterContract"] | null);

  const { data, isFetching } = useQuery({
    queryKey: ["contracts", characterID],
    queryFn: () => getCharacterContracts(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterContract"]>();

  const columns = [
    columnHelper.accessor("character", {
      header: t("Character"),
    }),
    columnHelper.accessor("date_issued", {
      header: t("Date Created"),
    }),
    columnHelper.accessor("contract_type", {
      header: t("Type"),
    }),
    columnHelper.accessor("status", {
      header: t("Status"),
    }),
    columnHelper.accessor("assignee", {
      header: t("Assignee"),
    }),
    columnHelper.accessor("price", {
      header: t("Price"),
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor("tittle", {
      header: t("Tittle"),
    }),
    columnHelper.accessor("items", {
      header: t("Details"),
      cell: (cell) => (
        <>
          <Button
            className="w-100"
            onClick={() => {
              setData(cell.row.original);
              setModal(true);
            }}
          >
            {t("Show Detail")}
          </Button>
        </>
      ),
    }),
  ];

  return (
    <>
      <TableWrapper data={data} {...{ isFetching, columns }} />
      <CharacterContractModal data={modalData} shown={showModal} setShown={setModal} />
    </>
  );
};

export default CharacterContracts;
