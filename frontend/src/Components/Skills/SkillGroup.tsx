import { useTranslation } from "react-i18next";
import { SkillBlock } from "./SkillBlock";
import { Accordion } from "react-bootstrap";

export const SkillGroup = ({ group, skills }: { group: string; skills: Array<any> }) => {
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
          .sort(function (a: any, b: any) {
            const nameA = a.skill.toLowerCase(),
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
                sp={skill.sp}
              />
            );
          })}
      </Accordion.Body>
    </Accordion.Item>
  );
};
