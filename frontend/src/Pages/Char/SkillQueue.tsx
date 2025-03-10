import { PortraitCard } from "../../Components/Cards/PortraitCard";
import { ErrorLoader, PanelLoader } from "../../Components/Loaders/loaders";
import { SkillLevelBlock } from "../../Components/Skills/SkillLevelBlock";
import { getCharacterSkillQueues } from "../../api/character";
import { useState } from "react";
import { Form, FormGroup, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

const CharacterSkillQueues = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const { isLoading, isFetching, error, data } = useQuery(
    ["skills", "queue", characterID],
    () => getCharacterSkillQueues(characterID ? Number(characterID) : 0),
    { refetchOnWindowFocus: false },
  );

  const [activeFilter, setActive] = useState(true);
  const [pausedFilter, setPaused] = useState(true);
  const [emptyFilter, setEmpty] = useState(false);

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  const handleActive = (e: any) => {
    setActive(e.currentTarget.checked);
  };

  const handlePaused = (e: any) => {
    setPaused(e.currentTarget.checked);
  };

  const handleEmpty = (e: any) => {
    setEmpty(e.currentTarget.checked);
  };

  let filtered_data = data.filter((char: any) => {
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

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <>
      <h5 className="text-center">{t("Filters")}</h5>
      <FormGroup className="col-xs-12 text-center">
        <Form.Check
          defaultChecked={activeFilter}
          onChange={handleActive}
          label={t("Active")}
          inline
        ></Form.Check>
        <Form.Check
          defaultChecked={pausedFilter}
          onChange={handlePaused}
          label={t("Paused")}
          inline
        ></Form.Check>
        <Form.Check
          defaultChecked={emptyFilter}
          onChange={handleEmpty}
          label={t("Empty")}
          inline
        ></Form.Check>
      </FormGroup>

      <div className="d-flex justify-content-around align-items-center flex-row flex-wrap">
        {filtered_data?.map((char: any) => {
          let char_status = char.queue.length ? { border: "success" } : { border: "warning" };
          if (char.queue.length > 0 && !char.queue[0].end) {
            char_status = { border: "info" };
          }

          return (
            <PortraitCard
              {...char_status}
              isFetching={isFetching}
              character={char.character}
              heading={char.character.character_name}
              roundedImages={"10"}
              portaitSize={450}
            >
              <h6>
                {char.character.corporation_name}
                {char.character.alliance_name && ` (${char.character.alliance_name})`}
              </h6>
              <div style={{ width: "450px" }}>
                <div>
                  <Table striped style={{ marginBottom: 0 }}>
                    <thead>
                      <tr key={`head-${char.character.character_name}`}>
                        <th>{t("Skill")}</th>
                        <th className="text-end">{t("Level")}</th>
                      </tr>
                    </thead>
                  </Table>
                  <div
                    style={{ width: "450px", height: "350px", overflowY: "auto" }}
                    className="card-img-bottom"
                  >
                    <Table striped>
                      <tbody>
                        {char.queue?.map((s: any) => {
                          return (
                            <tr key={`${char.character.character_name}${s.skill}${s.end_level}`}>
                              <td className="no-margin">
                                <div className="d-flex justify-content-between">
                                  <p className="m-0">{s.skill}</p>
                                  <SkillLevelBlock
                                    level={s.end_level}
                                    trained={s.current_level}
                                    active={s.current_level}
                                  />
                                </div>
                                <div className="d-flex justify-content-between">
                                  {s.end ? (
                                    <>
                                      <ReactTimeAgo date={Date.parse(s.end)} />
                                      <p className="m-0 small">
                                        {(s.end_sp - s.start_sp).toLocaleString()}/
                                        {s.end_sp.toLocaleString()} SP
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <i className="fa-solid fa-pause"></i>
                                      <p className="m-0">
                                        {(s.end_sp - s.start_sp).toLocaleString()}/
                                        {s.end_sp.toLocaleString()} SP
                                      </p>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </PortraitCard>
          );
        })}
      </div>
    </>
  );
};

export default CharacterSkillQueues;
