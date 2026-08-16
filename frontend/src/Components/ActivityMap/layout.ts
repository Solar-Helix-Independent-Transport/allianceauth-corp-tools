import { BOOTSTRAP_HEX, toMapDot } from "../SpaceMap/layout";
import type { MapCoordMode, MapDot } from "../SpaceMap/types";
import type { ActivityMapResponse } from "./types";

// Systems with no data still need to be clickable/visible against the full
// map backdrop, just unobtrusively so - a small fixed dot rather than a
// zero-size node. (10x the original sizing.)
export const NO_VALUE_RADIUS = 5;
export const MIN_VALUE_RADIUS = 15;
export const MAX_RADIUS = 200;

// Translucent accent color where there's data to show - dots overlapping
// near a busy system blend into a denser blob, giving the overlay a
// heatmap-like feel instead of a flat on/off color. Plain grey for the "no
// data here" majority of the map, so the two read as clearly distinct.
const VALUE_COLOR = "color-mix(in srgb, var(--bs-info) 50%, transparent)";
const NO_VALUE_COLOR = BOOTSTRAP_HEX.secondary;

// Radius scales relative to the *largest value in this particular
// response*, not a fixed absolute threshold - different data sources live
// on wildly different scales (asset counts in the tens/hundreds vs mining
// volume in the hundreds of thousands of m³), so a fixed cutoff tuned for
// one source would make every system on another either invisible or
// instantly pegged at the max radius. Sqrt rather than linear so a system
// with 100x another's value isn't literally 100x the circle area - it still
// reads as "a lot more" without dwarfing the rest of the map.
const radiusForValue = (value: number, maxValue: number): number => {
  if (value <= 0 || maxValue <= 0) return NO_VALUE_RADIUS;
  const fraction = Math.sqrt(value / maxValue);
  return MIN_VALUE_RADIUS + fraction * (MAX_RADIUS - MIN_VALUE_RADIUS);
};

export const buildActivityDots = (
  response: ActivityMapResponse,
  coordMode: MapCoordMode,
): MapDot[] => {
  const valuesBySystem = new Map(response.values.map((v) => [v.system_id, v]));
  const maxValue = response.values.reduce((max, v) => Math.max(max, v.value), 0);

  const dots = response.systems.map((s) => {
    const v = valuesBySystem.get(s.id);
    const value = v?.value ?? 0;
    const radius = radiusForValue(value, maxValue);
    const color = value > 0 ? VALUE_COLOR : NO_VALUE_COLOR;
    return toMapDot(s, coordMode, { radius, color, bordered: false });
  });

  // Biggest first, so the biggest dots (which would otherwise blanket
  // smaller ones sharing roughly the same spot) paint at the back and small
  // dots stay visible - and easier to click - on top.
  return dots.sort((a, b) => b.radius - a.radius);
};
