import CharacterContractModal from "../../Components/Character/CharacterContractModal";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterContracts } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterContracts = () => {
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
      header: "Character",
    }),
    columnHelper.accessor("date_issued", {
      header: "Date Created",
    }),
    columnHelper.accessor("contract_type", {
      header: "Type",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("assignee", {
      header: "Assignee",
    }),
    columnHelper.accessor("price", {
      header: "Price",
    }),
    columnHelper.accessor("tittle", {
      header: "Tittle",
    }),
    columnHelper.accessor("items", {
      header: "Details",
      cell: (cell) => (
        <>
          <Button
            className="w-100"
            onClick={() => {
              setData(cell.row.original);
              setModal(true);
            }}
          >
            Show Detail
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
