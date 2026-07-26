import {
  loadCorporationActivityMapAssets,
  loadCorporationActivityMapAssetsCapitals,
  loadCorporationActivityMapAssetsShips,
  loadCorporationActivityMapMining,
  loadCorporationActivityMapRatting,
} from "../../../api/corporation";
import type { ActivityMapDataSource } from "../../ActivityMap/types";

// Same shape as the character-side registry (Components/Character/
// ActivityMap/dataSources.ts) - just pointed at the corp-scoped endpoints,
// which aggregate across every character/asset visible for the whole
// corporation rather than just the requesting user's own alts.
export const CORPORATION_ACTIVITY_MAP_DATA_SOURCES: ActivityMapDataSource[] = [
  {
    value: "assets",
    label: "Assets (Everything)",
    load: loadCorporationActivityMapAssets,
    countLabel: "Assets",
    quantityLabel: "Quantity",
  },
  {
    value: "assets_ships",
    label: "Assets (Ships)",
    load: loadCorporationActivityMapAssetsShips,
    countLabel: "Ships",
    quantityLabel: "Quantity",
  },
  {
    value: "assets_capitals",
    label: "Assets (Capital Ships)",
    load: loadCorporationActivityMapAssetsCapitals,
    countLabel: "Capital Ships",
    quantityLabel: "Quantity",
  },
  {
    value: "mining",
    label: "Mining",
    load: loadCorporationActivityMapMining,
    valueLabel: "Volume (m³)",
    countLabel: "Mining Entries",
    quantityLabel: "Units Mined",
  },
  {
    value: "ratting",
    label: "Ratting",
    load: loadCorporationActivityMapRatting,
    valueLabel: "ISK Earned",
    countLabel: "Bounty Payouts",
  },
];
