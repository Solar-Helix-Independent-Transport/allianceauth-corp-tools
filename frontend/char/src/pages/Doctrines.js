import React from "react";
import { Panel } from "react-bootstrap";
import ErrorBoundary from "../components/ErrorBoundary";
import { loadDoctrines } from "../apis/Character";
import { PanelLoader } from "../components/PanelLoader";
import { ErrorLoader } from "../components/ErrorLoader";
import { useQuery } from "react-query";
import { DoctrinePanel } from "../components/skills/DoctrinePannel";

const CharDoctrines = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(["doctrines", character_id], () =>
    loadDoctrines(character_id)
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <div className="flex-container"></div>
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
