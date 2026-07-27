import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import RegionLabelsLayer from "./RegionLabelsLayer";
import type { BaseMapRegion, BaseMapSystem } from "./types";

const makeSystem = (overrides: Partial<BaseMapSystem> & { id: number }): BaseMapSystem => ({
  name: `System ${overrides.id}`,
  region_id: null,
  constellation_id: null,
  x_2d: 0,
  y_2d: 0,
  x_real: 0,
  y_real: 0,
  security_status: null,
  security_class: null,
  external: false,
  ...overrides,
});

describe("RegionLabelsLayer", () => {
  it("renders a watermark label for every region that has at least one system", () => {
    const regions: BaseMapRegion[] = [
      { id: 1, name: "The Forge" },
      { id: 2, name: "Empty Region" },
    ];
    const systems = [makeSystem({ id: 1, region_id: 1, x_2d: 10, y_2d: 10 })];

    render(
      <ReactFlowProvider>
        <RegionLabelsLayer regions={regions} systems={systems} coordMode="2d" />
      </ReactFlowProvider>,
    );

    expect(screen.getByText("The Forge")).toBeInTheDocument();
    expect(screen.queryByText("Empty Region")).not.toBeInTheDocument();
  });
});
