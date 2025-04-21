import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { GetSecurityColors } from "../helpers/colors";
import { useTranslation } from "react-i18next";

const showOverlay = (toolTipText: string | undefined) => {
  return toolTipText ? (
    <Tooltip placement={"top"} id={toolTipText} style={{ position: "fixed" }}>
      {toolTipText}
    </Tooltip>
  ) : (
    <></>
  );
};

export const SecurityStatusBadge = ({
  securityStatus,
}: {
  securityStatus: number | null | undefined;
}) => {
  const { t } = useTranslation();

  let text = t("Unknown System Security");
  let color = "transparent";

  if (securityStatus) {
    if (securityStatus >= 0.5) {
      text = t("High Security Space");
    } else if (securityStatus > 0.0) {
      text = t("Low Security Space");
    } else {
      text = t("Null Security Space");
    }
    color = GetSecurityColors(securityStatus);
    text = `${text} (${securityStatus?.toFixed(2)})`;
  }

  return (
    <div className="d-flex flex-row me-2">
      <OverlayTrigger trigger={["hover", "focus"]} overlay={showOverlay(text)}>
        <div
          className="m-1 mx-2 border border-opacity-25"
          style={{
            backgroundColor: securityStatus !== null ? color : "transparent",
            borderRadius: "50%",
            minWidth: "16px",
            maxWidth: "16px",
            minHeight: "16px",
            maxHeight: "16px",
          }}
        ></div>
      </OverlayTrigger>
    </div>
  );
};
