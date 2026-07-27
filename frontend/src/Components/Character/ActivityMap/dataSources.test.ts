import { describe, expect, it } from "vitest";
import { CHARACTER_ACTIVITY_MAP_DATA_SOURCES } from "./dataSources";

describe("CHARACTER_ACTIVITY_MAP_DATA_SOURCES", () => {
  it("has a unique value for every entry", () => {
    const values = CHARACTER_ACTIVITY_MAP_DATA_SOURCES.map((s) => s.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it("gives every entry a non-empty label and a load function", () => {
    for (const source of CHARACTER_ACTIVITY_MAP_DATA_SOURCES) {
      expect(source.label.length).toBeGreaterThan(0);
      expect(typeof source.load).toBe("function");
    }
  });

  it("only sets valueLabel for data sources whose value means something beyond the count", () => {
    const withValueLabel = CHARACTER_ACTIVITY_MAP_DATA_SOURCES.filter((s) => s.valueLabel);
    expect(withValueLabel.map((s) => s.value)).toEqual(
      expect.arrayContaining(["pi", "mining", "ratting"]),
    );
  });
});
