import { useTranslation } from "react-i18next";
import { BooleanCheckBox } from "../../Components/BooleanCheckbox";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterRoles } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterRoles = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["roles", characterID],
    queryFn: () => getCharacterRoles(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterRoles"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("character.corporation_name", {
      header: t("Corporation"),
    }),
    columnHelper.accessor("director", {
      header: t("Director"),
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("station_manager", {
      header: t("Station Manager"),
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("personnel_manager", {
      header: t("Personnel Manager"),
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("accountant", {
      header: t("Accountant"),
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("titles", {
      header: t("Titles"),
      cell: (props) => {
        return props.getValue()?.map((title) => {
          return <Badge bg="secondary">{title.name}</Badge>;
        });
      },
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterRoles;
