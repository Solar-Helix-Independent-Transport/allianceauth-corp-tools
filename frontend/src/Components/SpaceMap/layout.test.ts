import { describe, expect, it } from "vitest";
import {
  BOOTSTRAP_HEX,
  computeFitBounds,
  computeRegionCentroids,
  resolveSystemPosition,
  secColor,
  systemById,
  toMapDot,
} from "./layout";
import type { BaseMapRegion, BaseMapSystem } from "./types";

const makeSystem = (overrides: Partial<BaseMapSystem> & { id: number }): BaseMapSystem => ({
  name: `System ${overrides.id}`,
  region_id: null,
  constellation_id: null,
  x_2d: null,
  y_2d: null,
  x_real: null,
  y_real: null,
  security_status: null,
  security_class: null,
  external: false,
  ...overrides,
});

describe("resolveSystemPosition", () => {
  it("uses the 2d coordinates when coordMode is 2d", () => {
    const system = makeSystem({ id: 1, x_2d: 1, y_2d: 2, x_real: 100, y_real: 200 });
    expect(resolveSystemPosition(system, "2d")).toEqual({ x: 1, y: 2 });
  });

  it("uses the real coordinates when coordMode is real", () => {
    const system = makeSystem({ id: 1, x_2d: 1, y_2d: 2, x_real: 100, y_real: 200 });
    expect(resolveSystemPosition(system, "real")).toEqual({ x: 100, y: 200 });
  });

  it("falls back to the other coordinate set when the primary one is missing", () => {
    const system = makeSystem({ id: 1, x_2d: null, y_2d: null, x_real: 100, y_real: 200 });
    expect(resolveSystemPosition(system, "2d")).toEqual({ x: 100, y: 200 });
  });

  it("falls back to only x or y missing individually", () => {
    const system = makeSystem({ id: 1, x_2d: 5, y_2d: null, x_real: 100, y_real: 200 });
    expect(resolveSystemPosition(system, "2d")).toEqual({ x: 100, y: 200 });
  });

  it("defaults to 0,0 when neither coordinate set is available", () => {
    const system = makeSystem({ id: 1 });
    expect(resolveSystemPosition(system, "2d")).toEqual({ x: 0, y: 0 });
  });
});

describe("computeRegionCentroids", () => {
  const regions: BaseMapRegion[] = [
    { id: 10, name: "Region A" },
    { id: 20, name: "Region B" },
  ];

  it("averages the positions of every system belonging to a region", () => {
    const systems = [
      makeSystem({ id: 1, region_id: 10, x_2d: 0, y_2d: 0 }),
      makeSystem({ id: 2, region_id: 10, x_2d: 10, y_2d: 20 }),
    ];

    const centroids = computeRegionCentroids(regions, systems, "2d");

    expect(centroids).toEqual([{ id: 10, name: "Region A", x: 5, y: 10 }]);
  });

  it("omits regions with no systems", () => {
    const systems = [makeSystem({ id: 1, region_id: 10, x_2d: 0, y_2d: 0 })];

    const centroids = computeRegionCentroids(regions, systems, "2d");

    expect(centroids.map((c) => c.id)).toEqual([10]);
  });

  it("ignores systems with no region_id", () => {
    const systems = [
      makeSystem({ id: 1, region_id: null, x_2d: 0, y_2d: 0 }),
      makeSystem({ id: 2, region_id: 10, x_2d: 4, y_2d: 4 }),
    ];

    const centroids = computeRegionCentroids(regions, systems, "2d");

    expect(centroids).toEqual([{ id: 10, name: "Region A", x: 4, y: 4 }]);
  });
});

describe("toMapDot", () => {
  it("resolves position for the coord mode and carries through the given radius/color/name", () => {
    const system = makeSystem({ id: 1, name: "Jita", x_2d: 6, y_2d: 8 });

    const dot = toMapDot(system, "2d", { radius: 5, color: "red" });

    expect(dot).toEqual({
      id: "1",
      x: 6,
      y: 8,
      radius: 5,
      color: "red",
      name: "Jita",
      bordered: undefined,
    });
  });
});

describe("computeFitBounds", () => {
  it("returns null when there's nothing to fit", () => {
    expect(computeFitBounds([], [])).toBeNull();
  });

  it("bounds a single dot by its radius", () => {
    expect(computeFitBounds([{ x: 0, y: 0, radius: 5 }], [])).toEqual({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
  });

  it("spans multiple dots and node hints together", () => {
    const bounds = computeFitBounds(
      [{ x: -10, y: 0, radius: 2 }],
      [{ x: 10, y: 5, halfWidth: 3, halfHeight: 4 }],
    );

    expect(bounds).toEqual({ x: -12, y: -2, width: 25, height: 11 });
  });
});

describe("secColor", () => {
  it("returns secondary for null security status", () => {
    expect(secColor(null)).toBe(BOOTSTRAP_HEX.secondary);
  });

  it("returns success for high-sec systems (>= 0.45)", () => {
    expect(secColor(0.45)).toBe(BOOTSTRAP_HEX.success);
    expect(secColor(1.0)).toBe(BOOTSTRAP_HEX.success);
  });

  it("returns warning for low-sec systems (> 0.0, < 0.45)", () => {
    expect(secColor(0.1)).toBe(BOOTSTRAP_HEX.warning);
  });

  it("returns danger for null-sec systems (<= 0.0)", () => {
    expect(secColor(0.0)).toBe(BOOTSTRAP_HEX.danger);
    expect(secColor(-1.0)).toBe(BOOTSTRAP_HEX.danger);
  });
});

describe("systemById", () => {
  it("builds a lookup map keyed by system id", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const map = systemById(systems);

    expect(map.get(1)).toBe(systems[0]);
    expect(map.get(2)).toBe(systems[1]);
    expect(map.size).toBe(2);
  });
});
