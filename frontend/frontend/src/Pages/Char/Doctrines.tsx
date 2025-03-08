import { PanelLoader } from "../../Components/Loaders/loaders";
import { CharacterAllegiancePortrait } from "../../Components/EveImages/EveImages";
import { TextFilter } from "../../Components/Helpers/TextFilter";
import { DoctrineCheck } from "../../Components/Skills/DoctrineCheck";
import { components } from "../../api/CtApi";
import { getAccountDoctrines } from "../../api/character";
import { useState } from "react";
import { Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CharacterDoctrine = () => {
  const { t } = useTranslation();

  const { characterID } = useParams();
  const [filter, setDoctrineFilter] = useState("");
  const [hideFailures, setHideFailures] = useState(false);

  const { data } = useQuery({
    queryKey: ["doctrines", characterID],
    queryFn: () => getAccountDoctrines(Number(characterID)),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <h5 className="text-center">{t("Status Key")}</h5>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <table className="table">
          <tr className="row align-items-center">
            <td className="col align-items-center text-end">
              <DoctrineCheck name="Passed" skill_reqs={[]} skill_list={{}} />
            </td>
            <td className="col align-items-center">
              <p className="m-0">{t("All Skills Trained")}</p>
            </td>
          </tr>
          <tr className="row align-items-center">
            <td className="col align-items-center text-end">
              <DoctrineCheck
                name={t("Alpha Restricted")}
                skill_reqs={{ "Some Skill Trained But Limited": 5 }}
                skill_list={{
                  "Some Skill Trained But Limited": {
                    active_level: 4,
                    trained_level: 5,
                  },
                }}
              />
            </td>
            <td className="col align-items-center">
              <p className="m-0 text-nowrap">
                {t("Some Skills Restricted by Alpha State")}
                <br />
                {t("Click to Show More")}
              </p>
            </td>
          </tr>
          <tr className="row align-items-center">
            <td className="col align-items-center text-end">
              <DoctrineCheck
                name="Failed"
                skill_reqs={{ "Some Skill": 5 }}
                skill_list={{ "Some Skill": { active_level: 1, trained_level: 1 } }}
              />
            </td>
            <td className="col align-items-center">
              <p className="m-0 text-nowrap">
                {t("Some Missing Skills")}
                <br />
                {t("Click to Show More")}
                <br />
                {t("Click Copy for easy import in game")}
              </p>
            </td>
          </tr>
          <tr>
            <td colSpan={2}></td>
          </tr>
        </table>
        <TextFilter setFilterText={setDoctrineFilter} labelText={t("Search:")} />
        <Form.Check
          type="switch"
          id="custom-switch"
          label={t("Hide Failures")}
          onChange={(event: any) => {
            setHideFailures(event.target.checked);
          }}
          defaultChecked={hideFailures}
        />
      </div>
      {data ? (
        data.map((char: components["schemas"]["CharacterDoctrines"]) => {
          const doctrineCount = Object.entries(char.doctrines).length;
          const filtered_doctrines = Object.entries(char.doctrines)?.reduce((output, [k, v]) => {
            return (
              output ||
              ((!hideFailures || Object.entries(v).length === 0) &&
                (filter.length == 0 || k.toLowerCase().includes(filter.toLocaleLowerCase())))
            );
          }, false);
          return (
            filtered_doctrines && (
              <Card className="my-2">
                <Card.Header>
                  <Card.Title>
                    <div className="m-0">
                      {char.character.character_name}{" "}
                      <span className="float-end">
                        {char.character.corporation_name}
                        {char.character.alliance_name && ` (${char.character.alliance_name})`}
                      </span>
                    </div>
                  </Card.Title>
                </Card.Header>
                <Card.Body className="d-flex align-items-center">
                  <div className="flex-one m-2">
                    <CharacterAllegiancePortrait size={128} character={char.character} />
                  </div>
                  <div className="d-flex flex-grow-1 justify-content-center flex-wrap">
                    {doctrineCount > 0 ? (
                      <>
                        {Object.entries(char.doctrines).map(([k, v]) => {
                          return (
                            (!hideFailures || Object.entries(v).length === 0) &&
                            (filter.length == 0 ||
                              k.toLowerCase().includes(filter.toLocaleLowerCase())) && (
                              <DoctrineCheck name={k} skill_reqs={v} skill_list={char.skills} />
                            )
                          );
                        })}
                      </>
                    ) : (
                      <p>{t("No Tokens")}</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )
          );
        })
      ) : (
        <PanelLoader title={t("Data Loading")} message={t("Please Wait")} />
      )}
    </>
  );
};

export default CharacterDoctrine;
