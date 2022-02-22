import React from "react";
import { Table } from "react-bootstrap";
import { Panel, Glyphicon } from "react-bootstrap";
import CharacterPortrait from "../components/CharacterPortrait";
import { useQuery } from "react-query";
import { loadPubData } from "../apis/Character";
import { PanelLoader } from "../components/PanelLoader";
import { ErrorLoader } from "../components/ErrorLoader";
import ErrorBoundary from "../components/ErrorBoundary";

const PubData = ({ character_id }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["pubdata", character_id],
    () => loadPubData(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body className={"flex-container"}>
        {data.characters.map((char) => {
          return (
            <Panel
              key={"panel " + char.character.character_name}
              className="flex-child"
            >
              <Panel.Heading>
                <h4 className={"text-center"}>
                  {char.character.character_name}
                  {isFetching ? (
                    <Glyphicon
                      className="glyphicon-refresh-animate pull-right"
                      glyph="refresh"
                    />
                  ) : (
                    <></>
                  )}
                </h4>
              </Panel.Heading>
              <Panel.Body className="flex-body">
                <CharacterPortrait character={char.character} />
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
                              <td className="text-right no-wrap">
                                {h.start.slice(0, 10)}
                              </td>
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
              </Panel.Body>
            </Panel>
          );
        })}
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default PubData;
