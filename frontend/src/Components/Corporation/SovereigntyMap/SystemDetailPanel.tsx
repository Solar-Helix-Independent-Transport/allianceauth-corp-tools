import { useTranslation } from "react-i18next";
import { TimeTill } from "../../Helpers/TimeTill";
import { upgradeStateBg, type SovHub } from "../sovereigntyShared";
import { BOOTSTRAP_HEX, secColor } from "./layout";
import type { SovMapSystem } from "./types";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginTop: 8 }}>
    <div
      style={{
        opacity: 0.7,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        marginBottom: 3,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
    <span style={{ opacity: 0.75 }}>{label}</span>
    <span style={{ textAlign: "right" }}>{value}</span>
  </div>
);

const formatAmount = (n: number | null | undefined) => (n != null ? n.toLocaleString() : "—");

const TransportSummary = ({ transport }: { transport: SovHub["workforce_transport"] }) => {
  const { t } = useTranslation();
  if (!transport || !transport.mode) {
    return <span style={{ opacity: 0.6 }}>{t("No transport")}</span>;
  }

  if (transport.mode === "import") {
    if (transport.state_sources.length === 0) {
      return <span>{t("Import")}</span>;
    }
    return (
      <span>
        {t("Import from")}{" "}
        {transport.state_sources.map((s, i) => (
          <span key={i}>
            {i > 0 && ", "}
            {s.system_name}
            {s.amount != null && ` (${formatAmount(s.amount)})`}
          </span>
        ))}
      </span>
    );
  }

  if (transport.mode === "export") {
    const dest = transport.state_destination ?? transport.config_destination;
    if (!dest) return <span>{t("Export")}</span>;
    const amount = transport.state_destination?.amount ?? transport.config_destination?.amount;
    return (
      <span>
        {t("Export to")} {dest.system_name}
        {amount != null && ` (${formatAmount(amount)})`}
      </span>
    );
  }

  return <span>{t("Transit")}</span>;
};

const SystemDetailPanel = ({
  system,
  hub,
  regionName,
  onClose,
}: {
  system: SovMapSystem;
  hub?: SovHub | null;
  regionName?: string;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const dens = system.anarchy_dens ?? [];

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 5,
        minWidth: 240,
        maxWidth: 340,
        maxHeight: "80%",
        overflowY: "auto",
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

      <Section title={t("System")}>
        <Row label={t("Region")} value={regionName ?? (hub ? hub.region.name : "—")} />
        <Row
          label={t("Constellation")}
          value={hub ? hub.constellation.name : (system.constellation_id ?? "—")}
        />
        <Row
          label={t("Security")}
          value={
            <span style={{ color: secColor(system.security_status) }}>
              {system.security_status != null ? system.security_status.toFixed(1) : "—"}
              {system.security_class ? ` (${system.security_class})` : ""}
            </span>
          }
        />
        <Row label={t("Sovereignty Hub")} value={system.is_hub ? t("Yes") : t("No")} />
        {system.external && <Row label={t("On map as")} value={t("External / linked system")} />}
      </Section>

      {hub && (
        <Section title={t("Sovereignty Hub")}>
          <Row label={t("Owner")} value={hub.owner.corporation_name} />
          <Row
            label={t("Power")}
            value={`${formatAmount(hub.power_allocated)} / ${formatAmount(hub.power_available)}`}
          />
          <Row
            label={t("Workforce")}
            value={`${formatAmount(hub.workforce_allocated)} / ${formatAmount(hub.workforce_available)}`}
          />
          <Row
            label={t("Transport")}
            value={<TransportSummary transport={hub.workforce_transport} />}
          />

          {hub.upgrades.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ opacity: 0.75, marginBottom: 3 }}>{t("Upgrades")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {hub.upgrades.map((u, i) => (
                  <span
                    key={i}
                    title={u.power_state}
                    style={{
                      background: BOOTSTRAP_HEX[upgradeStateBg(u.power_state)],
                      color: "#fff",
                      borderRadius: 3,
                      padding: "1px 4px",
                      fontSize: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hub.reagents.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ opacity: 0.75, marginBottom: 3 }}>
                {t("Reagents")}
                {hub.reagent_last_updated && (
                  <>
                    {" "}
                    (<TimeTill date={hub.reagent_last_updated} />)
                  </>
                )}
              </div>
              {hub.reagents.map((r, i) => (
                <Row
                  key={i}
                  label={r.name}
                  value={`${formatAmount(r.amount)} (${formatAmount(r.burning_per_hour)}/h)`}
                />
              ))}
            </div>
          )}
        </Section>
      )}

      <Section title={t("Mercenary Dens")}>
        {dens.length > 0 ? (
          <>
            <div style={{ color: BOOTSTRAP_HEX.danger, fontWeight: 600, marginBottom: 4 }}>
              {t("Disrupting workforce in this system")}
            </div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {dens.map((d) => (
                <li key={d.den_id} style={{ marginBottom: 6 }}>
                  <div>{d.character_name}</div>
                  <div style={{ opacity: 0.75, fontSize: 11 }}>
                    {d.type_name} · {d.planet_name}
                  </div>
                  <div style={{ opacity: 0.75, fontSize: 11 }}>
                    {d.anarchy_amount}% {t("anarchy")}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div style={{ opacity: 0.7 }}>{t("None")}</div>
        )}
      </Section>
    </div>
  );
};

export default SystemDetailPanel;
