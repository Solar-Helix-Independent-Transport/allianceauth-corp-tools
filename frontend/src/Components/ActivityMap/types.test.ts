import { describe, expect, it } from "vitest";
import { getActivityMapDataSource } from "./types";
import type { ActivityMapDataSource } from "./types";

const load = async () => ({ regions: [], systems: [], edges: [], values: [] });

const sources: ActivityMapDataSource[] = [
  { value: "assets", label: "Assets", load },
  { value: "mining", label: "Mining", load },
  { value: "ratting", label: "Ratting", load },
];

describe("getActivityMapDataSource", () => {
  it("returns the source matching the given value", () => {
    expect(getActivityMapDataSource(sources, "mining")).toBe(sources[1]);
  });

  it("falls back to the first source when value is null", () => {
    expect(getActivityMapDataSource(sources, null)).toBe(sources[0]);
  });

  it("falls back to the first source when value matches nothing", () => {
    expect(getActivityMapDataSource(sources, "not-a-real-source")).toBe(sources[0]);
  });
});
