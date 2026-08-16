import type { BaseMapEdge, BaseMapRegion, BaseMapSystem } from "../SpaceMap/types";

export type ActivityMapSystem = BaseMapSystem;

// `value` is the generic metric the map scales circles by; `count`/
// `quantity` are the data-source-specific detail shown in the panel on
// click. A data source (assets, mining, ratting, ...) populates `value`
// differently without the map itself needing to know what it means.
export type ActivityMapValue = {
  system_id: number;
  value: number;
  count: number;
  quantity: number;
};

export type ActivityMapResponse = {
  regions: BaseMapRegion[];
  systems: ActivityMapSystem[];
  edges: BaseMapEdge[];
  values: ActivityMapValue[];
};

// One thing the map can show, and how to fetch/label it. `id` is whatever
// scope the map is fetching for (a character id, a corporation id, ...) -
// the map itself doesn't care which. Character and corporation pages each
// build their own array of these pointing at their own endpoints; the map
// rendering underneath is identical either way.
export type ActivityMapDataSource = {
  value: string;
  label: string;
  load: (id: number) => Promise<ActivityMapResponse>;
  // Row labels for the detail panel's secondary numbers (`count`/`quantity`
  // in the API response - their meaning is source-specific). Omit whichever
  // one doesn't apply (e.g. ratting has no separate "quantity" beyond ISK)
  // to skip that row entirely rather than show a meaningless duplicate.
  countLabel?: string;
  quantityLabel?: string;
  // Only set when the map's circle size (`value`) means something distinct
  // from `countLabel` (e.g. mining scales by volume, not entry count) - so
  // the panel shows it as its own row instead of duplicating countLabel.
  valueLabel?: string;
};

export const getActivityMapDataSource = (
  sources: ActivityMapDataSource[],
  value: string | null,
): ActivityMapDataSource => sources.find((s) => s.value === value) ?? sources[0];
