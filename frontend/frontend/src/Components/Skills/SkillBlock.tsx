import { SkillLevelBlock } from "./SkillLevelBlock";

export const SkillBlock = ({
  skill,
  level,
  active = 0,
  trained = 0,
  className = "",
}: {
  skill: string;
  level: number;
  active: number;
  trained: number;
  className?: string;
}) => {
  return (
    <div style={{ width: "33%" }} className={`${className}`}>
      <div className="d-flex flex-row justify-content-between mx-3">
        <p>{skill}</p>
        <SkillLevelBlock {...{ level, active, trained }} />
      </div>
    </div>
  );
};
