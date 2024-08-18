import { BooleanCheckBox } from "../../Components/BooleanCheckbox";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterRoles } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterRoles = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["roles", characterID],
    queryFn: () => getCharacterRoles(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterRoles"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("character.corporation_name", {
      header: "Corporation",
    }),
    columnHelper.accessor("director", {
      header: "Director",
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("station_manager", {
      header: "Station Manager",
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("personnel_manager", {
      header: "Personnel Manager",
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("accountant", {
      header: "Accountant",
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("titles", {
      header: "Titles",
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
