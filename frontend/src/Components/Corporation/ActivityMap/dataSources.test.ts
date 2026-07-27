import { describe, expect, it } from "vitest";
import { CORPORATION_ACTIVITY_MAP_DATA_SOURCES } from "./dataSources";

describe("CORPORATION_ACTIVITY_MAP_DATA_SOURCES", () => {
  it("has a unique value for every entry", () => {
    const values = CORPORATION_ACTIVITY_MAP_DATA_SOURCES.map((s) => s.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it("gives every entry a non-empty label and a load function", () => {
    for (const source of CORPORATION_ACTIVITY_MAP_DATA_SOURCES) {
      expect(source.label.length).toBeGreaterThan(0);
      expect(typeof source.load).toBe("function");
    }
  });

  it("only sets valueLabel for data sources whose value means something beyond the count", () => {
    const withValueLabel = CORPORATION_ACTIVITY_MAP_DATA_SOURCES.filter((s) => s.valueLabel);
    expect(withValueLabel.map((s) => s.value)).toEqual(
      expect.arrayContaining(["pocos_revenue", "pi", "mining", "ratting"]),
    );
  });

  it("includes the member-scoped variants added alongside the corp-wide ones", () => {
    const values = CORPORATION_ACTIVITY_MAP_DATA_SOURCES.map((s) => s.value);
    expect(values).toEqual(
      expect.arrayContaining(["assets_members", "assets_members_ships", "assets_members_capitals"]),
    );
  });
});
