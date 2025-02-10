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

const CharacterDoctrine = () => {
  const { characterID } = useParams();
  const [filter, setDoctrineFilter] = useState("");
  const [hideFailures, setHideFailures] = useState(true);

  const { data } = useQuery({
    queryKey: ["doctrines", characterID],
    queryFn: () => getAccountDoctrines(Number(characterID)),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <h5 className="text-center">Status Key</h5>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <table className="table">
          <tr className="row align-items-center">
            <td className="col align-items-center text-end">
              <DoctrineCheck name="Passed" skill_reqs={[]} skill_list={{}} />
            </td>
            <td className="col align-items-center">
              <p className="m-0">All Skills Trained</p>
            </td>
          </tr>
          <tr className="row align-items-center">
            <td className="col align-items-center text-end">
              <DoctrineCheck
                name="Alpha Restricted"
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
                Some Skills Restricted by Alpha State
                <br />
                Click to Show More
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
                Some Missing Skills
                <br />
                Click to Show More
                <br />
                Click Copy for easy import in game
              </p>
            </td>
          </tr>
          <tr>
            <td colSpan={2}></td>
          </tr>
        </table>
        <TextFilter setFilterText={setDoctrineFilter} labelText="Search:" />
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Hide Failures"
          onChange={(event: any) => {
            setHideFailures(event.target.checked);
          }}
          defaultChecked={true}
        />
      </div>
      {data?.map((char: components["schemas"]["CharacterDoctrines"]) => {
        const doctrineCount = Object.entries(char.doctrines).length;
        const filtered_doctrines =
          doctrineCount > 0
            ? Object.entries(char.doctrines).reduce((output, [_, v]) => {
                return output || Object.entries(v).length === 0;
              }, false)
            : false;
        return (
          filtered_doctrines && (
            <Card className="my-2">
              <Card.Header>
                <h6 className="m-0">
                  {char.character.character_name}{" "}
                  <span className="float-end">
                    {char.character.corporation_name}
                    {char.character.alliance_name && ` (${char.character.alliance_name})`}
                  </span>
                </h6>
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
                    <p>No Tokens</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          )
        );
      })}
    </>
  );
};

export default CharacterDoctrine;
