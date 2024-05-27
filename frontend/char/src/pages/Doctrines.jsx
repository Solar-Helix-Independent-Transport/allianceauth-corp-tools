import { loadDoctrines } from "../apis/Character";
import ErrorBoundary from "../components/ErrorBoundary";
import { ErrorLoader } from "../components/ErrorLoader";
import { PanelLoader } from "../components/PanelLoader";
import { DoctrineCheck } from "../components/skills/DoctrineCheck";
import { DoctrinePanel } from "../components/skills/DoctrinePannel";
import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharDoctrines = () => {
  let { characterID } = useParams();

  const { isLoading, error, data } = useQuery(
    ["doctrines", characterID],
    () => loadDoctrines(characterID),
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <h5 className="text-center">Doctrine Key:</h5>
        <div className="flex-container">
          <DoctrineCheck name="Passed" skill_reqs={[]} skill_list={{}} />
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
          <DoctrineCheck
            name="Failed"
            skill_reqs={{ "Some Skill": 5 }}
            skill_list={{ "Some Skill": { active_level: 1, trained_level: 1 } }}
          />
        </div>
        <hr />
        {data.map((char) => {
          return (
            <DoctrinePanel
              character={char.character}
              doctrines={char.doctrines}
              skills={char.skills}
            />
          );
        })}
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharDoctrines;
