import { useTranslation } from "react-i18next";
import { BOOTSTRAP_HEX, secColor } from "./layout";
import type { SovMapMode } from "./types";

const Swatch = ({ color, label }: { color: string; label: string }) => (
  <span className="d-inline-flex align-items-center me-3 text-nowrap small">
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        marginRight: 4,
      }}
    />
    {label}
  </span>
);

const LineSwatch = ({ color, label }: { color: string; label: string }) => (
  <span className="d-inline-flex align-items-center me-3 text-nowrap small">
    <svg width={16} height={10} style={{ marginRight: 4 }}>
      <line x1={0} y1={5} x2={16} y2={5} stroke={color} strokeWidth={2} strokeDasharray="4 3" />
    </svg>
    {label}
  </span>
);

// Jump bridges are drawn regardless of mode (like the background stargate
// lines), so their legend entry doesn't belong to either mode-specific list.
const JumpBridgeSwatch = () => {
  const { t } = useTranslation();
  return <LineSwatch color={BOOTSTRAP_HEX.primary} label={t("Jump Bridge")} />;
};

const Legend = ({ mode }: { mode: SovMapMode }) => {
  const { t } = useTranslation();

  if (mode === "upgrades") {
    return (
      <div>
        <Swatch color={BOOTSTRAP_HEX.success} label={t("Online")} />
        <Swatch color={BOOTSTRAP_HEX.info} label={t("Pending")} />
        <Swatch color={BOOTSTRAP_HEX.warning} label={t("Offline")} />
        <Swatch color={BOOTSTRAP_HEX.danger} label={t("Low")} />
        <Swatch color={secColor(0.5)} label={t("Non-hub system")} />
        <JumpBridgeSwatch />
      </div>
    );
  }

  return (
    <div>
      <Swatch color={BOOTSTRAP_HEX.info} label={t("Import")} />
      <Swatch color={BOOTSTRAP_HEX.primary} label={t("Export")} />
      <Swatch color={BOOTSTRAP_HEX.secondary} label={t("Transit / none")} />
      <Swatch color={secColor(0.5)} label={t("Uninvolved system")} />
      <JumpBridgeSwatch />
    </div>
  );
};

export default Legend;
