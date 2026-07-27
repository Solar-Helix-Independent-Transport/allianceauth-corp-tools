import { fireEvent, render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import JumpBridgeEdgesLayer from "./JumpBridgeEdgesLayer";
import type { BaseMapSystem } from "./types";

const makeSystem = (id: number, name: string, x: number, y: number): BaseMapSystem => ({
  id,
  name,
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

describe("JumpBridgeEdgesLayer", () => {
  const systems = [makeSystem(1, "Jita", 0, 0), makeSystem(2, "Amarr", 100, 0)];
  const edges = [{ source: 1, target: 2 }];

  it("labels a bridge with both endpoint names", () => {
    render(
      <ReactFlowProvider>
        <JumpBridgeEdgesLayer systems={systems} edges={edges} coordMode="2d" />
      </ReactFlowProvider>,
    );

    expect(screen.getByText("Jita >> Amarr")).toBeInTheDocument();
  });

  it("brings a bridge to the front (renders it last) once clicked", () => {
    const twoEdges = [
      { source: 1, target: 2 },
      { source: 2, target: 1 },
    ];
    const { container } = render(
      <ReactFlowProvider>
        <JumpBridgeEdgesLayer
          systems={[...systems, makeSystem(3, "Dodixie", 200, 0)]}
          edges={twoEdges}
          coordMode="2d"
        />
      </ReactFlowProvider>,
    );

    const groups = container.querySelectorAll("g[style*='cursor: pointer']");
    expect(groups).toHaveLength(2);

    fireEvent.click(groups[0]);

    const reordered = container.querySelectorAll("g[style*='cursor: pointer']");
    // the clicked (now-selected) bridge should have moved to be painted last.
    expect(reordered[1]).toBe(groups[0]);
  });
});
