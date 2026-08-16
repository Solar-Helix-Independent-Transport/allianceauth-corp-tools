import { describe, expect, it } from "vitest";
import type { BaseMapSystem } from "../SpaceMap/types";
import { buildActivityDots, MAX_RADIUS, MIN_VALUE_RADIUS, NO_VALUE_RADIUS } from "./layout";
import type { ActivityMapResponse } from "./types";

const makeSystem = (overrides: Partial<BaseMapSystem> & { id: number }): BaseMapSystem => ({
  name: `System ${overrides.id}`,
  region_id: 1,
  constellation_id: 1,
  x_2d: overrides.id * 10,
  y_2d: overrides.id * 10,
  x_real: overrides.id * 100,
  y_real: overrides.id * 100,
  security_status: 0.5,
  security_class: "B",
  external: false,
  ...overrides,
});

const makeResponse = (
  systems: BaseMapSystem[],
  values: ActivityMapResponse["values"],
): ActivityMapResponse => ({
  regions: [],
  systems,
  edges: [],
  values,
});

describe("buildActivityDots", () => {
  it("builds one dot per system with the resolved position for the given coord mode, unbordered", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, []);

    const dots = buildActivityDots(response, "2d");

    expect(dots).toHaveLength(2);
    const byId = new Map(dots.map((d) => [d.id, d]));
    expect(byId.get("1")).toMatchObject({ x: 10, y: 10, bordered: false });
    expect(byId.get("2")).toMatchObject({ x: 20, y: 20, bordered: false });
  });

  it("uses real coordinates when coordMode is real", () => {
    const systems = [makeSystem({ id: 1 })];
    const response = makeResponse(systems, []);

    const dots = buildActivityDots(response, "real");

    expect(dots[0]).toMatchObject({ x: 100, y: 100 });
  });

  it("falls back to NO_VALUE_RADIUS and NO_VALUE_COLOR for systems with no matching value", () => {
    const systems = [makeSystem({ id: 1 })];
    const response = makeResponse(systems, []);

    const [dot] = buildActivityDots(response, "2d");

    expect(dot.radius).toBe(NO_VALUE_RADIUS);
    expect(dot.color).not.toContain("info");
  });

  it("falls back to NO_VALUE_RADIUS for a system whose value is zero or negative", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, [
      { system_id: 1, value: 0, count: 0, quantity: 0 },
      { system_id: 2, value: -5, count: 0, quantity: 0 },
    ]);

    const dots = buildActivityDots(response, "2d");

    expect(dots.every((d) => d.radius === NO_VALUE_RADIUS)).toBe(true);
  });

  it("scales the highest-value system to MAX_RADIUS and uses the value color", () => {
    const systems = [makeSystem({ id: 1 })];
    const response = makeResponse(systems, [{ system_id: 1, value: 100, count: 3, quantity: 7 }]);

    const [dot] = buildActivityDots(response, "2d");

    expect(dot.radius).toBe(MAX_RADIUS);
    expect(dot.color).toContain("info");
  });

  it("scales a lesser value between MIN_VALUE_RADIUS and MAX_RADIUS via sqrt scaling relative to the max", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, [
      { system_id: 1, value: 100, count: 0, quantity: 0 },
      { system_id: 2, value: 25, count: 0, quantity: 0 },
    ]);

    const dots = buildActivityDots(response, "2d");
    const byId = new Map(dots.map((d) => [d.id, d]));

    // fraction = sqrt(25/100) = 0.5
    const expectedRadius = MIN_VALUE_RADIUS + 0.5 * (MAX_RADIUS - MIN_VALUE_RADIUS);
    expect(byId.get("2")?.radius).toBe(expectedRadius);
  });

  it("orders dots biggest-radius-first, so smaller ones paint on top", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, [
      { system_id: 1, value: 25, count: 0, quantity: 0 },
      { system_id: 2, value: 100, count: 0, quantity: 0 },
    ]);

    const dots = buildActivityDots(response, "2d");

    expect(dots[0].id).toBe("2");
    expect(dots[0].radius).toBeGreaterThan(dots[1].radius);
  });

  it("carries the system name through onto the dot", () => {
    const systems = [makeSystem({ id: 42, name: "Jita" })];
    const response = makeResponse(systems, []);

    const [dot] = buildActivityDots(response, "2d");

    expect(dot.name).toBe("Jita");
  });
});
