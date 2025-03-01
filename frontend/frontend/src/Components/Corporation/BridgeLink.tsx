import "./BridgeLink.module.css";
import { Badge, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";

function MyTooltip({ message }: any) {
  return <Tooltip id="tooltip">{message}</Tooltip>;
}

export const BridgeLink = ({ start, end }: any) => {
  return (
    <div className="bridge-div flex-container col-xs-12">
      {start.system_name ? (
        <>
          <div className={`start ${start.active ? "gate-active" : "gate-inactive"}`}>
            <h4>{start.system_name}</h4>
            <p>{start.name}</p>
          </div>

          <div className="flex-container-vert-fill">
            <Badge className="flex-child" bg={start.ozone > 2500000 ? "info" : "danger"}>
              {" "}
              Ozone: {start.ozone.toLocaleString()}
            </Badge>
            <Badge className="flex-child" bg={start.expires > 13 ? "info" : "danger"}>
              {" "}
              Fuel: {start.expires} days
            </Badge>
          </div>
          {start.active ? (
            <></>
          ) : (
            <OverlayTrigger placement="top" overlay={MyTooltip({ message: "Gate Offline!" })}>
              <i className="far fa-times-circle"></i>
            </OverlayTrigger>
          )}
        </>
      ) : (
        <>
          <div className="end gate-inactive">
            <h4>Unknown</h4>
          </div>
          <i className="flex-child far fa-question-circle"></i>
        </>
      )}
      <div className="" style={{ flexGrow: "5", textAlign: "center" }}>
        <ProgressBar
          style={{ margin: "auto", marginLeft: "5px", marginRight: "5px" }}
          animated={
            end.known && start.known
              ? end.active && start.active
                ? true
                : end.active || start.activefalse
                  ? true
                  : false
              : true
          }
          variant={
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
          {end.system_name ? (
            <></>
          ) : (
            <OverlayTrigger placement="top" overlay={MyTooltip({ message: "Gate Offline!" })}>
              <i className="far fa-times-circle"></i>
            </OverlayTrigger>
          )}

          <div className="flex-container-vert-fill">
            <Badge className="flex-child" bg={end.ozone > 2500000 ? "info" : "danger"}>
              {" "}
              Ozone: {end.ozone.toLocaleString()}
            </Badge>
            <Badge className="flex-child" bg={end.expires > 13 ? "info" : "danger"}>
              {" "}
              Fuel: {end.expires} Days
            </Badge>
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
            <i className="flex-child far fa-question-circle"></i>
          </OverlayTrigger>

          <div className="end gate-unknown">
            <h4>Unknown</h4>
          </div>
        </>
      )}
    </div>
  );
};
