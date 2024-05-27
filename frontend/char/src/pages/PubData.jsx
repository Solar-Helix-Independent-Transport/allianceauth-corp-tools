import { loadPubData } from "../apis/Character";
import ErrorBoundary from "../components/ErrorBoundary";
import { ErrorLoader } from "../components/ErrorLoader";
import { PanelLoader } from "../components/PanelLoader";
import { PortraitPanel } from "../components/PortraitPanel";
import React from "react";
import { Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const PubData = () => {
  let { characterID } = useParams();
  const { isLoading, isFetching, error, data } = useQuery(
    ["pubdata", characterID],
    () => loadPubData(characterID),
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body className={"flex-container"}>
        {data.characters.map((char) => {
          return (
            <PortraitPanel isFetching={isFetching} character={char.character}>
              <h4 className={"text-center"}>Corporation history</h4>
              <Table striped style={{ marginBottom: 0 }}>
                <thead>
                  <tr key="head">
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
                          <tr
                            key={
                              char.character.character_name +
                              " " +
                              h.corporation.corporation_name +
                              " " +
                              h.start
                            }
                          >
                            <td>{h.corporation.corporation_name}</td>
                            <td className="text-right no-wrap">{h.start.slice(0, 10)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr key="nodata">
                        <td className={"text-center"} colSpan={2}>
                          No Data
                        </td>
                      </tr>
                    )}
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

export default PubData;
