import { MarkerType, type Edge, type Node } from "@xyflow/react";
import { BOOTSTRAP_HEX, resolveSystemPosition, secColor } from "../../SpaceMap/layout";
import { SovHub, Upgrade, modeBg, transportMismatch, upgradeStateBg } from "../sovereigntyShared";
import { SovMapCoordMode, SovMapMode, SovMapResponse, SystemNodeData } from "./types";

export { BOOTSTRAP_HEX, resolveSystemPosition, secColor };

const SEVERITY_ORDER = ["danger", "warning", "info", "secondary", "success"];

const worstUpgradeColorName = (upgrades: Upgrade[]): string => {
  if (!upgrades || upgrades.length === 0) return "secondary";
  let worst = "success";
  let worstIdx = SEVERITY_ORDER.indexOf("success");
  for (const u of upgrades) {
    const c = upgradeStateBg(u.power_state);
    const idx = SEVERITY_ORDER.indexOf(c);
    if (idx !== -1 && idx < worstIdx) {
      worstIdx = idx;
      worst = c;
    }
  }
  return worst;
};

export const filterUpgrades = (upgrades: Upgrade[], search: string): Upgrade[] => {
  const term = search.trim().toLowerCase();
  if (!term) return upgrades;
  return upgrades.filter((u) => u.name.toLowerCase().includes(term));
};

export const buildBaseNodes = (
  data: SovMapResponse,
  coordMode: SovMapCoordMode,
): Node<SystemNodeData>[] => {
  return data.systems.map((s) => {
    const radius = s.is_hub ? 10 : 4;
    return {
      id: String(s.id),
      type: "system",
      position: resolveSystemPosition(s, coordMode),
      draggable: false,
      connectable: false,
      selectable: true,
      // `initialWidth`/`initialHeight` (not `width`/`height` - those force a
      // fixed inline CSS size onto the real card/dot forever) only ever
      // serve as a size hint before the node's first real measurement.
      // We never wire up onNodesChange, so that real measured size never
      // makes it back onto our own node objects - which means the MiniMap
      // (fed directly from these objects) would otherwise treat every
      // system as dimensionless and never render it at all. This keeps
      // MiniMap sizing in sync with `radius` without touching on-canvas
      // rendering. See decorateNodesForMode for the mode-based update.
      initialWidth: radius * 2,
      initialHeight: radius * 2,
      data: {
        system: s,
        color: secColor(s.security_status),
        radius,
        mode: "upgrades" as SovMapMode,
      },
    };
  });
};

const involvedTransportSystemIds = (hubs: SovHub[]): Set<number> => {
  const ids = new Set<number>();
  for (const hub of hubs) {
    const wt = hub.workforce_transport;
    if (!wt) continue;
    wt.config_sources.forEach((s) => ids.add(s.system_id));
    wt.state_sources.forEach((s) => ids.add(s.system_id));
    if (wt.config_destination) ids.add(wt.config_destination.system_id);
    if (wt.state_destination) ids.add(wt.state_destination.system_id);
  }
  return ids;
};

export const decorateNodesForMode = (
  baseNodes: Node<SystemNodeData>[],
  hubsById: Map<number, SovHub>,
  mode: SovMapMode,
  upgradeSearch = "",
): Node<SystemNodeData>[] => {
  const involved = mode === "flow" ? involvedTransportSystemIds([...hubsById.values()]) : null;

  return baseNodes.map((n) => {
    const system = n.data.system;
    let color = secColor(system.security_status);
    let radius = system.is_hub ? 10 : 4;
    let hubUpgrades: SystemNodeData["hubUpgrades"];
    let transport: SystemNodeData["transport"];
    let ownerName: string | undefined;
    let hasUpgradeSearch = false;
    let workforceAllocated: number | null | undefined;
    let workforceAvailable: number | null | undefined;

    if (system.is_hub) {
      const hub = hubsById.get(system.id);
      if (hub) {
        transport = hub.workforce_transport;
        ownerName = hub.owner?.corporation_name;
        workforceAllocated = hub.workforce_allocated;
        workforceAvailable = hub.workforce_available;
        if (mode === "upgrades") {
          hasUpgradeSearch = upgradeSearch.trim().length > 0;
          // A system with no matching upgrades gets the same muted color as
          // a system with genuinely zero upgrades, but the card itself
          // distinguishes the two cases (see hasUpgradeSearch): a real "no
          // upgrades" system says so, a filtered-out-by-search one just
          // shows its name with no placeholder text.
          hubUpgrades = filterUpgrades(hub.upgrades, upgradeSearch);
          color = BOOTSTRAP_HEX[worstUpgradeColorName(hubUpgrades)];
        } else {
          hubUpgrades = hub.upgrades;
          const wtMode = hub.workforce_transport?.mode;
          color = BOOTSTRAP_HEX[wtMode ? modeBg[wtMode] : "secondary"];
        }
      }
    } else if (involved?.has(system.id)) {
      color = BOOTSTRAP_HEX.info;
      radius = 6;
    }

    return {
      ...n,
      initialWidth: radius * 2,
      initialHeight: radius * 2,
      data: {
        ...n.data,
        color,
        radius,
        mode,
        hubUpgrades,
        transport,
        ownerName,
        hasUpgradeSearch,
        workforceAllocated,
        workforceAvailable,
      },
    };
  });
};

