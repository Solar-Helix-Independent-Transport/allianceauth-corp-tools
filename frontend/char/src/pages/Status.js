import React from "react";
import { Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import { useQuery } from "react-query";
import { loadStatus } from "../apis/Character";
import { PanelLoader } from "../components/PanelLoader";
import { ErrorLoader } from "../components/ErrorLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import { PortraitPanel } from "../components/PortraitPanel";

const CharStatus = ({ character_id }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["status", character_id],
    () => loadStatus(character_id),
    { refetchOnWindowFocus: false },
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container">
        {data.characters.map((char) => {
          let char_status = char.active
            ? { bsStyle: "success" }
            : { bsStyle: "warning" };
          return (
            <PortraitPanel
              panelStyles={char_status}
              isFetching={isFetching}
              character={char.character}
            >
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
                      return (
                        <tr key={h}>
                          <td>{h}</td>
                          <td className="text-right">
                            {char.last_updates ? (
                              char.last_updates[h] ? (
                                <ReactTimeAgo
                                  date={Date.parse(char.last_updates[h])}
                                />
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
            </PortraitPanel>
          );
        })}
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharStatus;
