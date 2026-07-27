import { describe, expect, it } from "vitest";
import { abbreviateNumber, getCSSVariable } from "./GraphHelpers";

describe("abbreviateNumber", () => {
  it("leaves numbers under 1000 unabbreviated", () => {
    expect(abbreviateNumber(0)).toBe("0");
    expect(abbreviateNumber(999)).toBe("999");
  });

  it("abbreviates thousands with a 'k' suffix", () => {
    expect(abbreviateNumber(1000)).toBe("1k");
    expect(abbreviateNumber(1500)).toBe("1.5k");
  });

  it("abbreviates millions with an 'm' suffix", () => {
    expect(abbreviateNumber(2_500_000)).toBe("2.5m");
  });

  it("abbreviates billions with a 'b' suffix", () => {
    expect(abbreviateNumber(3_000_000_000)).toBe("3b");
  });
});

describe("getCSSVariable", () => {
  it("reads a CSS custom property's value off the document body", () => {
    document.body.style.setProperty("--test-var", "42px");
    expect(getCSSVariable("--test-var")).toBe("42px");
  });

  it("returns an empty string for a property that isn't set", () => {
    expect(getCSSVariable("--not-set")).toBe("");
  });
});
