import { CharacterAllegiancePortrait } from "../../Components/EveImages/EveImages";
import { DoctrineCheck } from "../../Components/Skills/DoctrineCheck";
import { components } from "../../api/CtApi";
import { getAccountDoctrines } from "../../api/character";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterDoctrine = () => {
  const { characterID } = useParams();

  const { data } = useQuery({
    queryKey: ["doctrines", characterID],
    queryFn: () => getAccountDoctrines(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  console.log(data);
  return (
    <>
      <h5 className="text-center">Status Key</h5>
      <div className="d-flex justify-content-center">
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
        </table>
      </div>
      {data?.map((char: components["schemas"]["CharacterDoctrines"]) => {
        return (
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
                {Object.entries(char.doctrines).length > 0 ? (
                  <>
                    {Object.entries(char.doctrines).map(([k, v]) => {
                      return <DoctrineCheck name={k} skill_reqs={v} skill_list={char.skills} />;
                    })}
                  </>
                ) : (
                  <p>No Tokens</p>
                )}
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default CharacterDoctrine;
