import { render } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import StargateEdgesLayer from "./StargateEdgesLayer";
import type { BaseMapSystem } from "./types";

const makeSystem = (id: number, x: number, y: number): BaseMapSystem => ({
  id,
  name: `System ${id}`,
  region_id: null,
  constellation_id: null,
  x_2d: x,
  y_2d: y,
  x_real: x,
  y_real: y,
  security_status: null,
  security_class: null,
  external: false,
});

describe("StargateEdgesLayer", () => {
  it("draws a line for every edge whose endpoints resolve to a known system", () => {
    const systems = [makeSystem(1, 0, 0), makeSystem(2, 10, 10)];
    const { container } = render(
      <ReactFlowProvider>
        <StargateEdgesLayer
          systems={systems}
          edges={[
            { source: 1, target: 2 },
            { source: 1, target: 999 },
          ]}
          coordMode="2d"
        />
      </ReactFlowProvider>,
    );

    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toHaveAttribute("x1", "0");
    expect(lines[0]).toHaveAttribute("y1", "0");
    expect(lines[0]).toHaveAttribute("x2", "10");
    expect(lines[0]).toHaveAttribute("y2", "10");
  });
});
