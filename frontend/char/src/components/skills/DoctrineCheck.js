import React, { useState } from "react";
import { Button, ButtonGroup, Glyphicon } from "react-bootstrap";
import "./doctrine.css";
import { DoctrineModal } from "./DoctrineModal";

export const DoctrineCheck = ({ name, skill_reqs, skill_list }) => {
  const [show, setShow] = useState(false);
  let completed = Object.entries(skill_reqs).length === 0;
  let style = completed ? { bsStyle: "success" } : { bsStyle: "warning" };
  return (
    <>
      {completed ? (
        <Button
          {...style}
          className="doctrine-button"
          bsSize="small"
          onClick={() => setShow(true)}
        >
          {name}
          {completed ? <></> : <></>}
        </Button>
      ) : (
        <>
          <div className="doctrine-button">
            <ButtonGroup className="flex-container " justified={true}>
              <Button
                {...style}
                bsSize="small"
                className="flex-doctrine-btn-name"
                onClick={() => setShow(true)}
              >
                {name}
                {completed ? <></> : <></>}
              </Button>
              <Button bsSize="small" className="flex-doctrine-btn-copy">
                <Glyphicon glyph="copy" />
              </Button>
            </ButtonGroup>

            <DoctrineModal
              {...{ show, setShow, name, skill_reqs, skill_list }}
            />
          </div>
        </>
      )}
    </>
  );
};
