import React from "react";
import { Table } from "react-bootstrap";
import { Panel, Glyphicon } from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import CharacterPortrait from "../components/CharacterPortrait";
import { useQuery } from "react-query";
import { loadStatus } from "../apis/Character";
import { PanelLoader } from "../components/PanelLoader";

const CharStatus = ({ character_id }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["status", character_id],
    () => loadStatus(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <div></div>;

  return (
    <Panel.Body className="flex-container">
      {data.characters.map((char) => {
        let char_status = char.active
          ? { bsStyle: "success" }
          : { bsStyle: "warning" };
        return (
          <Panel
            key={"panel " + char.character.character_name}
            {...char_status}
            className={"flex-child"}
          >
            <Panel.Heading>
              <h4 className={"text-center"}>
                {char.character.character_name}
                {isFetching ? (
                  <Glyphicon
                    className="glyphicon-refresh-animate pull-right"
                    glyph="refresh"
                  />
                ) : (
                  <></>
                )}
              </h4>
            </Panel.Heading>
            <Panel.Body className="flex-body">
              <CharacterPortrait character={char.character} />
              <h4 className={"text-center"}>Update Status</h4>
              <Table striped style={{ marginBottom: 0 }}>
                <thead>
                  <tr key="head">
                    <th>Update</th>
                    <th className="text-right">Last Run</th>
                  </tr>
                </thead>
              </Table>
              <div className={"table-div"}>
                <Table striped>
                  <tbody>
                    {data.headers.map((h) => {
                      try {
                        return (
                          <tr key={h}>
                            <td>{h}</td>
                            <td className="text-right">
                              <ReactTimeAgo
                                date={Date.parse(char.last_updates[h])}
                              />
                            </td>
                          </tr>
                        );
                      } catch (e) {
                        return (
                          <tr key={h}>
                            <td>{h}</td>
                            <td className="text-right">Never</td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </Table>
              </div>
            </Panel.Body>
          </Panel>
        );
      })}
    </Panel.Body>
  );
};

export default CharStatus;