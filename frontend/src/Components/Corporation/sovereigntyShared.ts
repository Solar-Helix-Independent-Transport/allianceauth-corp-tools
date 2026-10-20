import type { components } from "../../api/CtApi";

type Schemas = components["schemas"];

export type Reagent = Schemas["SovHubReagent"];
export type Upgrade = Schemas["SovHubUpgrade"];
export type WorkforceTransport = Schemas["WorkforceTransport"] | null;
export type AnarchyDenAlert = Schemas["AnarchyDen"];
export type SovHub = Schemas["SovHub"];

export const modeBg: Record<string, string> = {
  import: "info",
  export: "primary",
  transit: "secondary",
};

export const upgradeStateBg = (state: string) => {
  switch (state.toLowerCase()) {
    case "online":
      return "success";
    case "offline":
      return "warning";
    case "low":
      return "danger";
    case "pending":
      return "info";
    default:
      return "secondary";
  }
};

export const transportMismatch = (wt: WorkforceTransport): boolean => {
  if (!wt || !wt.mode) return false;
  if (wt.mode === "import") {
    const cfgIds = new Set(wt.config_sources.map((s) => s.system_id));
    const stateIds = new Set(wt.state_sources.map((s) => s.system_id));
    if (cfgIds.size !== stateIds.size) return true;
    for (const id of cfgIds) if (!stateIds.has(id)) return true;
    return false;
  }
  if (wt.mode === "export") {
    const cfgId = wt.config_destination?.system_id ?? null;
    const stateId = wt.state_destination?.system_id ?? null;
    return cfgId !== stateId;
  }
  return false;
};
