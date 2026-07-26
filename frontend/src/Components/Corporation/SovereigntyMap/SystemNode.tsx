import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { DotVisual } from "../../SpaceMap/DotNode";
import { upgradeStateBg, type WorkforceTransport } from "../sovereigntyShared";
import { BOOTSTRAP_HEX } from "./layout";
import type { SystemNodeData } from "./types";

// xyflow refuses to create an edge touching a node that has no registered
// handle at all (React Flow error #008), even for our custom FloatingEdge
// which computes its own path via useInternalNode and ignores the handle's
// actual position. These exist purely so edge creation validates - any
// system can be the source or target of a flow edge, so each needs one of
// each type.
const HANDLE_STYLE = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  border: "none",
  background: "transparent",
  pointerEvents: "none" as const,
};

const DIRECTION_ICON: Record<string, string> = {
  import: "⬇", // down arrow - workforce flowing in
  export: "⬆", // up arrow - workforce flowing out
  transit: "↔", // left-right arrow - passing through
};

const formatAmount = (n: number | null | undefined) => (n != null ? n.toLocaleString() : null);

const TransportSummary = ({ transport }: { transport: WorkforceTransport }) => {
  if (!transport || !transport.mode) {
    return <span style={{ opacity: 0.6 }}>No transport</span>;
  }

  if (transport.mode === "import") {
    return (
      <div>
        <span style={{ marginRight: 4 }}>{DIRECTION_ICON.import}</span>
        Import
        {transport.state_sources.length > 0 && (
          <div style={{ opacity: 0.85, fontSize: 10 }}>
            {transport.state_sources.map((s, i) => (
              <span key={i}>
                {i > 0 && ", "}
                {s.system_name}
                {s.amount != null && ` (${formatAmount(s.amount)})`}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (transport.mode === "export") {
    // The live/"state" amount can lag behind or simply not be populated by
    // ESI yet even when a destination is configured, so fall back to the
    // configured amount rather than showing no number at all.
    const exportAmount =
      transport.state_destination?.amount ?? transport.config_destination?.amount;
    return (
      <div>
        <span style={{ marginRight: 4 }}>{DIRECTION_ICON.export}</span>
        Export
        {transport.state_destination && (
          <div style={{ opacity: 0.85, fontSize: 10 }}>
            {transport.state_destination.system_name}
            {exportAmount != null && ` (${formatAmount(exportAmount)})`}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <span style={{ marginRight: 4 }}>{DIRECTION_ICON.transit}</span>
      Transit
    </div>
  );
};

const WorkforceLine = ({
  allocated,
  available,
}: {
  allocated: number | null;
  available: number | null;
}) => {
  if (allocated == null || available == null) return null;
  return (
    <div style={{ opacity: 0.85, fontSize: 10, marginTop: 3 }}>
      {formatAmount(allocated)} / {formatAmount(available)} workforce
    </div>
  );
};

const AnarchyAlertBadge = ({ dens }: { dens: SystemNodeData["system"]["anarchy_dens"] }) => {
  if (!dens || dens.length === 0) return null;
  const title = dens
    .map((d) => `${d.character_name} - ${d.type_name} (${d.anarchy_amount}% anarchy)`)
    .join("\n");
  return (
    <div
      title={`Mercenary den anarchy is disrupting this hub's workforce:\n${title}`}
      style={{
        position: "absolute",
        top: -8,
        right: -8,
        background: BOOTSTRAP_HEX.danger,
        color: "#fff",
        borderRadius: "50%",
        width: 18,
        height: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        boxShadow: "0 0 0 2px var(--bs-body-bg)",
        cursor: "help",
      }}
    >
      !
    </div>
  );
};

// A big, unmissable glow layered under the normal card shadow - so a hub
// under den-anarchy pressure stands out on the map itself, not just via the
// small corner badge (which is easy to miss when zoomed out or scanning
// dozens of hubs at once).
const ANARCHY_GLOW = `0 0 18px 6px ${BOOTSTRAP_HEX.danger}, 0 0 34px 14px color-mix(in srgb, ${BOOTSTRAP_HEX.danger} 55%, transparent)`;

const SystemCard = ({ data, selected }: { data: SystemNodeData; selected?: boolean }) => (
  <div
    style={{
      position: "relative",
      minWidth: 130,
      maxWidth: 230,
      background: "color-mix(in srgb, var(--bs-tertiary-bg) 70%, transparent)",
      border: `2px solid ${data.system.anarchy_alert ? BOOTSTRAP_HEX.danger : data.color}`,
      borderRadius: 6,
      boxShadow: [
        data.system.anarchy_alert ? ANARCHY_GLOW : null,
        selected
          ? `0 0 0 2px var(--bs-emphasis-color), 0 4px 14px rgba(0,0,0,0.75)`
          : "0 2px 6px rgba(0,0,0,0.55)",
      ]
        .filter(Boolean)
        .join(", "),
      padding: "5px 8px",
      fontSize: 11,
      color: "var(--bs-body-color)",
      cursor: "pointer",
    }}
  >
    <AnarchyAlertBadge dens={data.system.anarchy_dens} />
    <div
      style={{
        fontWeight: 600,
        fontSize: 12,
        marginBottom: 4,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={data.ownerName ? `${data.system.name} (${data.ownerName})` : data.system.name}
    >
      {data.system.name}
    </div>

    {data.mode === "upgrades" ? (
      data.hubUpgrades && data.hubUpgrades.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {data.hubUpgrades.map((u, i) => (
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
      ) : data.hasUpgradeSearch ? null : (
        <span style={{ opacity: 0.6 }}>No upgrades</span>
      )
    ) : (
      <TransportSummary transport={data.transport ?? null} />
    )}
    <WorkforceLine
      allocated={data.workforceAllocated ?? null}
      available={data.workforceAvailable ?? null}
    />
  </div>
);

const SystemNodeImpl = ({ data, selected }: NodeProps & { data: SystemNodeData }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Bottom} style={HANDLE_STYLE} />
      {data.system.is_hub ? (
        <SystemCard data={data} selected={selected} />
      ) : (
        <DotVisual radius={data.radius} color={data.color} name={data.system.name} />
      )}
    </>
  );
};

export const SystemNode = memo(SystemNodeImpl);
