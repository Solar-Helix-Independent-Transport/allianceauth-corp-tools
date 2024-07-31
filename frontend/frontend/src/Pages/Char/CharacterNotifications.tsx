import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterNotifications } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterNotifications = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["wallet", characterID],
    queryFn: () => getCharacterNotifications(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterNotification"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("timestamp", {
      header: "Date",
    }),
    columnHelper.accessor("notification_type", {
      header: "Type",
    }),
    columnHelper.accessor("notification_text", {
      header: "Text",
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterNotifications;
