import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
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

const SystemCard = ({ data, selected }: { data: SystemNodeData; selected?: boolean }) => (
  <div
    style={{
      minWidth: 130,
      maxWidth: 230,
      background: "color-mix(in srgb, var(--bs-tertiary-bg) 70%, transparent)",
      border: `2px solid ${data.color}`,
      borderRadius: 6,
      boxShadow: selected
        ? `0 0 0 2px var(--bs-emphasis-color), 0 4px 14px rgba(0,0,0,0.75)`
        : "0 2px 6px rgba(0,0,0,0.55)",
      padding: "5px 8px",
      fontSize: 11,
      color: "var(--bs-body-color)",
      cursor: "pointer",
    }}
  >
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

const SystemDot = ({ data }: { data: SystemNodeData }) => {
  const size = data.radius * 2;
  return (
    // No content-visibility here: it implies paint containment, which clips
    // the label below at the edge of this tiny box - exactly the bug that
    // made non-hub system names disappear.
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        title={data.system.name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: data.color,
          border: "1px solid var(--bs-border-color)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: size + 1,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 9,
          lineHeight: 1.2,
          color: "var(--bs-body-color)",
          textShadow:
            "0 0 2px var(--bs-body-bg), 0 0 3px var(--bs-body-bg), 0 0 4px var(--bs-body-bg)",
          pointerEvents: "none",
        }}
      >
        {data.system.name}
      </div>
    </div>
  );
};

const SystemNodeImpl = ({ data, selected }: NodeProps & { data: SystemNodeData }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Bottom} style={HANDLE_STYLE} />
      {data.system.is_hub ? (
        <SystemCard data={data} selected={selected} />
      ) : (
        <SystemDot data={data} />
      )}
    </>
  );
};

export const SystemNode = memo(SystemNodeImpl);
