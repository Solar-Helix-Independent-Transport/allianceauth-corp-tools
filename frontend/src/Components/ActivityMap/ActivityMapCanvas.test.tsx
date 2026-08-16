import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Viewport } from "@xyflow/react";
import type { SpaceMapCanvasProps } from "../SpaceMap/SpaceMapCanvas";
import type { BaseMapSystem } from "../SpaceMap/types";
import ActivityMapCanvas from "./ActivityMapCanvas";
import type { ActivityMapDataSource, ActivityMapResponse } from "./types";

type CanvasNodeData = { color: string };

let lastProps: SpaceMapCanvasProps<BaseMapSystem, CanvasNodeData> | null = null;

vi.mock("../SpaceMap/SpaceMapCanvas", () => ({
  default: (props: SpaceMapCanvasProps<BaseMapSystem, CanvasNodeData>) => {
    lastProps = props;
    return <div data-testid="space-map-canvas" />;
  },
}));

const makeSystem = (id: number): BaseMapSystem => ({
  id,
  name: `System ${id}`,
  region_id: 1,
  constellation_id: 1,
  x_2d: id,
  y_2d: id,
  x_real: id * 10,
  y_real: id * 10,
  security_status: 0.5,
  security_class: "B",
  external: false,
});

const dataSource: ActivityMapDataSource = {
  value: "assets",
  label: "Assets",
  load: async () => ({ regions: [], systems: [], edges: [], values: [] }),
  countLabel: "Assets",
  quantityLabel: "Quantity",
};

const makeData = (): ActivityMapResponse => ({
  regions: [{ id: 1, name: "Region" }],
  systems: [makeSystem(1), makeSystem(2)],
  edges: [{ source: 1, target: 2 }],
  values: [{ system_id: 1, value: 50, count: 3, quantity: 9 }],
});

describe("ActivityMapCanvas", () => {
  it("passes systems/regions/edges straight through and builds activity dots from the response", () => {
    const data = makeData();

    render(<ActivityMapCanvas id={7} data={data} coordMode="2d" dataSource={dataSource} />);

    expect(screen.getByTestId("space-map-canvas")).toBeInTheDocument();
    expect(lastProps?.systems).toBe(data.systems);
    expect(lastProps?.regions).toBe(data.regions);
    expect(lastProps?.edges).toBe(data.edges);
    expect(lastProps?.nodes).toEqual([]);
    expect(lastProps?.dots).toHaveLength(2);
    // System 1 has the only positive value, so it gets the biggest radius
    // and sorts first (see buildActivityDots' biggest-paints-first order).
    expect(lastProps?.dots[0]).toMatchObject({ id: "1" });
  });

  it("forwards id as fitViewKey so switching corp/character scope re-fits instead of keeping a stale viewport", () => {
    const data = makeData();

    render(<ActivityMapCanvas id={7} data={data} coordMode="2d" dataSource={dataSource} />);

    expect(lastProps?.fitViewKey).toBe(7);
  });

  it("restricts fitViewNodeIds to systems with a positive value, excluding the rest of the known-space backdrop", () => {
    const data: ActivityMapResponse = {
      regions: [{ id: 1, name: "Region" }],
      systems: [makeSystem(1), makeSystem(2), makeSystem(3)],
      edges: [],
      values: [
        { system_id: 1, value: 50, count: 3, quantity: 9 },
        { system_id: 2, value: 0, count: 0, quantity: 0 },
      ],
    };

    render(<ActivityMapCanvas id={7} data={data} coordMode="2d" dataSource={dataSource} />);

    expect(lastProps?.fitViewNodeIds).toEqual(["1"]);
  });

  it("excludes value entries with no matching system (e.g. wormhole/abyssal, dropped from the map backdrop) from fitViewNodeIds", () => {
    const data: ActivityMapResponse = {
      regions: [{ id: 1, name: "Region" }],
      systems: [makeSystem(1), makeSystem(2)],
      edges: [],
      values: [
        { system_id: 1, value: 50, count: 3, quantity: 9 },
        // A wormhole system with real activity but no backdrop node -
        // handing this id to fitView alongside/instead of real matches used
        // to collapse the fit to a degenerate point at the map's origin.
        { system_id: 31000005, value: 999, count: 1, quantity: 1 },
      ],
    };

    render(<ActivityMapCanvas id={7} data={data} coordMode="2d" dataSource={dataSource} />);

    expect(lastProps?.fitViewNodeIds).toEqual(["1"]);
  });

  it("forwards the initialViewport and onViewportChange callback unchanged", () => {
    const data = makeData();
    const initialViewport: Viewport = { x: 1, y: 2, zoom: 3 };
    const onViewportChange = vi.fn();

    render(
      <ActivityMapCanvas
        id={7}
        data={data}
        coordMode="2d"
        dataSource={dataSource}
        initialViewport={initialViewport}
        onViewportChange={onViewportChange}
      />,
    );

    expect(lastProps?.initialViewport).toBe(initialViewport);
    expect(lastProps?.onViewportChange).toBe(onViewportChange);
  });

  it("renders the detail panel for a system using that data source's labels and the matching value entry", () => {
    const data = makeData();
    render(<ActivityMapCanvas id={7} data={data} coordMode="2d" dataSource={dataSource} />);

    const panel = lastProps?.renderDetailPanel?.(data.systems[0], () => {});
    expect(panel).toBeTruthy();

    render(<>{panel}</>);

    expect(screen.getByText("System 1")).toBeInTheDocument();
    expect(screen.getByText("Assets")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("falls back to zeroed values in the detail panel for a system with no matching value entry", () => {
    const data = makeData();
    render(<ActivityMapCanvas id={7} data={data} coordMode="2d" dataSource={dataSource} />);

    const panel = lastProps?.renderDetailPanel?.(data.systems[1], () => {});
    render(<>{panel}</>);

    expect(screen.getByText("System 2")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
  });
});
