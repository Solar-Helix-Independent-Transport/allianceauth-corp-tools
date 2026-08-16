import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getRefTypeLabel } from "./refTypeFormat";

const RefTypeLabel = ({
  refType,
  name,
  description,
}: {
  refType: string;
  name?: string | null;
  description?: string | null;
}) => {
  const label = getRefTypeLabel(refType, name);

  if (!description) {
    return <span>{label}</span>;
  }

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      overlay={
        <Tooltip id={`ref-type-${refType}`} style={{ position: "fixed" }}>
          {description}
        </Tooltip>
      }
    >
      <span>{label}</span>
    </OverlayTrigger>
  );
};

export default RefTypeLabel;
