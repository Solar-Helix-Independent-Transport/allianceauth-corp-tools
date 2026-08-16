import type { BaseMapEdge, BaseMapRegion, BaseMapSystem, MapCoordMode } from "../../SpaceMap/types";
import { AnarchyDenAlert, SovHub, Upgrade, WorkforceTransport } from "../sovereigntyShared";

export type { AnarchyDenAlert };

export type SovMapSystem = BaseMapSystem & {
  is_hub: boolean;
  anarchy_alert: boolean;
  anarchy_dens: AnarchyDenAlert[];
};

export type SovMapCoordMode = MapCoordMode;

export type SovMapEdge = BaseMapEdge;

export type SovMapRegion = BaseMapRegion;

export type SovMapResponse = {
  regions: SovMapRegion[];
  systems: SovMapSystem[];
  edges: SovMapEdge[];
  jump_bridges: SovMapEdge[];
  hubs: SovHub[];
};

export type SovMapMode = "upgrades" | "flow";

export type SystemNodeData = {
  system: SovMapSystem;
  color: string;
  mode: SovMapMode;
  ownerName?: string;
  hubUpgrades?: Upgrade[];
  hasUpgradeSearch?: boolean;
  transport?: WorkforceTransport;
  workforceAllocated?: number | null;
  workforceAvailable?: number | null;
  [key: string]: unknown;
};
