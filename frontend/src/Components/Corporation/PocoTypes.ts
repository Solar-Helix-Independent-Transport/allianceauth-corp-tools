// The backend's OpenAPI schema for the pocos dashboard endpoint is
// under-specified (loose `unknown[]`), so this shape is derived from how
// Pocos.tsx actually consumes it.
export interface Poco {
  location: {
    name: string;
    region: string;
    constellation: string;
  };
  owner: {
    corporation_id: number;
    corporation_name: string;
  };
  allow_access_with_standings: boolean;
  allow_alliance_access: boolean;
  alliance_tax_rate: number;
  corporation_tax_rate: number;
  terrible_standing_tax_rate: number;
  bad_standing_tax_rate: number;
  neutral_standing_tax_rate: number;
  good_standing_tax_rate: number;
  excellent_standing_tax_rate: number;
  reinforce_exit_start: number;
  reinforce_exit_end: number;
}
