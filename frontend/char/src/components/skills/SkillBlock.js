import { SkillLevelBlock } from "./SkillLevelBlock";
import React from "react";

export const SkillBlock = ({ skill, level, active = -10, className = "" }) => {
  return (
    <div className={`flex-skill-block ${className}`}>
      <p>{skill}</p>
      <SkillLevelBlock {...{ level, active }} />
    </div>
  );
};
