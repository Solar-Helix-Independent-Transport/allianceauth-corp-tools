import React from "react";
import { Tooltip, OverlayTrigger, Table, Glyphicon } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import CharacterPortrait from "../components/CharacterPortrait";
import { useQuery } from "react-query";
import { loadClones } from "../apis/Character";
import { TypeIcon } from "../components/EveImages";
import { PanelLoader } from "../components/PanelLoader";
import ReactTimeAgo from "react-time-ago";
import { ErrorLoader } from "../components/ErrorLoader";

function MyTooltip({ message }) {
  return <Tooltip id="implant_tooltip">{message}</Tooltip>;
}

const CharClones = ({ character_id }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["clones", character_id],
    () => loadClones(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <>
      <Panel.Body className={"flex-container"}>
        {data.map((char) => {
          return (
            <Panel
              key={"panel " + char.character.character_name}
              className="flex-child flex-wide-child"
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
                <div className="flex-container flex-wide">
                  <CharacterPortrait character={char.character} />
                  <div style={{ margin: "auto" }}>
                    <h4 className="text-center">Home Station</h4>
                    <p className="text-center">{`${
                      char.home ? char.home.name : "No Data"
                    }`}</p>
                    <h4 className="text-center">Last Clone Jump</h4>
                    <p className="text-center">{`${
                      char.last_clone_jump
                        ? new Date(char.last_clone_jump).toUTCString()
                        : "No Data"
                    }`}</p>
                    <p className="text-center">
                      {char.last_clone_jump ? (
                        <ReactTimeAgo date={char.last_clone_jump} />
                      ) : (
                        ""
                      )}
                    </p>
                    <h4 className="text-center">Last Station Change</h4>
                    <p className="text-center">{`${
                      char.last_station_change
                        ? new Date(char.last_station_change).toUTCString()
                        : "No Data"
                    }`}</p>
                    <p className="text-center">
                      {char.last_clone_jump ? (
                        <ReactTimeAgo date={char.last_station_change} />
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr key="head">
                      <th>Location</th>
                      <th className="text-right">Implants</th>
                    </tr>
                  </thead>
                </Table>
                <div className={"table-div table-div-fill"}>
                  <Table striped>
                    <tbody>
                      {char.clones != null ? (
                        char.clones.map((c) => {
                          console.log(c);
                          return (
                            <tr>
                              <td className="text-left">
                                <p>{c.name != null && <>{`${c.name}`}</>}</p>
                                <p>
                                  {c.location != null && (
                                    <>{`${c.location.name}`}</>
                                  )}
                                </p>
                              </td>
                              <td className="text-right no-wrap">
                                {c.implants.map((i) => {
                                  return (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={MyTooltip({
                                        message: i.name,
                                      })}
                                    >
                                      <span>
                                        <TypeIcon type_id={i.id} />
                                      </span>
                                    </OverlayTrigger>
                                  );
                                })}
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
    </>
  );
};

export default CharClones;
