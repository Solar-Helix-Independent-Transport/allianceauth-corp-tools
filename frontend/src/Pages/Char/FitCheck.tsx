import { DoctrineCheck } from "../../Components/Skills/DoctrineCheck";
import { getFitCheck } from "../../api/character";
import { ChangeEvent, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PanelLoader } from "../../Components/Loaders/loaders";

const CharacterFitCheck = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const [fit, setFit] = useState("");
  const { data, refetch, isFetching, isFetched } = useQuery(
    ["getFitCheck", fit, characterID],
    () => {
      let out = getFitCheck(fit, characterID ? Number(characterID) : 0);
      return out;
    },
    {
      refetchOnWindowFocus: false,
      enabled: false, // disable this query from automatically running
    },
  );

  function fitUpdate(event: ChangeEvent | any) {
    setFit(event.target?.value);
  }

  function fetchUpdate() {
    refetch();
  }
  return (
    <>
      <h5 className="text-center">Fitting to Check</h5>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="w-100 mb-3" style={{ maxWidth: "650px" }}>
          <Form.Control onChange={fitUpdate} as="textarea" rows={10} />
          <Button className="w-100" onClick={fetchUpdate}>
            Check
          </Button>
        </div>
      </div>
      <h5 className="text-center">{t("Status Key")}</h5>
      <div className="d-flex justify-content-center align-items-center flex-column flex-wrap">
        <table className="table">
          <tr className="row align-items-center">
            <td className="col align-items-center text-end">
              <DoctrineCheck
                name="Passed"
                skill_reqs={{
                  _meta: {
                    total_sp: 100,
                    trained_sp: 100,
                  },
                }}
                skill_list={{}}
              />
            </td>
            <td className="col align-items-center">
              <p className="m-0">{t("All Skills Trained")}</p>
            </td>
          </tr>
          <tr className="row align-items-center">
            <td className="col align-items-center text-end">
              <DoctrineCheck
                name={t("Alpha Restricted")}
                skill_reqs={{
                  _meta: {
                    total_sp: 100,
                    trained_sp: 100,
                  },
                  "Some Skill Trained But Limited": 5,
                }}
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
                skill_reqs={{
                  _meta: {
                    total_sp: 100,
                    trained_sp: 30,
                  },
                  "Some Skill": 5,
                }}
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
      </div>

      {!isFetching && isFetched ? (
        <>
          <div className="d-flex flex-wrap flex-sm-wrap flex-md-nowrap justify-content-center align-items-center">
            <div className="card text-nowrap m-1" style={{ minWidth: "350px" }}>
              <h5 className="card-header">Required Skills</h5>
              <div className="card-body w-auto">
                <table className="w-100">
                  <thead>
                    <th>Skill</th>
                    <th className="text-end">Level</th>
                  </thead>
                  <tbody>
                    {data.skills?.map((sk: any) => {
                      return (
                        <>
                          <tr>
                            <td>{sk.n}</td>
                            <td className="text-end">{sk.l}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card m-1">
              <h5 className="card-header">Character Checks</h5>
              <div className="d-flex justify-content-center align-items-center flex-wrap">
                {Object.entries(data?.chars).map((name: any) => {
                  let reqs = name[1].doctrines?.fit ? name[1].doctrines?.fit : [];
                  return (
                    <>
                      <DoctrineCheck name={name[0]} skill_reqs={reqs} skill_list={name[1].skills} />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <PanelLoader title={t("Checking EFT")} message={t("Please Wait")} />
        </>
      )}
    </>
  );
};

export default CharacterFitCheck;
