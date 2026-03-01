import { DoctrineModal } from "./DoctrineModal";
// import "./doctrine.css";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";

export const DoctrineCheck = ({ name, skill_reqs, skill_list }: any) => {
  const [show, setShow] = useState(false);
  const { _meta, ..._skill_reqs } = skill_reqs;
  if (!_meta) {
    return <></>;
  }
  let completed = Object.entries(_skill_reqs)?.length === 0;
  let style = completed ? { variant: "success" } : { variant: "danger" };

  let alpha_check = Object.entries(_skill_reqs)?.reduce((o, [k, v]) => {
    let trained_level = 0;
    if (skill_list[k]) {
      trained_level = skill_list[k].trained_level;
    }
    return o && trained_level >= Number(v);
  }, true);
  if (!completed && alpha_check) {
    style = { variant: "warning" };
  }
  let clipboard_text = Object.entries(_skill_reqs)?.reduce((o, [k, v]) => {
    if (k !== "_meta") {
      return o + "" + k + " " + v + "\n";
    }
    return o;
  }, "");
  return (
    <>
      <>
        <div className="m-2">
          <ButtonGroup>
            <Button {...style} size="sm" onClick={() => setShow(true)}>
              {name}
              {completed ? (
                <></>
              ) : (
                !alpha_check && (
                  <>
                    <span className="">
                      {` - `}
                      {Math.floor((_meta?.trained_sp / _meta?.total_sp) * 100)}%
                    </span>
                  </>
                )
              )}
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
            <DoctrineModal skill_reqs={_skill_reqs} {...{ show, setShow, name, skill_list }} />
          ) : (
            <></>
          )}
        </div>
      </>
    </>
  );
};
