import { SovHub, Upgrade, WorkforceTransport } from "../sovereigntyShared";

export type SovMapSystem = {
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
  is_hub: boolean;
  external: boolean;
};

export type SovMapCoordMode = "2d" | "real";

export type SovMapEdge = {
  source: number;
  target: number;
};

export type SovMapRegion = {
  id: number;
  name: string;
};

export type SovMapResponse = {
  regions: SovMapRegion[];
  systems: SovMapSystem[];
  edges: SovMapEdge[];
  hubs: SovHub[];
};

export type SovMapMode = "upgrades" | "flow";

export type SystemNodeData = {
  system: SovMapSystem;
  color: string;
  radius: number;
  mode: SovMapMode;
  ownerName?: string;
  hubUpgrades?: Upgrade[];
  hasUpgradeSearch?: boolean;
  transport?: WorkforceTransport;
  workforceAllocated?: number | null;
  workforceAvailable?: number | null;
  [key: string]: unknown;
};
