import { PortraitCard } from "../Cards/PortraitCard";
import { CollapseBlock } from "../Helpers/CollapseBlock";
import { Badge, Button, ButtonGroup, Card, Table } from "react-bootstrap";
import TimeAgo from "react-timeago";

const CharacterStatusPanels = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  return (
    <div className="d-flex justify-content-around align-items-center flex-row flex-wrap">
      {data?.characters.map((char: any) => {
        const char_status = char.active ? "success" : "warning";
        return (
          <PortraitCard
            border={char_status}
            //isFetching={isFetching}
            character={char.character}
            heading={char.character.character_name}
            roundedImages={"10"}
            isFetching={isFetching}
            portaitSize={450}
          >
            <div className="mt-2" style={{ width: "450px" }}>
              <Card.Text className={"text-center"}>
                {char.character.corporation_name}
                <br />
                {char.character.alliance_name ? char.character.alliance_name : <br />}
              </Card.Text>

              <Card.Text className={"text-center"}>
                Skill Points:{" "}
                <Badge className={"text-center"}>{char.sp && char.sp.toLocaleString()}</Badge>
                <br />
                Isk:{" "}
                <Badge className={"text-center"}>${char.isk && char.isk.toLocaleString()}</Badge>
              </Card.Text>
              <Card.Title className={"text-center"}>Location</Card.Title>
              <Card.Text className={"text-center"}>
                <Badge className={"text-center"}>
                  {char.location ? char.location : "Unknown Location"}
                </Badge>
                <br />
                <Badge className={"text-center"}>{char.ship ? char.ship : "Unknown Ship"}</Badge>
              </Card.Text>
              <Card.Text className={"text-center"}>
                <ButtonGroup className="w-75">
                  <Button
                    variant="secondary"
                    size="sm"
                    href={`https://zkillboard.com/character/${char.character.character_id}`}
                  >
                    zKill
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    href={`https://evewho.com/character/${char.character.character_id}`}
                  >
                    Eve Who
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    href={`https://evemaps.dotlan.net/corp/${char.character.corporation_name.replace(
                      " ",
                      "_"
                    )}`}
                  >
                    DotLan
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    href={`https://www.eve411.com/character/${char.character.character_id}`}
                  >
                    Eve411
                  </Button>
                </ButtonGroup>
              </Card.Text>
              <CollapseBlock
                className="m-2"
                id={`dropdown-status-${char.character.character_name}`}
                heading={`Update Status`}
              >
                <div>
                  <Table striped style={{ marginBottom: 0 }}>
                    <thead>
                      <tr key={`head-${char.character}`}>
                        <th>Update</th>
                        <th className="text-end">Last Run</th>
                      </tr>
                    </thead>
                  </Table>
                  <div style={{ width: "450px" }}>
                    <Table striped>
                      <tbody>
                        {data?.headers.map((h: any) => {
                          return (
                            <tr key={h}>
                              <td>{h}</td>
                              <td className="text-end">
                                {char.last_updates ? (
                                  char.last_updates[h] ? (
                                    <TimeAgo date={char.last_updates[h]} />
                                  ) : (
                                    "Never"
                                  )
                                ) : (
                                  "Never"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </CollapseBlock>
            </div>
          </PortraitCard>
        );
      })}
    </div>
  );
};

export default CharacterStatusPanels;
