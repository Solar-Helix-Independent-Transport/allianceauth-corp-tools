import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./doctrine.css";
import { SkillBlock } from "./SkillBlock";

export const DoctrineModal = ({
  show,
  setShow,
  name,
  skill_reqs,
  skill_list,
}) => {
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
          if (skill_list[k]) {
            trained_level = skill_list[k].trained_level;
          }
          return (
            <SkillBlock
              skill={k}
              level={v}
              active={trained_level}
              className="full-width"
            />
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => toggleLevel()}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
