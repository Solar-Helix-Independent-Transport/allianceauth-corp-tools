import { loadSkillHistory } from "../apis/Character";
import ErrorBoundary from "../components/ErrorBoundary";
import { ErrorLoader } from "../components/ErrorLoader";
import { PanelLoader } from "../components/PanelLoader";
import { SkillHistoryGraph } from "../components/SkillHistoryGraph";
import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharHistory = () => {
  let { characterID } = useParams();

  const { isLoading, error, data } = useQuery(
    ["skill-history", characterID],
    () => loadSkillHistory(characterID),
    {
      initialData: [],
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body>
        <SkillHistoryGraph data={data} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharHistory;
