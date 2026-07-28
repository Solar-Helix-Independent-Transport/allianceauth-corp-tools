// The backend's OpenAPI schema for these corp starbase endpoints is
// under-specified (untyped `unknown[]`), so these shapes are derived from
// how the response is actually consumed across StarbaseModal and its
// child tables/pages.
export interface StarbaseFuelItem {
  id: number;
  name: string;
  qty: number;
}

export interface StarbaseSpaceItem {
  type: { id: number; name: string };
  distance: number;
}

export interface StarbaseFit {
  fuel: StarbaseFuelItem[];
  space: StarbaseSpaceItem[];
}

export interface Starbase {
  starbase_id: number;
  name: string;
  state: string;
  type: { id: number };
  region: { name: string };
  constellation: { name: string };
  system: { name: string };
  moon: { name: string };
  owner: { corporation_id: number; corporation_name: string };
  onlined_since?: string | null;
  reinforced_until?: string | null;
  unanchor_at?: string | null;
  anchor?: string;
  online?: string;
  offline?: string;
  unanchor?: string;
  fuel_bay_take?: string;
  fuel_bay_view?: string;
}
