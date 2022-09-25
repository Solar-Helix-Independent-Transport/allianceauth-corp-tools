import { loadSkillQueues } from "../apis/Character";
import ErrorBoundary from "../components/ErrorBoundary";
import { ErrorLoader } from "../components/ErrorLoader";
import { PanelLoader } from "../components/PanelLoader";
import { PortraitPanel } from "../components/PortraitPanel";
import { SkillLevelBlock } from "../components/skills/SkillLevelBlock";
import React, { useState } from "react";
import { Checkbox, FormGroup, Table } from "react-bootstrap";
import { Glyphicon, Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

const CharSkillQueue = () => {
  let { characterID } = useParams();

  const { isLoading, isFetching, error, data } = useQuery(
    ["skillqueue", characterID],
    () => loadSkillQueues(characterID),
    { refetchOnWindowFocus: false }
  );
  const [activeFilter, setActive] = useState(true);
  const [pausedFilter, setPaused] = useState(true);
  const [emptyFilter, setEmpty] = useState(true);

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  const handleActive = (e) => {
    setActive(e.currentTarget.checked);
  };

  const handlePaused = (e) => {
    setPaused(e.currentTarget.checked);
  };

  const handleEmpty = (e) => {
    setEmpty(e.currentTarget.checked);
  };

  let filtered_data = data.filter((char) => {
    let active = false;
    let paused = false;
    let empty = false;
    if (char.queue) {
      if (char.queue.length && char.queue[0].end) {
        active = true;
      } else if (char.queue.length) {
        paused = true;
      } else {
        empty = true;
      }
    } else {
      empty = true;
    }
    return (activeFilter && active) || (emptyFilter && empty) || (pausedFilter && paused);
  });

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container">
        <h4 className="text-center">Queue Filter</h4>
        <FormGroup className="col-xs-12 text-center">
          <Checkbox defaultChecked={activeFilter} onChange={handleActive} inline>
            Active
          </Checkbox>
          <Checkbox defaultChecked={pausedFilter} onChange={handlePaused} inline>
            Paused
          </Checkbox>
          <Checkbox defaultChecked={emptyFilter} onChange={handleEmpty} inline>
            Empty
          </Checkbox>
        </FormGroup>
        <hr className="col-xs-12 text-center" />
        {filtered_data.length ? (
          filtered_data.map((char) => {
            let char_status = char.queue.length ? { bsStyle: "success" } : { bsStyle: "warning" };
            if (char.queue.length > 0 && !char.queue[0].end) {
              char_status = { bsStyle: "info" };
            }
            return (
              <PortraitPanel
                isFetching={isFetching}
                character={char.character}
                panelStyles={char_status}
                headerIcon={char.queue.length > 0 && !char.queue[0].end ? "pause" : false}
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
                                  <SkillLevelBlock level={s.end_level} active={s.current_level} />
                                </div>
                                <div className="flex-container flex-space-between">
                                  {s.end ? (
                                    <>
                                      <ReactTimeAgo date={Date.parse(s.end)} />
                                      <p className="no-margin">
                                        {(s.end_sp - s.start_sp).toLocaleString()} SP
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <Glyphicon glyph="pause" />
                                      <p className="no-margin">
                                        {(s.end_sp - s.start_sp).toLocaleString()} SP
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
          })
        ) : (
          <h4>No Characters Matching Filter</h4>
        )}
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharSkillQueue;
