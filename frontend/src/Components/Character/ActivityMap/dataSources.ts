import {
  getCharacterActivityMapAssets,
  getCharacterActivityMapAssetsCapitals,
  getCharacterActivityMapAssetsShips,
  getCharacterActivityMapClonesHome,
  getCharacterActivityMapClonesJump,
  getCharacterActivityMapContracts,
  getCharacterActivityMapContractsLogistics,
  getCharacterActivityMapContractsSales,
  getCharacterActivityMapIndustry,
  getCharacterActivityMapLocation,
  getCharacterActivityMapMercenaryDens,
  getCharacterActivityMapMercenaryTacticalOperations,
  getCharacterActivityMapMining,
  getCharacterActivityMapOrders,
  getCharacterActivityMapPi,
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
    value: "contracts",
    label: "Contracts (Everything)",
    load: getCharacterActivityMapContracts,
    countLabel: "Contract Endpoints",
  },
  {
    value: "contracts_sales",
    label: "Contracts (Sales)",
    load: getCharacterActivityMapContractsSales,
    countLabel: "Contract Endpoints",
  },
  {
    value: "contracts_logistics",
    label: "Contracts (Logistics)",
    load: getCharacterActivityMapContractsLogistics,
    countLabel: "Contract Endpoints",
  },
  {
    value: "orders",
    label: "Market Orders",
    load: getCharacterActivityMapOrders,
    countLabel: "Active Orders",
  },
  {
    value: "industry",
    label: "Industry",
    load: getCharacterActivityMapIndustry,
    countLabel: "Industry Jobs",
  },
  {
    value: "location",
    label: "Current Location",
    load: getCharacterActivityMapLocation,
    countLabel: "Characters",
  },
  {
    value: "clones_home",
    label: "Home Clones",
    load: getCharacterActivityMapClonesHome,
    countLabel: "Home Clones",
  },
  {
    value: "clones_jump",
    label: "Jump Clones",
    load: getCharacterActivityMapClonesJump,
    countLabel: "Jump Clones",
  },
  {
    value: "mercenary_dens",
    label: "Mercenary Dens",
    load: getCharacterActivityMapMercenaryDens,
    countLabel: "Mercenary Dens",
  },
  {
    value: "mercenary_tactical_operations",
    label: "Mercenary Tactical Operations",
    load: getCharacterActivityMapMercenaryTacticalOperations,
    countLabel: "Tactical Operations",
  },
  {
    value: "pi",
    label: "Planetary Interaction",
    load: getCharacterActivityMapPi,
    valueLabel: "ISK Spent",
    countLabel: "PI Entries",
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
