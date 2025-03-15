import { useTranslation } from "react-i18next";
import { BooleanCheckBox } from "../../Components/BooleanCheckbox";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterNotifications } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterNotifications = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["notification", characterID],
    queryFn: () => getCharacterNotifications(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterNotification"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("is_read", {
      header: t("Is Read"),
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue() ? true : false} />;
      },
    }),
    columnHelper.accessor("timestamp", {
      header: t("Date"),
      cell: (props) => {
        return <>{new Date(props.getValue()).toUTCString()}</>;
      },
      enableColumnFilter: false,
    }),
    columnHelper.accessor("notification_type", {
      header: t("Type"),
      cell: (cell) => (
        <span style={{ textTransform: "capitalize" }}>
          {cell
            ?.getValue()
            ?.match(/[A-Z][a-z]+/g)
            ?.join(" ")}
        </span>
      ),
    }),
    columnHelper.accessor("notification_text", {
      header: t("Text"),
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
