import { SkillBlock } from "./SkillBlock";
import React from "react";
import { Panel } from "react-bootstrap";

export const SkillGroup = ({ group, skills }) => {
  return (
    <Panel>
      <Panel.Heading>{group}</Panel.Heading>
      <Panel.Body className="flex-container flex-group-block">
        {skills
          .sort(function (a, b) {
            var nameA = a.skill.toLowerCase(),
              nameB = b.skill.toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          })
          .map((skill) => {
            return (
              <SkillBlock
                skill={skill.skill}
                level={skill.level}
                active={skill.active}
                trained={skill.active}
              />
            );
          })}
      </Panel.Body>
    </Panel>
  );
};