// One color for every flow edge: direction is already unambiguous from the
// arrowhead, so a single consistent color reads as "this is workforce flow"
// at a glance, rather than the two-tone import/export scheme where a link
// declared from the exporting hub's side and the same link declared from the
// importing hub's side ended up drawn twice, in two different colors,
// overlapping on the exact same path.
const FLOW_COLOR_NAME = "info";

const flowEdge = (id: string, source: number, target: number, style: "solid" | "dashed"): Edge => {
  // Mixing toward white (rather than using the theme color straight) keeps
  // these edges reading brighter than their source color in both light and
  // dark themes, instead of a fixed lightened hex that would only look right
  // against one background.
  const color = `color-mix(in srgb, ${BOOTSTRAP_HEX[FLOW_COLOR_NAME]} 75%, white)`;
  return {
    id,
    type: "floating",
    source: String(source),
    target: String(target),
    animated: style === "solid",
    style: {
      stroke: color,
      strokeWidth: 2.5,
      strokeDasharray: style === "dashed" ? "6 4" : undefined,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 22, height: 22 },
  };
};

export const buildFlowEdges = (hubs: SovHub[]): Edge[] => {
  const edges: Edge[] = [];
  // A transport link between two tracked hubs gets declared from both ends
  // (the exporter's state_destination and the importer's state_sources are
  // the same real link) - skip re-adding an edge that already covers the
  // same source->target pair instead of drawing it twice.
  const seenSolid = new Set<string>();
  const seenDashed = new Set<string>();

  for (const hub of hubs) {
    const wt = hub.workforce_transport;
    const hubSystemId = hub.location?.id;
    if (!wt || !wt.mode || hubSystemId == null) continue;

    const mismatch = transportMismatch(wt);

    if (wt.mode === "import") {
      wt.state_sources.forEach((s, i) => {
        const key = `${s.system_id}->${hubSystemId}`;
        if (seenSolid.has(key)) return;
        seenSolid.add(key);
        edges.push(flowEdge(`${hub.hub_id}-state-src-${i}`, s.system_id, hubSystemId, "solid"));
      });
      if (mismatch) {
        wt.config_sources.forEach((s, i) => {
          const key = `${s.system_id}->${hubSystemId}`;
          if (seenDashed.has(key)) return;
          seenDashed.add(key);
          edges.push(flowEdge(`${hub.hub_id}-cfg-src-${i}`, s.system_id, hubSystemId, "dashed"));
        });
      }
    } else if (wt.mode === "export") {
      if (wt.state_destination) {
        const key = `${hubSystemId}->${wt.state_destination.system_id}`;
        if (!seenSolid.has(key)) {
          seenSolid.add(key);
          edges.push(
            flowEdge(
              `${hub.hub_id}-state-dst`,
              hubSystemId,
              wt.state_destination.system_id,
              "solid",
            ),
          );
        }
      }
      if (mismatch && wt.config_destination) {
        const key = `${hubSystemId}->${wt.config_destination.system_id}`;
        if (!seenDashed.has(key)) {
          seenDashed.add(key);
          edges.push(
            flowEdge(
              `${hub.hub_id}-cfg-dst`,
              hubSystemId,
              wt.config_destination.system_id,
              "dashed",
            ),
          );
        }
      }
    }
  }

  return edges;
};

export const buildHubsById = (hubs: SovHub[]): Map<number, SovHub> => {
  const m = new Map<number, SovHub>();
  hubs.forEach((h) => {
    if (h.location?.id != null) m.set(h.location.id, h);
  });
  return m;
};
