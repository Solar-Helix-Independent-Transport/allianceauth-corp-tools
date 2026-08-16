import { MarkerType, type Edge, type Node } from "@xyflow/react";
import { BOOTSTRAP_HEX, resolveSystemPosition, secColor, toMapDot } from "../../SpaceMap/layout";
import type { MapDot } from "../../SpaceMap/types";
import { SovHub, Upgrade, modeBg, transportMismatch, upgradeStateBg } from "../sovereigntyShared";
import { SovMapCoordMode, SovMapMode, SovMapResponse, SovMapSystem, SystemNodeData } from "./types";

export { BOOTSTRAP_HEX, resolveSystemPosition, secColor };

const SEVERITY_ORDER = ["danger", "warning", "info", "secondary", "success"];

const NON_HUB_RADIUS = 4;
// Non-hub systems involved in a hub's workforce transport chain (mode ===
// "flow") get called out slightly bigger, same as before this was split out
// of decorateNodesForMode.
const TRANSPORT_INVOLVED_RADIUS = 6;

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

// Only hub systems become real xyflow nodes now - they're the ones that
// need to be actual DOM elements (rich card content, and flow-mode edges,
// which route via each node's measured xyflow internals). The much larger
// set of non-hub systems is handled by buildSystemDots instead, drawn
// straight to canvas - see SystemDotsLayer.
export const buildHubNodes = (
  data: SovMapResponse,
  coordMode: SovMapCoordMode,
): Node<SystemNodeData>[] => {
  return data.systems
    .filter((s) => s.is_hub)
    .map((s) => ({
      id: String(s.id),
      type: "system",
      position: resolveSystemPosition(s, coordMode),
      draggable: false,
      connectable: false,
      selectable: true,
      initialWidth: 20,
      initialHeight: 20,
      data: {
        system: s,
        color: secColor(s.security_status),
        mode: "upgrades" as SovMapMode,
      },
    }));
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

export const decorateHubNodesForMode = (
  hubNodes: Node<SystemNodeData>[],
  hubsById: Map<number, SovHub>,
  mode: SovMapMode,
  upgradeSearch = "",
): Node<SystemNodeData>[] => {
  return hubNodes.map((n) => {
    const system = n.data.system;
    let color = secColor(system.security_status);
    let hubUpgrades: SystemNodeData["hubUpgrades"];
    let transport: SystemNodeData["transport"];
    let ownerName: string | undefined;
    let hasUpgradeSearch = false;
    let workforceAllocated: number | null | undefined;
    let workforceAvailable: number | null | undefined;

    const hub = hubsById.get(system.id);
    if (hub) {
      transport = hub.workforce_transport;
      ownerName = hub.owner?.corporation_name;
      workforceAllocated = hub.workforce_allocated;
      workforceAvailable = hub.workforce_available;
      if (mode === "upgrades") {
        hasUpgradeSearch = upgradeSearch.trim().length > 0;
        // A system with no matching upgrades gets the same muted color as a
        // system with genuinely zero upgrades, but the card itself
        // distinguishes the two cases (see hasUpgradeSearch): a real "no
        // upgrades" system says so, a filtered-out-by-search one just shows
        // its name with no placeholder text.
        hubUpgrades = filterUpgrades(hub.upgrades, upgradeSearch);
        color = BOOTSTRAP_HEX[worstUpgradeColorName(hubUpgrades)];
      } else {
        hubUpgrades = hub.upgrades;
        const wtMode = hub.workforce_transport?.mode;
        color = BOOTSTRAP_HEX[wtMode ? modeBg[wtMode] : "secondary"];
      }
    }

    return {
      ...n,
      data: {
        ...n.data,
        color,
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

// The bulk, non-hub system set, drawn as canvas dots rather than xyflow
// nodes. Still mode-dependent: in "flow" mode, a non-hub system that's part
// of some hub's workforce transport chain (a waypoint the goods actually
// move through) gets called out in the same accent color/larger radius it
// always has, so the transport picture reads at a glance without needing to
// click into it.
export const buildSystemDots = (
  systems: SovMapSystem[],
  hubsById: Map<number, SovHub>,
  mode: SovMapMode,
  coordMode: SovMapCoordMode,
): MapDot[] => {
  const involved = mode === "flow" ? involvedTransportSystemIds([...hubsById.values()]) : null;

  return systems
    .filter((s) => !s.is_hub)
    .map((s) => {
      const isInvolved = involved?.has(s.id) ?? false;
      return toMapDot(s, coordMode, {
        radius: isInvolved ? TRANSPORT_INVOLVED_RADIUS : NON_HUB_RADIUS,
        color: isInvolved ? BOOTSTRAP_HEX.info : secColor(s.security_status),
      });
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
