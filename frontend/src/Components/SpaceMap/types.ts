export type MapCoordMode = "2d" | "real";

// The generic subset of a solar system every space-map feature needs to
// position and label it on the map. Feature-specific data (sov hub detail,
// activity metrics, ...) extends this rather than folding into it.
export type BaseMapSystem = {
  id: number;
  name: string;
  region_id: number | null;
  constellation_id: number | null;
  x_2d: number | null;
  y_2d: number | null;
  x_real: number | null;
  y_real: number | null;
  security_status: number | null;
  security_class: string | null;
  external: boolean;
};

export type BaseMapRegion = {
  id: number;
  name: string;
};

export type BaseMapEdge = {
  source: number;
  target: number;
};

// One system rendered as a plain circle+label, drawn straight to a <canvas>
// rather than as a real xyflow node - see SystemDotsLayer. Used for the bulk
// "many thousands of systems" case where per-system DOM nodes (and their
// ResizeObservers) are themselves the performance problem; richer per-system
// content (e.g. sov hub cards) stays on real xyflow nodes instead.
export type MapDot = {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  name: string;
  // Defaults to true, matching DotVisual's old default.
  bordered?: boolean;
  // Renders `radius` as an additively-blended glow (see dotCanvas's
  // "lighter" pass) rather than a normally-composited flat circle, plus
  // enables expandedCore* below - for dots whose radius itself encodes a
  // value (see the activity map), letting nearby glows blend into a denser,
  // brighter patch reads as an intensity heatmap instead of a pile of flat,
  // individually-outlined blobs.
  gradient?: boolean;
  // Fixed-size marker drawn at the dot's true position, on top of `radius`.
  // Only meaningful when it's smaller than `radius` - lets a label (and the
  // "where is this system, exactly" marker) stay anchored to the system's
  // actual position instead of sliding out to the edge of a radius that
  // grows to encode a value. Undefined preserves the old behaviour of
  // anchoring directly to `radius`.
  coreRadius?: number;
  coreColor?: string;
  // Past a high enough zoom (see dotCanvas's EXPANDED_CORE_ZOOM_THRESHOLD),
  // the small neutral coreRadius/coreColor marker swaps for this bigger,
  // heat-colored one with `valueLabel` drawn inside it - by then the glow
  // itself has shrunk away (see the gradient zoom falloff), so this becomes
  // the readable "exactly how much" marker in its place. All three are
  // required together; leaving them unset keeps the small marker at every
  // zoom, same as before.
  expandedCoreRadius?: number;
  expandedCoreColor?: string;
  valueLabel?: string;
};
