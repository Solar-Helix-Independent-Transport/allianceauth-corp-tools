// The backend's OpenAPI schema for the dens dashboard endpoint is
// under-specified (loose `unknown[]`), so this shape is derived from how
// Dens.tsx actually consumes it.
export interface Den {
  name: string;
  location: {
    name: string;
    region: { name: string };
    constellation: { name: string };
  };
  character: {
    character_id: number;
    character_name: string;
    corporation_id: number;
    corporation_name: string;
  };
}
