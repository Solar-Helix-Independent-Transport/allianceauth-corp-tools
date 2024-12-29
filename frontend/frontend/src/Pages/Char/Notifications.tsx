import { BooleanCheckBox } from "../../Components/BooleanCheckbox";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterNotifications } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterNotifications = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["notification", characterID],
    queryFn: () => getCharacterNotifications(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterNotification"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("is_read", {
      header: "Is Read",
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue() ? true : false} />;
      },
    }),
    columnHelper.accessor("timestamp", {
      header: "Date",
      cell: (props) => {
        return <>{new Date(props.getValue()).toUTCString()}</>;
      },
      enableColumnFilter: false,
    }),
    columnHelper.accessor("notification_type", {
      header: "Type",
    }),
    columnHelper.accessor("notification_text", {
      header: "Text",
      cell: (props) => {
        return <pre>{props.getValue()}</pre>;
      },
      enableColumnFilter: false,
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterNotifications;
