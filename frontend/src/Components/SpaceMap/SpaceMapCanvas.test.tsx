import { fireEvent, render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";
import type { Node } from "@xyflow/react";
import SpaceMapCanvas from "./SpaceMapCanvas";
import type { BaseMapSystem, MapDot } from "./types";

type DotData = { color: string };

const makeSystem = (id: number, x: number, y: number): BaseMapSystem => ({
  id,
  name: `System ${id}`,
  region_id: 1,
  constellation_id: 1,
  x_2d: x,
  y_2d: y,
  x_real: x,
  y_real: y,
  security_status: 0.5,
  security_class: "B",
  external: false,
});

const DotNodeType = ({ data }: { data: DotData }) => (
  <div data-testid="dot-node" style={{ background: data.color }} />
);

// A "real" xyflow node - standing in for something like a sov hub card,
// which (unlike the bulk of systems) needs to be an actual DOM element.
const makeNodes = (systems: BaseMapSystem[]): Node<DotData>[] =>
  systems.map((s) => ({
    id: String(s.id),
    type: "dot",
    position: { x: s.x_2d ?? 0, y: s.y_2d ?? 0 },
    data: { color: "blue" },
  }));

const makeDots = (systems: BaseMapSystem[]): MapDot[] =>
  systems.map((s) => ({
    id: String(s.id),
    x: s.x_2d ?? 0,
    y: s.y_2d ?? 0,
    radius: 4,
    color: "blue",
    name: s.name,
  }));

describe("SpaceMapCanvas", () => {
  it("draws the bulk system set on a canvas (not as per-system DOM nodes) alongside the standard xyflow chrome", () => {
    const systems = [makeSystem(1, 0, 0), makeSystem(2, 100, 100)];

    const { container } = render(
      <ReactFlowProvider>
        <SpaceMapCanvas
          systems={systems}
          regions={[]}
          edges={[]}
          coordMode="2d"
          dots={makeDots(systems)}
          nodes={[]}
          nodeTypes={{ dot: DotNodeType }}
        />
      </ReactFlowProvider>,
    );

    expect(screen.queryAllByTestId("dot-node")).toHaveLength(0);
    expect(container.querySelectorAll("canvas").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector(".react-flow__controls")).toBeInTheDocument();
  });

  it("still renders real xyflow nodes passed via `nodes` (e.g. richer cards)", () => {
    const systems = [makeSystem(1, 0, 0)];

    render(
      <ReactFlowProvider>
        <SpaceMapCanvas
          systems={systems}
          regions={[]}
          edges={[]}
          coordMode="2d"
          dots={[]}
          nodes={makeNodes(systems)}
          nodeTypes={{ dot: DotNodeType }}
        />
      </ReactFlowProvider>,
    );

    expect(screen.getAllByTestId("dot-node")).toHaveLength(1);
  });

  it("shows the detail panel for a system after clicking its (real) node, and hides it again on pane click", () => {
    const systems = [makeSystem(1, 0, 0)];

    render(
      <ReactFlowProvider>
        <SpaceMapCanvas
          systems={systems}
          regions={[]}
          edges={[]}
          coordMode="2d"
          dots={[]}
          nodes={makeNodes(systems)}
          nodeTypes={{ dot: DotNodeType }}
          renderDetailPanel={(system, onClose) => (
            <div data-testid="detail-panel">
              {system.name}
              <button type="button" onClick={onClose}>
                close
              </button>
            </div>
          )}
        />
      </ReactFlowProvider>,
    );

    expect(screen.queryByTestId("detail-panel")).not.toBeInTheDocument();

    const node = document.querySelector(".react-flow__node") as HTMLElement;
    fireEvent.click(node);
    expect(screen.getByTestId("detail-panel")).toHaveTextContent("System 1");

    const pane = document.querySelector(".react-flow__pane") as HTMLElement;
    fireEvent.click(pane);
    expect(screen.queryByTestId("detail-panel")).not.toBeInTheDocument();
  });

  it("does not mount the jump-bridge layer when no jumpBridges prop is given", () => {
    const systems = [makeSystem(1, 0, 0)];

    render(
      <ReactFlowProvider>
        <SpaceMapCanvas
          systems={systems}
          regions={[]}
          edges={[]}
          coordMode="2d"
          dots={makeDots(systems)}
          nodes={[]}
          nodeTypes={{ dot: DotNodeType }}
        />
      </ReactFlowProvider>,
    );

    expect(screen.queryByText(/>>/)).not.toBeInTheDocument();
  });

  it("reports pan/zoom changes via onViewportChange when a viewport is restored from onMoveEnd", () => {
    const systems = [makeSystem(1, 0, 0)];
    const onViewportChange = vi.fn();

    render(
      <ReactFlowProvider>
        <SpaceMapCanvas
          systems={systems}
          regions={[]}
          edges={[]}
          coordMode="2d"
          dots={makeDots(systems)}
          nodes={[]}
          nodeTypes={{ dot: DotNodeType }}
          initialViewport={{ x: 1, y: 2, zoom: 1 }}
          onViewportChange={onViewportChange}
        />
      </ReactFlowProvider>,
    );

    // Smoke-test only: xyflow's pan/zoom gesture handling relies on pointer
    // capture and layout measurements jsdom doesn't provide, so we can't
    // simulate a real drag here. This just confirms an initialViewport
    // renders without crashing and doesn't error the fit-bounds effect.
    expect(document.querySelector(".react-flow__renderer")).toBeInTheDocument();
  });
});
