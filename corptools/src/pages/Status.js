import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import CharacterPortrait from "../components/CharacterPortrait";
import { useQuery } from "react-query";
import loadStatus from "../apis/Character";

const CharStatus = () => {
  const character_id = window.location.pathname.split("/")[3];

  const { isLoading, error, data } = useQuery(["status", character_id], () =>
    loadStatus(character_id)
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <p>API ERROR!!!</p>;

  return (
    <Panel>
      <Panel.Body className={"flex-container"}>
        {data.characters.map((char) => {
          let char_status = char.active
            ? { bsStyle: "success" }
            : { bsStyle: "warning" };
          return (
            <Panel {...char_status} className={"flex-child"}>
              <Panel.Heading>
                <h3 className={"text-center"}>
                  {char.character.character_name}
                </h3>
              </Panel.Heading>
              <Panel.Body className="flex-body">
                <CharacterPortrait character={char.character} />
                <h3 className={"text-center"}>Update Status</h3>
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr>
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
                            <tr>
                              <td>{h}</td>
                              <td class="text-right">
                                <ReactTimeAgo
                                  date={Date.parse(char.last_updates[h])}
                                />
                              </td>
                            </tr>
                          );
                        } catch (e) {
                          return (
                            <tr>
                              <td colSpan={2}>No Data</td>
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
    </Panel>
  );
};

export default CharStatus;
