import { useTranslation } from "react-i18next";
import { SkillBlock } from "./SkillBlock";
import { Accordion } from "react-bootstrap";

export interface Skill {
  skill: string;
  group: string;
  level: number;
  active: number;
  sp: number;
  queued?: number;
}

export const SkillGroup = ({ group, skills }: { group: string; skills: Skill[] }) => {
  const { t } = useTranslation();

  return (
    <Accordion.Item eventKey={`${group}`}>
      <Accordion.Header>
        <span className="flex-grow-1">{group}</span>
        <span className="badge bg-secondary me-2">
          {skills
            ?.reduce((p, c) => {
              p += c.sp;
              return p;
            }, 0)
            .toLocaleString()}{" "}
          {t("Filtered SP")}
        </span>
      </Accordion.Header>
      <Accordion.Body className="d-flex flex-wrap ">
        {skills
          .sort(function (a, b) {
            const nameA = a.skill.toLowerCase(),
              nameB = b.skill.toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          })
          .map((skill) => {
            const queued = skill.queued ?? 0;
            return (
              <SkillBlock
                skill={skill.skill}
                // The bar's target has to stretch to cover a queued level
                // past what's currently trained, or there's no room left
                // for the queued dots to render at all.
                level={Math.max(skill.level, queued)}
                active={skill.active}
                trained={skill.level}
                queued={queued}
                sp={skill.sp}
              />
            );
          })}
      </Accordion.Body>
    </Accordion.Item>
  );
};
