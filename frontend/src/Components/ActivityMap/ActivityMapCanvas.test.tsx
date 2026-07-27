import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Viewport } from "@xyflow/react";
import type { SpaceMapCanvasProps } from "../SpaceMap/SpaceMapCanvas";
import type { BaseMapSystem } from "../SpaceMap/types";
import ActivityMapCanvas from "./ActivityMapCanvas";
import type { ActivityMapDataSource, ActivityMapResponse, ActivityNodeData } from "./types";

let lastProps: SpaceMapCanvasProps<BaseMapSystem, ActivityNodeData> | null = null;

vi.mock("../SpaceMap/SpaceMapCanvas", () => ({
  default: (props: SpaceMapCanvasProps<BaseMapSystem, ActivityNodeData>) => {
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
  it("passes systems/regions/edges straight through and builds activity nodes from the response", () => {
    const data = makeData();

    render(<ActivityMapCanvas data={data} coordMode="2d" dataSource={dataSource} />);

    expect(screen.getByTestId("space-map-canvas")).toBeInTheDocument();
    expect(lastProps?.systems).toBe(data.systems);
    expect(lastProps?.regions).toBe(data.regions);
    expect(lastProps?.edges).toBe(data.edges);
    expect(lastProps?.nodes).toHaveLength(2);
    expect(lastProps?.nodes[0]).toMatchObject({ id: "1", type: "dot" });
  });

  it("forwards the initialViewport and onViewportChange callback unchanged", () => {
    const data = makeData();
    const initialViewport: Viewport = { x: 1, y: 2, zoom: 3 };
    const onViewportChange = vi.fn();

    render(
      <ActivityMapCanvas
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
    render(<ActivityMapCanvas data={data} coordMode="2d" dataSource={dataSource} />);

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
    render(<ActivityMapCanvas data={data} coordMode="2d" dataSource={dataSource} />);

    const panel = lastProps?.renderDetailPanel?.(data.systems[1], () => {});
    render(<>{panel}</>);

    expect(screen.getByText("System 2")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
  });
});
