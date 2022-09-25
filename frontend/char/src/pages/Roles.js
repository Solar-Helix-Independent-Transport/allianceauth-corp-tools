import { loadRoles } from "../apis/Character";
import ErrorBoundary from "../components/ErrorBoundary";
import { ErrorLoader } from "../components/ErrorLoader";
import { PanelLoader } from "../components/PanelLoader";
import React from "react";
import { Glyphicon, Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const Checkbox = ({ active }) => {
  return (
    <Button className={active ? "btn-success" : "btn-default"}>
      <Glyphicon glyph={active ? "ok" : "remove"} />
    </Button>
  );
};

const CharRoles = () => {
  let { characterID } = useParams();
  const { isLoading, error, data } = useQuery(
    ["roles", characterID],
    () => loadRoles(characterID),
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default CharRoles;
