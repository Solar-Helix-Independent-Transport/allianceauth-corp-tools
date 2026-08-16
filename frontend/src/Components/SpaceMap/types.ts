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
};
