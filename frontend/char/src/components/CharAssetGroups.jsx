import { loadAssetGroups } from "../apis/Character";
import { ErrorLoader } from "../components/ErrorLoader";
import ErrorBoundary from "./ErrorBoundary";
import { PanelLoader } from "./PanelLoader";
import React from "react";
import { Glyphicon, Panel } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { useQuery } from "react-query";

const CharAssetGroups = ({ character_id, location_id = 0 }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["assetGroups", character_id, location_id],
    () => loadAssetGroups(character_id, location_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <div className="flex-container">
        {data.map((group) => {
          return (
            <Panel key={group.name} className="flex-child">
              <Panel.Heading>
                <h4 className={"text-center"}>
                  {group.name}
                  {isFetching ? (
                    <Glyphicon className="glyphicon-refresh-animate pull-right" glyph="refresh" />
                  ) : (
                    <></>
                  )}
                </h4>
              </Panel.Heading>
              <Panel.Body className="flex-body">
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr key={"head " + group.name}>
                      <th>Group</th>
                      <th className="text-right">Count</th>
                    </tr>
                  </thead>
                </Table>
                <div className={"table-div"}>
                  <Table striped>
                    <tbody>
                      {group.items.map((h) => {
                        return (
                          <tr key={group.name + " " + h.label + " " + h.value}>
                            <td>{h.label}</td>
                            <td className="text-right no-wrap">{h.value.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Panel.Body>
            </Panel>
          );
        })}
      </div>
    </ErrorBoundary>
  );
};

export default CharAssetGroups;
