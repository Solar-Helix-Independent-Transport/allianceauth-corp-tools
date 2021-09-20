import React, { useState } from "react";
import { Glyphicon, Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadRoles } from "../apis/Character";
import { PanelLoader } from "../components/PanelLoader";
import { Badge } from "react-bootstrap";
import { Button } from "react-bootstrap";

const Checkbox = ({ active }) => {
  return (
    <Button className={active ? "btn-success" : "btn-default"}>
      <Glyphicon glyph={active ? "ok" : "remove"} />
    </Button>
  );
};

const CharRoles = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(["roles", character_id], () =>
    loadRoles(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <div></div>;

  return (
    <Panel.Body className="flex-container">
      <Table striped>
        <thead>
          <tr>
            <th>Character</th>
            <th>Affiliation</th>
            <th className="text-center">Director</th>
            <th className="text-center">Station Manager</th>
            <th className="text-center">Personnel Manager</th>
            <th className="text-center">Accountant</th>
            <th className="text-center">Titles</th>
          </tr>
        </thead>
        <tbody>
          {data.map((char) => {
            return (
              <tr>
                <td>{char.character.character_name}</td>
                <td>
                  {char.character.corporation_name}
                  <br />
                  {char.character.alliance_name}
                </td>
                <td className="text-center">
                  <Checkbox active={char.director} />
                </td>
                <td className="text-center">
                  <Checkbox active={char.station_manager} />
                </td>
                <td className="text-center">
                  <Checkbox active={char.personnel_manager} />
                </td>
                <td className="text-center">
                  <Checkbox active={char.accountant} />
                </td>
                <td className="text-center">
                  {char.titles.map((t) => {
                    return <Badge>{t.name}</Badge>;
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Panel.Body>
  );
};

export default CharRoles;
