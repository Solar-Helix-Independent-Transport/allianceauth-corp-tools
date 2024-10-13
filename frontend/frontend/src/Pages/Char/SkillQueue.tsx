import { PortraitCard } from "../../Components/Cards/PortraitCard";
import { ErrorLoader, PanelLoader } from "../../Components/Loaders/loaders";
import { SkillLevelBlock } from "../../Components/Skills/SkillLevelBlock";
import { getCharacterSkillQueues } from "../../api/character";
import { Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterSkillQueues = () => {
  const { characterID } = useParams();
  const { isLoading, isFetching, error, data } = useQuery(
    ["skills", characterID],
    () => getCharacterSkillQueues(characterID ? Number(characterID) : 0),
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <div className="d-flex justify-content-around align-items-center flex-row flex-wrap">
      {data?.map((char: any) => {
        return (
          <PortraitCard
            border={"secondary"}
            isFetching={isFetching}
            character={char.character}
            heading={char.character.character_name}
            roundedImages={"10"}
          >
            <div style={{ width: "350px" }}>
              <div>
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr key={`head-${char.character.character_name}`}>
                      <th>Skill</th>
                      <th className="text-end">Level</th>
                    </tr>
                  </thead>
                </Table>
                <div style={{ width: "350px", height: "250px", overflowY: "auto" }}>
                  <Table striped>
                    <tbody>
                      {char.queue?.map((s: any) => {
                        return (
                          <tr key={s.skill}>
                            <td className="no-margin">{s.skill}</td>
                            <td className="text-end text-nowrap">
                              <SkillLevelBlock level={s.end_level} active={s.current_level} />
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
  );
};

export default CharacterSkillQueues;
