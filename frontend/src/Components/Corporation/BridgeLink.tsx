import styles from "./BridgeLink.module.css";
import { Badge, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";

function MyTooltip({ message }: any) {
  return (
    <Tooltip style={{ position: "fixed" }} id="tooltip">
      {message}
    </Tooltip>
  );
}

export const BridgeLink = ({ start, end }: any) => {
  return (
    <div className="bridge-div d-flex col-xs-12 my-3">
      {start.system_name ? (
        <>
          <div
            style={{ justifyContent: "center" }}
            className={`d-flex flex-column ${styles.start} ${start.active ? styles.gateActive : styles.gateInactive}`}
          >
            <h4>{start.system_name}</h4>
            <p>{start.name}</p>
          </div>

          <div className="d-flex justify-content-evenly align-content-center flex-column">
            <Badge bg={start.ozone > 2500000 ? "info" : "danger"}>
              {" "}
              Ozone: {start.ozone.toLocaleString()}
            </Badge>
            <Badge bg={start.expires > 13 ? "info" : "danger"}> Fuel: {start.expires} days</Badge>
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
          <div className={`${styles.start} ${styles.gateInactive}`}>
            <h4>Unknown</h4>
          </div>
          <i className="flex-child far fa-question-circle"></i>
        </>
      )}
      <div className="align-self-center" style={{ flexGrow: "5", textAlign: "center" }}>
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
            <>
              <div className="d-flex justify-content-evenly align-content-center flex-column">
                <Badge className="flex-child" bg={end.ozone > 2500000 ? "info" : "danger"}>
                  Ozone: {end.ozone.toLocaleString()}
                </Badge>
                <Badge className="flex-child" bg={end.expires > 13 ? "info" : "danger"}>
                  Fuel: {end.expires} Days
                </Badge>
              </div>
              <div
                className={`${styles.end} ${end.active ? styles.gateActive : styles.gateInactive}`}
              >
                <h4>{end.system_name}</h4>
                <p>{end.name}</p>
              </div>
            </>
          ) : (
            <OverlayTrigger placement="top" overlay={MyTooltip({ message: "Gate Offline!" })}>
              <i className="far fa-times-circle"></i>
            </OverlayTrigger>
          )}
        </>
      ) : (
        <>
          <OverlayTrigger
            placement="top"
            overlay={MyTooltip({
              message: "Gate not found in the Audit Module!",
            })}
          >
            <i className="align-self-center far fa-question-circle"></i>
          </OverlayTrigger>

          <div
            style={{ justifyContent: "center" }}
            className={`d-flex flex-column ${styles.end} ${styles.gateInactive}`}
          >
            <h4>Unknown</h4>
          </div>
        </>
      )}
    </div>
  );
};
