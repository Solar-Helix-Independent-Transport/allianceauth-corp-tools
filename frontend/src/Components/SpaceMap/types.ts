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
