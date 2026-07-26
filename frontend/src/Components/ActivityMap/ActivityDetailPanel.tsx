import { useTranslation } from "react-i18next";
import { secColor } from "../SpaceMap/layout";
import type { ActivityMapSystem } from "./types";

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
    <span style={{ opacity: 0.75 }}>{label}</span>
    <span style={{ textAlign: "right" }}>{value}</span>
  </div>
);

const ActivityDetailPanel = ({
  system,
  value,
  count,
  quantity,
  valueLabel,
  countLabel,
  quantityLabel,
  onClose,
}: {
  system: ActivityMapSystem;
  value: number;
  count: number;
  quantity: number;
  valueLabel?: string;
  countLabel?: string;
  quantityLabel?: string;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 5,
        minWidth: 220,
        maxWidth: 320,
        background: "color-mix(in srgb, var(--bs-tertiary-bg) 94%, transparent)",
        border: "1px solid var(--bs-border-color)",
        borderRadius: 6,
        boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
        padding: "8px 10px",
        fontSize: 12,
        color: "var(--bs-body-color)",
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div style={{ fontWeight: 600, fontSize: 13 }}>{system.name}</div>
        <button
          type="button"
          aria-label={t("Close")}
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--bs-body-color)",
            opacity: 0.7,
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            padding: 0,
            marginLeft: 8,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        <Row
          label={t("Security")}
          value={
            <span style={{ color: secColor(system.security_status) }}>
              {system.security_status != null ? system.security_status.toFixed(1) : "—"}
              {system.security_class ? ` (${system.security_class})` : ""}
            </span>
          }
        />
        {valueLabel && <Row label={t(valueLabel)} value={value.toLocaleString()} />}
        {countLabel && <Row label={t(countLabel)} value={count.toLocaleString()} />}
        {quantityLabel && <Row label={t(quantityLabel)} value={quantity.toLocaleString()} />}
      </div>
    </div>
  );
};

export default ActivityDetailPanel;
