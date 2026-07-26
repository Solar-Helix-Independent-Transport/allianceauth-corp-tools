import type { Node } from "@xyflow/react";
import type { BaseMapRegion, BaseMapSystem, MapCoordMode } from "./types";

// A system occasionally lacks one coordinate set (e.g. no position2D on
// record) - fall back to whichever set it does have rather than dropping it
// from the layout entirely.
export const resolveSystemPosition = (
  system: BaseMapSystem,
  coordMode: MapCoordMode,
): { x: number; y: number } => {
  const primary = coordMode === "2d" ? [system.x_2d, system.y_2d] : [system.x_real, system.y_real];
  const fallback = coordMode === "2d" ? [system.x_real, system.y_real] : [system.x_2d, system.y_2d];
  const [x, y] = primary[0] != null && primary[1] != null ? primary : fallback;
  return { x: x ?? 0, y: y ?? 0 };
};

export type RegionCentroid = { id: number; name: string; x: number; y: number };

// The middle of a region for label placement: the average position of every
// system that belongs to it, not its bounding-box center, so a region with
// systems clustered off to one side gets a label that sits with them rather
// than in the middle of empty space.
export const computeRegionCentroids = (
  regions: BaseMapRegion[],
  systems: BaseMapSystem[],
  coordMode: MapCoordMode,
): RegionCentroid[] => {
  const sums = new Map<number, { x: number; y: number; count: number }>();
  systems.forEach((s) => {
    if (s.region_id == null) return;
    const pos = resolveSystemPosition(s, coordMode);
    const entry = sums.get(s.region_id) ?? { x: 0, y: 0, count: 0 };
    entry.x += pos.x;
    entry.y += pos.y;
    entry.count += 1;
    sums.set(s.region_id, entry);
  });
  return regions
    .map((r) => {
      const entry = sums.get(r.id);
      if (!entry || entry.count === 0) return null;
      return { id: r.id, name: r.name, x: entry.x / entry.count, y: entry.y / entry.count };
    })
    .filter((r): r is RegionCentroid => r !== null);
};

export type RegionLabelNodeData = { regionLabelName: string };

// Real (but invisible - see RegionLabelNode) ReactFlow nodes purely so the
// MiniMap's nodeComponent callback has something to hook into: the MiniMap
// has no children/overlay slot of its own, it only ever renders one
// component per flow node, so smuggling the region labels in as zero-size
// nodes is the only way to get them onto the minimap at all.
export const buildRegionLabelNodes = (
  regions: BaseMapRegion[],
  systems: BaseMapSystem[],
  coordMode: MapCoordMode,
): Node<RegionLabelNodeData>[] =>
  computeRegionCentroids(regions, systems, coordMode).map((c) => ({
    id: `region-label-${c.id}`,
    type: "regionLabel",
    position: { x: c.x, y: c.y },
    width: 1,
    height: 1,
    draggable: false,
    selectable: false,
    connectable: false,
    focusable: false,
    style: { pointerEvents: "none" as const },
    data: { regionLabelName: c.name },
  }));

// Values, not just names: these feed straight into inline `style`/SVG
// `fill`/`stroke` props, so using the CSS variables (rather than fixed hex)
// means every map colour follows whatever Bootstrap theme is active (this
// app toggles `data-bs-theme` on <html>) instead of being frozen to one look.
export const BOOTSTRAP_HEX: Record<string, string> = {
  success: "var(--bs-success)",
  warning: "var(--bs-warning)",
  danger: "var(--bs-danger)",
  info: "var(--bs-info)",
  primary: "var(--bs-primary)",
  secondary: "var(--bs-secondary)",
};

export const secColor = (security_status: number | null): string => {
  if (security_status == null) return BOOTSTRAP_HEX.secondary;
  if (security_status >= 0.45) return BOOTSTRAP_HEX.success;
  if (security_status > 0.0) return BOOTSTRAP_HEX.warning;
  return BOOTSTRAP_HEX.danger;
};

export const systemById = <TSystem extends BaseMapSystem>(
  systems: TSystem[],
): Map<number, TSystem> => {
  const m = new Map<number, TSystem>();
  systems.forEach((s) => m.set(s.id, s));
  return m;
};
