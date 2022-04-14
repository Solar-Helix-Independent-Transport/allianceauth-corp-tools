import React from "react";
import { SkillLevelBlock } from "./SkillLevelBlock";

export const SkillBlock = ({ skill, level, active = -10, className = "" }) => {
  return (
    <div className={`flex-skill-block ${className}`}>
      <p>{skill}</p>
      <SkillLevelBlock {...{ level, active }} />
    </div>
  );
};
