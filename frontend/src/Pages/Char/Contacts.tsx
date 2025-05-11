import { BooleanCheckBox } from "../../Components/BooleanCheckbox";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterContacts } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { Badge, Button, ButtonGroup, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterContacts = () => {
  const { t } = useTranslation();
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
      header: t("Character"),
    }),
    columnHelper.accessor("contact.name", {
      header: t("Contact"),
      cell: (cell) => {
        return (
          <div className="text-nowrap">
            {cell.getValue()} {cell.row.original.contact.id <= 4000000 && <Badge>NPC</Badge>}
          </div>
        );
      },
    }),
    columnHelper.accessor("blocked", {
      header: t("Blocked"),
      cell: (props) => {
        return <BooleanCheckBox checked={props.getValue()} />;
      },
    }),
    columnHelper.accessor("watched", {
      header: t("Watching"),
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
    columnHelper.accessor("contact", {
      header: "Links",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (cell) => {
        return (
          cell.getValue().id > 4000000 && (
            <div className="d-flex flex-column text-nowrap justify-content-end">
              <ButtonGroup className="w-100">
                <Button
                  variant="link"
                  size="sm"
                  href={`https://zkillboard.com/${cell.getValue().cat}/${cell.getValue().id}`}
                  target="_blank"
                >
                  zKill
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  href={`https://evewho.com/${cell.getValue().cat}/${cell.getValue().id}`}
                  target="_blank"
                >
                  EVE Who
                </Button>
                {cell.getValue().cat == "character" && (
                  <>
                    <Button
                      variant="link"
                      size="sm"
                      href={`https://www.eve411.com/${cell.getValue().cat}/${cell.getValue().id}`}
                      target="_blank"
                    >
                      EVE411
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      href={`https://forums.eveonline.com/u/${cell
                        .getValue()
                        .name.replace(" ", "_")}/summary`}
                      target="_blank"
                    >
                      EVE Forums
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      href={`https://eve-search.com/search/author/${cell.getValue().name}`}
                      target="_blank"
                    >
                      EVE Search
                    </Button>
                  </>
                )}
              </ButtonGroup>
            </div>
          )
        );
      },
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
            onChange={(event: any) => {
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
