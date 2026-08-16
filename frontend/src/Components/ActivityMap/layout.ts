import { BOOTSTRAP_HEX, toMapDot } from "../SpaceMap/layout";
import type { MapCoordMode, MapDot } from "../SpaceMap/types";
import type { ActivityMapResponse } from "./types";

// Systems with no data still need to be clickable/visible against the full
// map backdrop, just unobtrusively so - a small fixed dot rather than a
// zero-size node. (10x the original sizing.)
export const NO_VALUE_RADIUS = 5;
export const MIN_VALUE_RADIUS = 15;
export const MAX_RADIUS = 180;

const NO_VALUE_COLOR = BOOTSTRAP_HEX.secondary;

// Heat-scales a system's glow from var(--bs-warning) at the low end to
// var(--bs-danger) for the system with the most - a color-mix() of the two
// theme vars rather than manual RGB interpolation, so it still resolves
// through the browser's CSS engine (see dotCanvas's resolveCanvasColor) and
// stays theme-aware. `fraction` is the same 0..1 value radiusForFraction
// scales the circle size from, so a bigger glow reads proportionally hotter
// too.
const heatColorForFraction = (fraction: number): string => {
  const pct = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  return `color-mix(in srgb, var(--bs-danger) ${pct}%, var(--bs-warning))`;
};

// Radius (in world units) of the bigger, value-labeled marker a value dot's
// core swaps to once zoomed in far enough - see dotCanvas's
// EXPANDED_CORE_ZOOM_THRESHOLD. Fixed rather than scaled by value: the exact
// number is now spelled out in valueLabel, so size no longer needs to carry
// that signal, and a fixed size keeps the digits it must fit ("999m") a
// constant, tunable proportion of the circle.
const EXPANDED_CORE_RADIUS = 22;

// Abbreviates a raw value to at most 3 significant digits plus a magnitude
// suffix (k/m/b/t) for display inside the expanded core marker - e.g.
// 456_000 -> "456k", 478_000_000_000 -> "478b". Rounding can carry into the
// next unit up (999_600_000 rounds to 1000m, not a valid 4-digit display),
// so re-checks against the next-larger unit rather than clamping.
const VALUE_UNITS: [threshold: number, suffix: string][] = [
  [1_000_000_000_000, "t"],
  [1_000_000_000, "b"],
  [1_000_000, "m"],
  [1_000, "k"],
];

export const formatShortValue = (value: number): string => {
  const sign = value < 0 ? "-" : "";
  const abs = Math.round(Math.abs(value));

  for (let i = 0; i < VALUE_UNITS.length; i++) {
    const [threshold] = VALUE_UNITS[i];
    if (abs < threshold) continue;

    let unitIndex = i;
    let scaled = Math.round(abs / threshold);
    if (scaled >= 1000 && unitIndex > 0) {
      unitIndex -= 1;
      scaled = Math.round(abs / VALUE_UNITS[unitIndex][0]);
    }
    return `${sign}${scaled}${VALUE_UNITS[unitIndex][1]}`;
  }

  return `${sign}${abs}`;
};

// Radius scales relative to the *largest value in this particular
// response*, not a fixed absolute threshold - different data sources live
// on wildly different scales (asset counts in the tens/hundreds vs mining
// volume in the hundreds of thousands of m³), so a fixed cutoff tuned for
// one source would make every system on another either invisible or
// instantly pegged at the max radius. Sqrt rather than linear so a system
// with 100x another's value isn't literally 100x the circle area - it still
// reads as "a lot more" without dwarfing the rest of the map.
const radiusForFraction = (fraction: number): number => {
  if (fraction <= 0) return NO_VALUE_RADIUS;
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
    const hasValue = value > 0 && maxValue > 0;
    const fraction = hasValue ? Math.sqrt(value / maxValue) : 0;
    const radius = radiusForFraction(fraction);
    const heatColor = heatColorForFraction(fraction);
    // Translucent for the fill - nearby glows blend additively (see
    // dotCanvas's "lighter" pass) into a denser, brighter patch, giving the
    // overlay a heatmap-like feel instead of a flat on/off color. Plain grey
    // for the "no data here" majority of the map, so the two read as
    // clearly distinct from either end of the heat scale.
    const color = hasValue ? `color-mix(in srgb, ${heatColor} 65%, transparent)` : NO_VALUE_COLOR;
    const dot = toMapDot(s, coordMode, { radius, color, bordered: false });
    return {
      ...dot,
      // The value-driven radius is an intensity glow, not the system's
      // actual footprint - anchor the label (and a small always-visible
      // marker) to a fixed size instead, so both stay put at the system's
      // real position as the glow grows/shrinks with the data.
      gradient: hasValue,
      coreRadius: NO_VALUE_RADIUS,
      coreColor: NO_VALUE_COLOR,
      // Zoomed in close, this swaps in for the small neutral marker above -
      // see dotCanvas's EXPANDED_CORE_ZOOM_THRESHOLD.
      expandedCoreRadius: hasValue ? EXPANDED_CORE_RADIUS : undefined,
      expandedCoreColor: hasValue ? heatColor : undefined,
      valueLabel: hasValue ? formatShortValue(value) : undefined,
    };
  });

  // Biggest first. Glows themselves paint additively now (see dotCanvas),
  // so this no longer affects their stacking, but findDotAt still walks
  // dots in this order and prefers the nearest match, so smaller (easier to
  // miss) dots sorted toward the end still lose ties to a bigger one
  // centered on the same point.
  return dots.sort((a, b) => b.radius - a.radius);
};
