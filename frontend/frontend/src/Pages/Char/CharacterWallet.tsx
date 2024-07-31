import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { loadWallet } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterWallet = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["wallet", characterID],
    queryFn: () => loadWallet(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterWalletEvent"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("date", {
      header: "Date",
    }),
    columnHelper.accessor("ref_type", {
      header: "Type",
    }),
    columnHelper.accessor("first_party.name", {
      header: "First Party",
    }),
    columnHelper.accessor("second_party.name", {
      header: "Second Party",
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
    }),
    columnHelper.accessor("balance", {
      header: "Balance",
    }),
    columnHelper.accessor("reason", {
      header: "Reason",
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterWallet;
