import {
  getCharacterActivityMapAssets,
  getCharacterActivityMapAssetsCapitals,
  getCharacterActivityMapAssetsShips,
  getCharacterActivityMapMining,
  getCharacterActivityMapRatting,
} from "../../../api/character";
import type { ActivityMapDataSource } from "../../ActivityMap/types";

// One entry per thing the map can show for a character. Adding a new data
// source later is just another entry here plus its own backend endpoint -
// the map itself only ever consumes the shared
// {regions, systems, edges, values} shape.
export const CHARACTER_ACTIVITY_MAP_DATA_SOURCES: ActivityMapDataSource[] = [
  {
    value: "assets",
    label: "Assets (Everything)",
    load: getCharacterActivityMapAssets,
    countLabel: "Assets",
    quantityLabel: "Quantity",
  },
  {
    value: "assets_ships",
    label: "Assets (Ships)",
    load: getCharacterActivityMapAssetsShips,
    countLabel: "Ships",
    quantityLabel: "Quantity",
  },
  {
    value: "assets_capitals",
    label: "Assets (Capital Ships)",
    load: getCharacterActivityMapAssetsCapitals,
    countLabel: "Capital Ships",
    quantityLabel: "Quantity",
  },
  {
    value: "mining",
    label: "Mining",
    load: getCharacterActivityMapMining,
    valueLabel: "Volume (m³)",
    countLabel: "Mining Entries",
    quantityLabel: "Units Mined",
  },
  {
    value: "ratting",
    label: "Ratting",
    load: getCharacterActivityMapRatting,
    valueLabel: "ISK Earned",
    countLabel: "Bounty Payouts",
  },
];
