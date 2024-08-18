import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterContacts } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterContacts = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["contacts", characterID],
    queryFn: () => getCharacterContacts(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["Contact"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("contact.name", {
      header: "Contact",
    }),
    columnHelper.accessor("blocked", {
      header: "Blocked",
    }),
    columnHelper.accessor("watched", {
      header: "Watching",
    }),
    columnHelper.accessor("standing", {
      header: "Standing",
    }),
    columnHelper.accessor("contact.cat", {
      header: "Type",
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterContacts;
