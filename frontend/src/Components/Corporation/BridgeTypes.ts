// The backend's OpenAPI schema for the gates dashboard endpoint is
// under-specified (loose `unknown[]`), so these shapes are derived from
// how BridgeLink/Bridges actually consume them.
export interface BridgeGate {
  known: boolean;
  active: boolean;
  system_name?: string;
  name?: string;
  ozone: number;
  expires: number;
}

export interface BridgePair {
  start: BridgeGate;
  end: BridgeGate;
}
