import { SkillBlock } from "./SkillBlock";
import { SkillBlockKey } from "./SkillBlockKey";
import "./doctrine.css";
import React from "react";
import { Button, Modal } from "react-bootstrap";

export const DoctrineModal = ({ show, setShow, name, skill_reqs, skill_list }) => {
  const toggleLevel = () => {
    setShow(!show);
  };

  return (
    <Modal show={show} onHide={() => toggleLevel()}>
      <Modal.Header closeButton>
        <Modal.Title>{name} - Missing Skills</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.entries(skill_reqs).map(([k, v]) => {
          let trained_level = 0;
          let active_level = 0;
          if (skill_list[k]) {
            active_level = skill_list[k].active_level;
            trained_level = skill_list[k].trained_level;
          }
          return (
            <SkillBlock
              skill={k}
              level={v}
              active={active_level}
              trained={trained_level}
              className="full-width"
            />
          );
        })}

        <hr />
        <SkillBlockKey />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => toggleLevel()}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
