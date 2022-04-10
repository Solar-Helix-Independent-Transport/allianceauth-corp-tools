import React from "react";
import { SkillLevelBlock } from "./SkillLevelBlock";

export const SkillBlock = ({ skill, level, active = -1 }) => {
  return (
    <div className="flex-skill-block">
      <p>{skill}</p>
      <SkillLevelBlock {...{ level, active }} />
    </div>
  );
};
