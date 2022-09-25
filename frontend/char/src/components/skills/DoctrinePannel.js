import CharacterPortrait from "../CharacterPortrait";
import { DoctrineCheck } from "./DoctrineCheck";
import React from "react";
import { Panel } from "react-bootstrap";

export const DoctrinePanel = ({ character, doctrines, skills }) => {
  return (
    <Panel>
      <Panel.Heading className="text-center">{character.character_name}</Panel.Heading>
      <Panel.Body className="flex-container">
        <div className="flex-one">
          <CharacterPortrait character={character} className="doctrine-portrait" />
        </div>
        <div className="flex-five flex-container">
          {Object.entries(doctrines).length > 0 ? (
            <>
              {Object.entries(doctrines).map(([k, v]) => {
                return <DoctrineCheck name={k} skill_reqs={v} skill_list={skills} />;
              })}
            </>
          ) : (
            <p>No Tokens</p>
          )}
        </div>
      </Panel.Body>
    </Panel>
  );
};
