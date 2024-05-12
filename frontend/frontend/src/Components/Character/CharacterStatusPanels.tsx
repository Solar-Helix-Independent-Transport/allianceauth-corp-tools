import { PortraitCard } from "../Cards/PortraitCard";
import { CollapseBlock } from "../Helpers/CollapseBlock";
import { Badge, Card, Table } from "react-bootstrap";
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
          >
            <div style={{ width: "400px" }}>
              <Card.Title className={"text-center"}>{char.character.corporation_name}</Card.Title>
              <Card.Title className={"text-center"}>
                {char.character.alliance_name ? char.character.alliance_name : <br />}
              </Card.Title>

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
              <hr />
              <CollapseBlock
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
                  <div style={{ width: "400px" }}>
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
