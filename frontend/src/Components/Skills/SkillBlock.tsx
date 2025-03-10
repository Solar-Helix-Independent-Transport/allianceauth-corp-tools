import Styles from "./SkillBlock.module.css";
import { SkillLevelBlock } from "./SkillLevelBlock";

export const SkillBlock = ({
  skill,
  level,
  active = 0,
  trained = 0,
  sp = 0,
  className = "",
}: {
  skill: string;
  level: number;
  active: number;
  trained: number;
  sp?: number;
  className?: string;
}) => {
  return (
    <div className={`${className} ${Styles.skillBlock}`}>
      <div className="d-flex flex-row justify-content-between my-1 mx-3 align-items-center text-nowrap">
        <span className="flex-grow-1  text-nowrap">{skill}</span>
        {sp ? (
          <span className="badge bg-secondary me-1 text-nowrap">{sp.toLocaleString()} SP</span>
        ) : (
          <></>
        )}
        <SkillLevelBlock {...{ level, active, trained }} />
      </div>
    </div>
  );
};
