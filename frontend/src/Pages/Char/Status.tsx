import CharacterStatusPanels from "../../Components/Character/CharacterStatusPanels";
import CharacterStatusTable from "../../Components/Character/CharacterStatusTable";
import { loadCharacterStatus } from "../../api/character";
import { useState } from "react";
import { Card, Form, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const CharacterStatus = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const [table, setTable] = useState(false);
  const [issuesOnly, setIssuesOnly] = useState(false);
  const { data, isFetching } = useQuery({
    queryKey: ["status", characterID],
    queryFn: () => loadCharacterStatus(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
    initialData: { characters: [], main: undefined, headers: [] },
  });

  const filteredData = {
    ...data,
    characters: issuesOnly ? data.characters.filter((c: any) => !c.active) : data.characters,
  };

  return (
    <>
      <Card.Header className="text-end">
        <div className="d-flex justify-content-end gap-3">
          <Form.Check
            type="switch"
            id="issues-switch"
            label={t("Only Show Issues")}
            onChange={(event) => setIssuesOnly(event.target.checked)}
            defaultChecked={issuesOnly}
          />
          <Form.Check
            type="switch"
            id="table-switch"
            label={t("Display in Table Format")}
            onChange={(event) => setTable(event.target.checked)}
            defaultChecked={table}
          />
        </div>
      </Card.Header>
      {!isFetching && filteredData.characters.length === 0 ? (
        <Alert variant="success" className="m-3 text-center">
          <i className="fa-solid fa-circle-check me-2" />
          {issuesOnly
            ? t("No issues found — all characters are active.")
            : t("No characters found.")}
        </Alert>
      ) : table ? (
        <CharacterStatusTable {...{ isFetching }} data={filteredData} />
      ) : (
        <CharacterStatusPanels {...{ isFetching }} data={filteredData} />
      )}
    </>
  );
};

export default CharacterStatus;
