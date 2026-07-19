export type Corporation = {
  corporation_id: number;
  corporation_name: string;
};

export type EveName = {
  id: number;
  name: string;
};

export type Reagent = {
  name: string;
  type_id: number | null;
  amount: number;
  burning_per_hour: number;
};

export type Upgrade = {
  name: string;
  type_id: number | null;
  power_state: string;
};

export type TransportSystem = {
  system_id: number;
  system_name: string;
  amount?: number | null;
};

export type WorkforceTransport = {
  mode: "import" | "export" | "transit" | null;
  config_sources: TransportSystem[];
  state_sources: TransportSystem[];
  config_destination: TransportSystem | null;
  state_destination: TransportSystem | null;
} | null;

export type SovHub = {
  hub_id: number;
  owner: Corporation;
  location: EveName;
  constellation: EveName;
  region: EveName;
  power_allocated: number | null;
  power_available: number | null;
  workforce_allocated: number | null;
  workforce_available: number | null;
  reagent_last_updated: string | null;
  reagents: Reagent[];
  upgrades: Upgrade[];
  workforce_transport: WorkforceTransport;
};

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
