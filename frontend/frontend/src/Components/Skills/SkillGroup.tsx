import { SkillBlock } from "./SkillBlock";
import { Accordion } from "react-bootstrap";

export const SkillGroup = ({ group, skills }: { group: string; skills: Array<any> }) => {
  return (
    <Accordion.Item eventKey={`${group}`}>
      <Accordion.Header>{group}</Accordion.Header>
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
              />
            );
          })}
      </Accordion.Body>
    </Accordion.Item>
  );
};
