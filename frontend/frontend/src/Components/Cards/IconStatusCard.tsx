import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

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
};

export const IconStatusDiv = ({ iconSrc, text, textVariant, isLoading }: IconStatusCardProps) => {
  return (
    <div
      className={`d-flex ${text ? "pt-2" : ""} flex-column align-items-center`}
      style={{ minWidth: "64px", height: "64px" }}
    >
      <img src={iconSrc} height={text || isLoading ? 32 : 64} width={text || isLoading ? 32 : 64} />
      {!isLoading ? (
        text && <h6 className={`text-${textVariant} text-nowrap mx-1`}>{text}</h6>
      ) : (
        <Spinner animation="border" size="sm" />
      )}
    </div>
  );
};

export const IconStatusCard = ({
  iconSrc,
  text,
  cardVariant,
  textVariant,
  isLoading,
  borderVariant,
}: IconStatusCardProps) => {
  return (
    <Card
      border={cardVariant}
      className={`m-2 ${borderVariant == "thick" ? "border-4" : "border-2"} ${
        text || (isLoading && "pt-2")
      }`}
    >
      <IconStatusDiv
        iconSrc={iconSrc}
        text={text}
        textVariant={textVariant}
        isLoading={isLoading}
      />
    </Card>
  );
};
