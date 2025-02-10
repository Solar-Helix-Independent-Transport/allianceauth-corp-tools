import { BooleanCheckBox } from "../../Components/BooleanCheckbox";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterContacts } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { Badge, Card, Form } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterContacts = () => {
  const { characterID } = useParams();
  const [showNPC, setShowNPC] = useState(true);

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
      cell: (cell) => {
        return (
          <>
            {cell.getValue()} {cell.row.original.contact.id <= 4000000 && <Badge>NPC</Badge>}
          </>
        );
      },
    }),
    columnHelper.accessor("blocked", {
      header: "Blocked",
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("watched", {
      header: "Watching",
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("standing", {
      header: "Standing",
    }),
    columnHelper.accessor("contact.cat", {
      header: "Type",
    }),
  ];

  const data_filtered = data?.filter((row: any) => {
    if (!showNPC) {
      return row.contact.id > 4000000;
    } else {
      return true;
    }
  });

  return (
    <>
      <Card.Header className="text-end">
        <div className="d-flex justify-content-end">
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Show NPC Contacts"
            onChange={(event) => {
              setShowNPC(event.target.checked);
            }}
            defaultChecked={showNPC}
          />
        </div>
      </Card.Header>
      <TableWrapper data={data_filtered} {...{ isFetching, columns }} />
    </>
  );
};

export default CharacterContacts;
