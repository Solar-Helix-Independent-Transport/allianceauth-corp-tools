import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Spinner from "react-bootstrap/Spinner";
import Tooltip from "react-bootstrap/Tooltip";
import styles from "./IconsStatusCard.module.css";

type IconStatusCardProps = {
  iconSrc: string;
  text?: string;
  cardVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light";
  textVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "muted";
  borderVariant?: "thick";
  isLoading?: boolean;
  toolTipText?: string;
};

export const IconStatusDiv = ({
  iconSrc,
  text,
  textVariant,
  cardVariant,
  borderVariant,
  isLoading,
  toolTipText,
}: IconStatusCardProps) => {
  const inner = (
    <div
      className={`d-flex m-1 ${text || isLoading ? "pt-2" : ""} flex-column align-items-center`}
      style={{ minWidth: "64px" }}
    >
      <div
        className={`${styles.imgBg} border border-${cardVariant} ${borderVariant === "thick" ? "border-5" : "border-3"}`}
      >
        <img
          className="m-1"
          style={{ borderRadius: "30%" }}
          src={iconSrc}
          height={text || isLoading ? 32 : 64}
          width={text || isLoading ? 32 : 64}
        />
      </div>
      {!isLoading ? (
        text && <h6 className={`text-${textVariant} text-nowrap mx-1`}>{text}</h6>
      ) : (
        <Spinner animation="border" size="sm" />
      )}
    </div>
  );

  if (!toolTipText) return inner;

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      overlay={
        <Tooltip placement="top" id={toolTipText} style={{ position: "fixed" }}>
          {toolTipText}
        </Tooltip>
      }
    >
      {inner}
    </OverlayTrigger>
  );
};
