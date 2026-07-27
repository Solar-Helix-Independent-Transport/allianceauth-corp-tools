import { describe, expect, it } from "vitest";
import { transportMismatch, upgradeStateBg } from "./sovereigntyShared";
import type { WorkforceTransport } from "./sovereigntyShared";

describe("upgradeStateBg", () => {
  it.each([
    ["online", "success"],
    ["Online", "success"],
    ["offline", "warning"],
    ["low", "danger"],
    ["pending", "info"],
    ["something-else", "secondary"],
  ])("maps state %s to variant %s", (state, expected) => {
    expect(upgradeStateBg(state)).toBe(expected);
  });
});

describe("transportMismatch", () => {
  it("is false when there is no transport or no mode", () => {
    expect(transportMismatch(null)).toBe(false);
    expect(
      transportMismatch({
        mode: null,
        config_sources: [],
        state_sources: [],
        config_destination: null,
        state_destination: null,
      }),
    ).toBe(false);
  });

  it("is false for an import whose configured and actual source systems match", () => {
    const wt: WorkforceTransport = {
      mode: "import",
      config_sources: [{ system_id: 1, system_name: "A" }],
      state_sources: [{ system_id: 1, system_name: "A" }],
      config_destination: null,
      state_destination: null,
    };
    expect(transportMismatch(wt)).toBe(false);
  });

  it("is true for an import whose actual sources differ from what's configured", () => {
    const wt: WorkforceTransport = {
      mode: "import",
      config_sources: [{ system_id: 1, system_name: "A" }],
      state_sources: [{ system_id: 2, system_name: "B" }],
      config_destination: null,
      state_destination: null,
    };
    expect(transportMismatch(wt)).toBe(true);
  });

  it("is true for an import with a different number of sources", () => {
    const wt: WorkforceTransport = {
      mode: "import",
      config_sources: [{ system_id: 1, system_name: "A" }],
      state_sources: [
        { system_id: 1, system_name: "A" },
        { system_id: 2, system_name: "B" },
      ],
      config_destination: null,
      state_destination: null,
    };
    expect(transportMismatch(wt)).toBe(true);
  });

  it("is false for an export whose configured and actual destination match", () => {
    const wt: WorkforceTransport = {
      mode: "export",
      config_sources: [],
      state_sources: [],
      config_destination: { system_id: 5, system_name: "Dest" },
      state_destination: { system_id: 5, system_name: "Dest" },
    };
    expect(transportMismatch(wt)).toBe(false);
  });

  it("is true for an export whose actual destination differs from configured", () => {
    const wt: WorkforceTransport = {
      mode: "export",
      config_sources: [],
      state_sources: [],
      config_destination: { system_id: 5, system_name: "Dest" },
      state_destination: { system_id: 6, system_name: "Other" },
    };
    expect(transportMismatch(wt)).toBe(true);
  });

  it("is false for the 'transit' mode, which isn't checked", () => {
    const wt: WorkforceTransport = {
      mode: "transit",
      config_sources: [{ system_id: 1, system_name: "A" }],
      state_sources: [{ system_id: 2, system_name: "B" }],
      config_destination: null,
      state_destination: null,
    };
    expect(transportMismatch(wt)).toBe(false);
  });
});
