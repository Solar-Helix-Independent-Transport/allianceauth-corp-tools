import React, { useState, useEffect } from "react";
import { Label, Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";

const CharStatus = () => {
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
  useEffect(() => {
    axios.get(`/audit/api/characters/${character_id}/status`).then((res) => {
      const data = res.data;
      const headers = Array.from(
        new Set(
          data.characters.reduce((p, c) => {
            try {
              return p.concat(Object.keys(c.last_updates));
            } catch (err) {
              return p;
            }
          }, [])
        )
      );
      headers.sort();
      setState({ characters: data.characters, main: data.main, headers: headers });
    });
  }, []);

  return (
    <Panel>
      <Panel.Body>
        <Table responsive striped >
          <thead>
            <tr>
              <th>Character</th>
              {data.headers.map((h) => (
                <th class="text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.characters.map((char) => (
              <tr class={char.active ? "success" : "warning"}>
                <td>{char.character.character_name}</td>
                {data.headers.map((h) => {
                  try {
                    return (
                      <td class="text-center">
                        <ReactTimeAgo date={Date.parse(char.last_updates[h])} />
                      </td>
                    );
                  } catch (err) {
                    return <td></td>;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel.Body>
    </Panel>
  );
};

export default CharStatus;
