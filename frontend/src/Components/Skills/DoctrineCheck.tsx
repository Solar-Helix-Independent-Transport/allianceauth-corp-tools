import { DoctrineModal } from "./DoctrineModal";
// import "./doctrine.css";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";

export const DoctrineCheck = ({ name, skill_reqs, skill_list }: any) => {
  const [show, setShow] = useState(false);
  let completed = Object.entries(skill_reqs).length === 0;
  let style = completed ? { variant: "success" } : { variant: "danger" };

  let alpha_check = Object.entries(skill_reqs)?.reduce((o, [k, v]) => {
    let trained_level = 0;
    if (skill_list[k]) {
      trained_level = skill_list[k].trained_level;
    }
    return o && trained_level >= Number(v);
  }, true);
  if (!completed && alpha_check) {
    style = { variant: "warning" };
  }
  let clipboard_text = Object.entries(skill_reqs)?.reduce((o, [k, v]) => {
    return o + "" + k + " " + v + "\n";
  }, "");
  return (
    <>
      <>
        <div className="m-2">
          <ButtonGroup>
            <Button {...style} size="sm" onClick={() => setShow(true)}>
              {name}
              {completed ? <></> : <></>}
            </Button>
            {!alpha_check ? (
              <CopyToClipboard text={clipboard_text}>
                <Button size="sm" variant="danger">
                  <i className="fa-solid fa-copy"></i>
                </Button>
              </CopyToClipboard>
            ) : (
              <Button size="sm" {...style} className="flex-one">
                {completed ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  <i className="fa-solid fa-circle-exclamation"></i>
                )}
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
