import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterLP } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterLP = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["LP", characterID],
    queryFn: () => getCharacterLP(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["LoyaltyPoints"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("character.corporation_name", {
      header: "Corporation",
    }),
    columnHelper.accessor("corporation.name", {
      header: "LP Corporation",
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterLP;
