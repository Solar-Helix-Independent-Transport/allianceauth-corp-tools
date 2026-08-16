import type { BaseMapRegion, BaseMapSystem, MapCoordMode, MapDot } from "./types";

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

export type FitBoundsRect = { x: number; y: number; width: number; height: number };

// Bounding box (in flow-space, i.e. the same coordinate space positions
// already live in) around every given dot and node hint - used to fitBounds
// the view without waiting on xyflow's own node measurement, which doesn't
// resolve reliably at this map's scale (see the comment on the fit effect in
// SpaceMapCanvas). Dots carry an exact radius; real nodes only have a
// pre-measurement size hint, which is close enough for framing purposes.
export const computeFitBounds = (
  dots: { x: number; y: number; radius: number }[],
  nodeHints: { x: number; y: number; halfWidth: number; halfHeight: number }[],
): FitBoundsRect | null => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const d of dots) {
    minX = Math.min(minX, d.x - d.radius);
    minY = Math.min(minY, d.y - d.radius);
    maxX = Math.max(maxX, d.x + d.radius);
    maxY = Math.max(maxY, d.y + d.radius);
  }
  for (const n of nodeHints) {
    minX = Math.min(minX, n.x - n.halfWidth);
    minY = Math.min(minY, n.y - n.halfHeight);
    maxX = Math.max(maxX, n.x + n.halfWidth);
    maxY = Math.max(maxY, n.y + n.halfHeight);
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;
  return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
};

// Builds the plain circle+label MapDot every space-map feature's bulk system
// set boils down to, once the caller has already worked out each system's
// radius/color/border for its own purposes (security color, activity value,
// hub-transport highlight, ...).
export const toMapDot = (
  system: BaseMapSystem,
  coordMode: MapCoordMode,
  { radius, color, bordered }: { radius: number; color: string; bordered?: boolean },
): MapDot => {
  const pos = resolveSystemPosition(system, coordMode);
  return { id: String(system.id), x: pos.x, y: pos.y, radius, color, name: system.name, bordered };
};

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
