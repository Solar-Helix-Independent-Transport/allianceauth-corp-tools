import type { components } from "../../api/CtApi";

export type StarbaseFit = components["schemas"]["StarbaseFit"];
export type StarbaseFuelItem = StarbaseFit["fuel"][number];
export type StarbaseSpaceItem = components["schemas"]["StarbaseSpaceItem"];
export type Starbase = components["schemas"]["Starbase"];
