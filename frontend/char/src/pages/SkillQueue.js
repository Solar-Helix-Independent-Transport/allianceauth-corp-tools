import React from "react";
import { Table } from "react-bootstrap";
import { Panel, Glyphicon } from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import { useQuery } from "react-query";
import { loadSkillQueues } from "../apis/Character";
import { PanelLoader } from "../components/PanelLoader";
import { ErrorLoader } from "../components/ErrorLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import { SkillLevelBlock } from "../components/skills/SkillLevelBlock";
import { PortraitPanel } from "../components/PortraitPanel";

const CharSkillQueue = ({ character_id }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["skillqueue", character_id],
    () => loadSkillQueues(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container">
        {data.map((char) => {
          let char_status = char.queue.length
            ? { bsStyle: "success" }
            : { bsStyle: "warning" };
          if (char.queue.length > 0 && !char.queue[0].end) {
            char_status = { bsStyle: "info" };
          }
          return (
            <PortraitPanel
              isFetching={isFetching}
              character={char.character}
              panelStyles={char_status}
              headerIcon={
                char.queue.length > 0 && !char.queue[0].end ? "pause" : false
              }
            >
              <h4 className={"text-center"}>Skill Queue</h4>
              <div className={"table-div skill-queue"}>
                <Table striped>
                  <tbody>
                    {char.queue.length === 0 ? (
                      <h5 className={"text-center"}>Empty Queue</h5>
                    ) : (
                      char.queue.map((s) => {
                        return (
                          <tr key={s.skill}>
                            <td>
                              <div className="flex-container flex-space-between">
                                <p className="no-margin">{s.skill}</p>
                                <SkillLevelBlock
                                  level={s.end_level}
                                  active={s.current_level}
                                />
                              </div>
                              <div className="flex-container flex-space-between">
                                {s.end ? (
                                  <>
                                    <ReactTimeAgo date={Date.parse(s.end)} />
                                    <p className="no-margin">
                                      {(s.end_sp - s.start_sp).toLocaleString()}{" "}
                                      SP
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Glyphicon glyph="pause" />
                                    <p className="no-margin">
                                      {(s.end_sp - s.start_sp).toLocaleString()}{" "}
                                      SP
                                    </p>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
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

export default CharSkillQueue;
