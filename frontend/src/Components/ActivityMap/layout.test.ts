import { describe, expect, it } from "vitest";
import type { BaseMapSystem } from "../SpaceMap/types";
import { buildActivityNodes } from "./layout";
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

describe("buildActivityNodes", () => {
  it("builds one dot node per system with the resolved position for the given coord mode", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, []);

    const nodes = buildActivityNodes(response, "2d");

    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toMatchObject({
      id: "1",
      type: "dot",
      position: { x: 10, y: 10 },
    });
    expect(nodes[1].position).toEqual({ x: 20, y: 20 });
  });

  it("uses real coordinates when coordMode is real", () => {
    const systems = [makeSystem({ id: 1 })];
    const response = makeResponse(systems, []);

    const nodes = buildActivityNodes(response, "real");

    expect(nodes[0].position).toEqual({ x: 100, y: 100 });
  });

  it("falls back to NO_VALUE_RADIUS and NO_VALUE_COLOR for systems with no matching value", () => {
    const systems = [makeSystem({ id: 1 })];
    const response = makeResponse(systems, []);

    const [node] = buildActivityNodes(response, "2d");

    expect(node.data.value).toBe(0);
    expect(node.data.count).toBe(0);
    expect(node.data.quantity).toBe(0);
    expect(node.data.radius).toBe(5);
    expect(node.initialWidth).toBe(10);
    expect(node.initialHeight).toBe(10);
    expect(node.data.color).not.toContain("info");
  });

  it("falls back to NO_VALUE_RADIUS for a system whose value is zero or negative", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, [
      { system_id: 1, value: 0, count: 0, quantity: 0 },
      { system_id: 2, value: -5, count: 0, quantity: 0 },
    ]);

    const nodes = buildActivityNodes(response, "2d");

    expect(nodes[0].data.radius).toBe(5);
    expect(nodes[1].data.radius).toBe(5);
  });

  it("scales the highest-value system to MAX_RADIUS and uses the value color", () => {
    const systems = [makeSystem({ id: 1 })];
    const response = makeResponse(systems, [{ system_id: 1, value: 100, count: 3, quantity: 7 }]);

    const [node] = buildActivityNodes(response, "2d");

    expect(node.data.radius).toBe(260);
    expect(node.data.value).toBe(100);
    expect(node.data.count).toBe(3);
    expect(node.data.quantity).toBe(7);
    expect(node.data.color).toContain("info");
  });

  it("scales a lesser value between MIN_VALUE_RADIUS and MAX_RADIUS via sqrt scaling relative to the max", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, [
      { system_id: 1, value: 100, count: 0, quantity: 0 },
      { system_id: 2, value: 25, count: 0, quantity: 0 },
    ]);

    const nodes = buildActivityNodes(response, "2d");

    // fraction = sqrt(25/100) = 0.5 -> 20 + 0.5 * (260 - 20) = 140
    expect(nodes[1].data.radius).toBe(140);
  });

  it("gives bigger dots a lower zIndex, so they paint behind smaller ones", () => {
    const systems = [makeSystem({ id: 1 }), makeSystem({ id: 2 })];
    const response = makeResponse(systems, [
      { system_id: 1, value: 100, count: 0, quantity: 0 },
      { system_id: 2, value: 25, count: 0, quantity: 0 },
    ]);

    const nodes = buildActivityNodes(response, "2d");

    expect(nodes[0].data.radius).toBeGreaterThan(nodes[1].data.radius);
    expect(nodes[0].zIndex).toBeLessThan(nodes[1].zIndex as number);
  });

  it("carries the system object through onto node data", () => {
    const systems = [makeSystem({ id: 42, name: "Jita" })];
    const response = makeResponse(systems, []);

    const [node] = buildActivityNodes(response, "2d");

    expect(node.data.system).toEqual(systems[0]);
  });
});
