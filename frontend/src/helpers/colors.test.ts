import { describe, expect, it } from "vitest";
import { GetSecurityColors } from "./colors";

describe("GetSecurityColors", () => {
  it.each([
    [1.0, "#2c74e0"],
    [0.9, "#2c74e0"],
    [0.85, "#3999e9"],
    [0.8, "#3999e9"],
    [0.75, "#4dccf6"],
    [0.7, "#4dccf6"],
    [0.65, "#60d9a3"],
    [0.6, "#60d9a3"],
    [0.55, "#71e554"],
    [0.5, "#71e554"],
    [0.45, "#f3fd82"],
    [0.4, "#f3fd82"],
    [0.35, "#da6c07"],
    [0.3, "#da6c07"],
    [0.25, "#cc440f"],
    [0.2, "#cc440f"],
    [0.15, "#ba1117"],
    [0.1, "#ba1117"],
    [0.05, "#732020"],
    [0.0, "#8c3263"],
    [-1.0, "#8c3263"],
  ])("maps security %s to %s", (secLevel, expected) => {
    expect(GetSecurityColors(secLevel)).toBe(expected);
  });
});
