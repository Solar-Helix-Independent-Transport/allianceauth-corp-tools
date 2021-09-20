import React, { useState, useEffect } from "react";
import { Label, Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import CharacterPortrait from "../components/CharacterPortrait";
import { useQuery } from "react-query";
import { loadPubData } from "../apis/Character";
import { Bars } from "@agney/react-loading";
import { PanelLoader } from "../components/PanelLoader";

const PubData = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(["pubdata", character_id], () =>
    loadPubData(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <div></div>;

  return (
    <Panel.Body className={"flex-container"}>
      {data.characters.map((char) => {
        return (
          <Panel className="flex-child">
            <Panel.Heading>
              <h4 className={"text-center"}>{char.character.character_name}</h4>
            </Panel.Heading>
            <Panel.Body className="flex-body">
              <CharacterPortrait character={char.character} />
              <h4 className={"text-center"}>Corporation history</h4>
              <Table striped style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>Corporation</th>
                    <th className="text-right">Start Date</th>
                  </tr>
                </thead>
              </Table>
              <div className={"table-div"}>
                <Table striped>
                  <tbody>
                    {char.history != null ? (
                      char.history.map((h) => {
                        return (
                          <tr>
                            <td>{h.corporation.corporation_name}</td>
                            <td class="text-right no-wrap">
                              {h.start.slice(0, 10)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2}>No Data</td>
                      </tr>
                    )}
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

export default PubData;
