import { loadCharacterStatus } from "../../api/character";
import { CollapseBlock } from "../../components/Helpers";
import { PortraitCard } from "../../components/cards";
import React from "react";
import { Badge, Card, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterStatus = () => {
  let { characterID } = useParams();

  const { data } = useQuery(["status", characterID], () => loadCharacterStatus(characterID), {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="d-flex justify-content-center align-items-center flex-row flex-wrap">
      {data?.characters.map((char: any) => {
        let char_status = char.active ? "success" : "warning";
        return (
          <PortraitCard
            border={char_status}
            //isFetching={isFetching}
            character={char.character}
            heading={char.character.character_name}
            roundedImages={"10"}
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
              <CollapseBlock heading={`Update Status`}>
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
                                {char.last_updates
                                  ? char.last_updates[h]
                                    ? `${Date.parse(char.last_updates[h])}`
                                    : "Never"
                                  : "Never"}
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

export default CharacterStatus;
