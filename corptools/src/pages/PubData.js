import React, { useState, useEffect } from "react";
import { Label, Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import axios from "axios";
import CharacterPortrait from "../components/CharacterPortrait";
import { useQuery } from "react-query";
const PubData = () => {
  const [data, setState] = useState({
    characters: [],
    main: {
      character_id: 1,
      character_name: "",
      corporation_id: 0,
      corporation_name: "",
      alliance_id: 0,
      alliance_name: "",
    },
    headers: [],
  });
  const character_id = window.location.pathname.split("/")[3];
  async function loadHeader() {
    const api = await axios.get(
      `/audit/api/characters/${character_id}/pubdata`
    );
    console.log("set state in pubdata");
    setState({
      characters: api.data,
    });
  }

  const { isLoading, error } = useQuery(["pubdata", character_id], loadHeader);

  return (
    <Panel>
      <Panel.Body className={"flex-container"}>
        {data.characters.map((char) => {
          return (
            <Panel className="flex-child">
              <Panel.Heading>
                <h3 className={"text-center"}>
                  {char.character.character_name}
                </h3>
              </Panel.Heading>
              <Panel.Body className="flex-body">
                <CharacterPortrait character={char.character} />
                <h3 className={"text-center"}>Corporation history</h3>
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
    </Panel>
  );
};

export default PubData;
