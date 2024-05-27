import { DoctrineModal } from "./DoctrineModal";
import "./doctrine.css";
import React, { useState } from "react";
import { Button, ButtonGroup, Glyphicon } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const DoctrineCheck = ({ name, skill_reqs, skill_list }) => {
  const [show, setShow] = useState(false);
  let completed = Object.entries(skill_reqs).length === 0;
  let style = completed ? { bsStyle: "success" } : { bsStyle: "danger" };

  let alpha_check = Object.entries(skill_reqs).reduce((o, [k, v]) => {
    let trained_level = 0;
    if (skill_list[k]) {
      trained_level = skill_list[k].trained_level;
    }
    return o && trained_level >= v;
  }, true);
  if (!completed && alpha_check) {
    style = { bsStyle: "warning" };
  }
  let clipboard_text = Object.entries(skill_reqs).reduce((o, [k, v]) => {
    return o + "" + k + " " + v + "\n";
  }, "");
  return (
    <>
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
            {!alpha_check ? (
              <CopyToClipboard text={clipboard_text}>
                <Button bsSize="small" className="flex-doctrine-btn-copy">
                  <Glyphicon glyph="copy" />
                </Button>
              </CopyToClipboard>
            ) : (
              <Button bsSize="small" {...style} className="flex-one">
                <Glyphicon glyph={completed ? "check" : "alert"} />
              </Button>
            )}
          </ButtonGroup>
          {!completed ? (
            <DoctrineModal {...{ show, setShow, name, skill_reqs, skill_list }} />
          ) : (
            <></>
          )}
        </div>
      </>
    </>
  );
};
