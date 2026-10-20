import type { components } from "../../../api/CtApi";
import type { BaseMapEdge, BaseMapRegion, MapCoordMode } from "../../SpaceMap/types";
import { AnarchyDenAlert, Upgrade, WorkforceTransport } from "../sovereigntyShared";

export type { AnarchyDenAlert };

export type SovMapSystem = components["schemas"]["SovMapSystem"];

export type SovMapCoordMode = MapCoordMode;

export type SovMapEdge = BaseMapEdge;

export type SovMapRegion = BaseMapRegion;

export type SovMapResponse = components["schemas"]["SovMap"];

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
