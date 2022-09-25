import "./BridgeLink.css";
import React from "react";
import { Label, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";

function MyTooltip({ message }) {
  return <Tooltip id="tooltip">{message}</Tooltip>;
}

export const BridgeLink = ({ start = { known: false }, end = { known: false } }) => {
  return (
    <div class="bridge-div flex-container col-xs-12">
      {start.known ? (
        <>
          <div className={`start ${start.active ? "gate-active" : "gate-inactive"}`}>
            <h4>{start.system_name}</h4>
            <p>{start.name}</p>
          </div>

          <div className="flex-container-vert-fill">
            <Label className="flex-child" bsStyle={start.ozone > 2500000 ? "info" : "danger"}>
              {" "}
              Ozone: {start.ozone.toLocaleString()}
            </Label>
            <Label className="flex-child" bsStyle={start.expires > 13 ? "info" : "danger"}>
              {" "}
              Fuel: {start.expires} days
            </Label>
          </div>
          {start.active ? (
            <></>
          ) : (
            <OverlayTrigger placement="top" overlay={MyTooltip({ message: "Gate Offline!" })}>
              <i class="far fa-times-circle"></i>
            </OverlayTrigger>
          )}
        </>
      ) : (
        <>
          <div className="end gate-inactive">
            <h4>Unknown</h4>
          </div>
          <i class="flex-child far fa-question-circle"></i>
        </>
      )}
      <div class="" style={{ flexGrow: "5", textAlign: "center" }}>
        <ProgressBar
          style={{ margin: "auto", marginLeft: "5px", marginRight: "5px" }}
          active={
            end.known && start.known
              ? end.active && start.active
                ? true
                : end.active || start.activefalse
                ? true
                : false
              : true
          }
          bsStyle={
            end.known && start.known
              ? end.active && start.active
                ? "success"
                : end.active || start.activefalse
                ? "warning"
                : "danger"
              : "warning"
          }
          now={100}
        />
      </div>
      {end.known ? (
        <>
          {end.active ? (
            <></>
          ) : (
            <OverlayTrigger placement="top" overlay={MyTooltip({ message: "Gate Offline!" })}>
              <i class="far fa-times-circle"></i>
            </OverlayTrigger>
          )}

          <div className="flex-container-vert-fill">
            <Label className="flex-child" bsStyle={end.ozone > 2500000 ? "info" : "danger"}>
              {" "}
              Ozone: {end.ozone.toLocaleString()}
            </Label>
            <Label className="flex-child" bsStyle={end.expires > 13 ? "info" : "danger"}>
              {" "}
              Fuel: {end.expires} Days
            </Label>
          </div>
          <div className={`end ${end.active ? "gate-active" : "gate-inactive"}`}>
            <h4>{end.system_name}</h4>
            <p>{end.name}</p>
          </div>
        </>
      ) : (
        <>
          <OverlayTrigger
            placement="top"
            overlay={MyTooltip({
              message: "Gate not found in the Audit Module!",
            })}
          >
            <i class="flex-child far fa-question-circle"></i>
          </OverlayTrigger>

          <div className="end gate-unknown">
            <h4>Unknown</h4>
          </div>
        </>
      )}
    </div>
  );
};
