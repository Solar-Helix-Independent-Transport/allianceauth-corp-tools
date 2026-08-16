import { describe, expect, it } from "vitest";
import { findDotAt } from "./dotCanvas";
import type { MapDot } from "./types";

const makeDot = (overrides: Partial<MapDot> & { id: string }): MapDot => ({
  x: 0,
  y: 0,
  radius: 5,
  color: "red",
  name: overrides.id,
  ...overrides,
});

describe("findDotAt", () => {
  it("returns the dot whose radius contains the point", () => {
    const dots = [makeDot({ id: "a", x: 0, y: 0, radius: 5 })];
    expect(findDotAt(dots, 3, 0)?.id).toBe("a");
  });

  it("returns null when no dot's radius reaches the point", () => {
    const dots = [makeDot({ id: "a", x: 0, y: 0, radius: 5 })];
    expect(findDotAt(dots, 10, 0)).toBeNull();
  });

  it("honours extraHitRadius for hitting past a dot's own radius", () => {
    const dots = [makeDot({ id: "a", x: 0, y: 0, radius: 5 })];
    expect(findDotAt(dots, 8, 0)).toBeNull();
    expect(findDotAt(dots, 8, 0, 5)?.id).toBe("a");
  });

  it("picks the nearest dot when two overlap the point", () => {
    const dots = [
      makeDot({ id: "far", x: 0, y: 0, radius: 20 }),
      makeDot({ id: "near", x: 10, y: 0, radius: 20 }),
    ];
    expect(findDotAt(dots, 9, 0)?.id).toBe("near");
  });

  it("returns null for an empty dot list", () => {
    expect(findDotAt([], 0, 0)).toBeNull();
  });
});
