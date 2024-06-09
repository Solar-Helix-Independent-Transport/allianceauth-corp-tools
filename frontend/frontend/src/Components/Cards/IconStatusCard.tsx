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
  isLoading?: boolean;
};

export const IconStatusDiv = ({ iconSrc, text, textVariant, isLoading }: IconStatusCardProps) => {
  return (
    <div
      className={`d-flex ${text ? "pt-2" : ""} flex-column align-items-center`}
      style={{ width: "64px", height: "64px" }}
    >
      <img src={iconSrc} height={text ? 32 : 64} width={text ? 32 : 64} />
      {!isLoading ? (
        text && <h6 className={`text-${textVariant}`}>{text}</h6>
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
}: IconStatusCardProps) => {
  return (
    <Card border={cardVariant} className={`m-2 ${cardVariant && "border-4"} ${text && "pt-2"}`}>
      <IconStatusDiv
        iconSrc={iconSrc}
        text={text}
        textVariant={textVariant}
        isLoading={isLoading}
      />
    </Card>
  );
};
