import { loadStatus } from "../apis/Character";
import ErrorBoundary from "../components/ErrorBoundary";
import { ErrorLoader } from "../components/ErrorLoader";
import { PanelCollapseBlock } from "../components/PanelCollapseBlock";
import { PanelLoader } from "../components/PanelLoader";
import { PortraitPanel } from "../components/PortraitPanel";
import React from "react";
import { Table } from "react-bootstrap";
import { Label, Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

const CharStatus = () => {
  let { characterID } = useParams();

  const { isLoading, isFetching, error, data } = useQuery(
    ["status", characterID],
    () => loadStatus(characterID),
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container">
        {data.characters.map((char) => {
          let char_status = char.active ? { bsStyle: "success" } : { bsStyle: "warning" };
          return (
            <PortraitPanel
              panelStyles={char_status}
              isFetching={isFetching}
              character={char.character}
            >
              <h4 style={{ width: "400px" }} className={"text-center"}>
                Character Status
              </h4>

              <p className={"text-center"}>
                Skill Points:{" "}
                <Label className={"text-center"}>{char.sp && char.sp.toLocaleString()}</Label>
              </p>
              <p className={"text-center"}>
                Isk:{" "}
                <Label className={"text-center"}>${char.isk && char.isk.toLocaleString()}</Label>
              </p>
              <h5 className={"text-center"}>Location</h5>
              <Label className={"text-center"}>
                {char.location ? char.location : "Unknown Location"}
              </Label>
              <Label className={"text-center"}>{char.ship ? char.ship : "Unknown Ship"}</Label>

              <PanelCollapseBlock heading={`Update Status`}>
                <div>
                  <Table striped style={{ marginBottom: 0 }}>
                    <thead>
                      <tr key={`head-${char.character}`}>
                        <th>Update</th>
                        <th className="text-right">Last Run</th>
                      </tr>
                    </thead>
                  </Table>
                  <div style={{ width: "400px" }}>
                    <Table striped>
                      <tbody>
                        {data.headers.map((h) => {
                          return (
                            <tr key={h}>
                              <td>{h}</td>
                              <td className="text-right">
                                {char.last_updates ? (
                                  char.last_updates[h] ? (
                                    <ReactTimeAgo date={Date.parse(char.last_updates[h])} />
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
                </div>
              </PanelCollapseBlock>
            </PortraitPanel>
          );
        })}
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharStatus;
