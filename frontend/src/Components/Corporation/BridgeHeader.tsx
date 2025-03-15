import { Badge } from "react-bootstrap";
import styles from "./BridgeLink.module.css";

export const BridgeHeader = () => {
  return (
    <div style={{ justifyContent: "center" }} className="d-flex align-items-center">
      <p
        className={styles.gateActive}
        style={{
          margin: "15px",
          borderBottom: "3px dotted",
        }}
      >
        Gate Online
      </p>
      <p
        className={styles.gateInactive}
        style={{
          margin: "15px",
          borderBottom: "3px dotted",
        }}
      >
        Gate Offline
      </p>{" "}
      <p
        className={styles.gateUnknown}
        style={{
          margin: "15px",
          borderBottom: "3px dotted",
        }}
      >
        Gate Unknown
      </p>
      <Badge
        bg="info"
        style={{
          margin: "15px",
        }}
      >
        Lo/Fuel Level Ok
      </Badge>
      <Badge
        bg="danger"
        style={{
          margin: "15px",
        }}
      >
        Lo/Fuel Level Low
      </Badge>
    </div>
  );
};
