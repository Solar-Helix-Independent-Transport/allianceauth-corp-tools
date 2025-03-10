import Card from "react-bootstrap/Card";
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

const showOverlay = (toolTipText: string | undefined) => {
  return toolTipText ? (
    <Tooltip placement={"top"} id={toolTipText} style={{ position: "fixed" }}>
      {toolTipText}
    </Tooltip>
  ) : (
    <></>
  );
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
  return (
    <OverlayTrigger trigger={["hover", "focus"]} overlay={showOverlay(toolTipText)}>
      <div
        className={`d-flex m-1 ${text ? "pt-2" : ""} flex-column align-items-center`}
        style={{ minWidth: "64px" }}
      >
        <div
          // style={{ borderColor: `var(--bs-${cardVariant})` }}
          className={`${styles.imgBg} border border-${cardVariant} ${borderVariant == "thick" ? "border-5" : "border-3"}`}
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
    </OverlayTrigger>
  );
};

export const IconStatusCard = ({
  iconSrc,
  text,
  cardVariant,
  textVariant,
  isLoading,
  borderVariant,
  toolTipText,
}: IconStatusCardProps) => {
  return (
    <Card className={`m-2 border-0 ${text || (isLoading && "pt-2")}`}>
      <IconStatusDiv
        iconSrc={iconSrc}
        text={text}
        textVariant={textVariant}
        cardVariant={cardVariant}
        borderVariant={borderVariant}
        isLoading={isLoading}
        toolTipText={toolTipText}
      />
    </Card>
  );
};
