import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Viewport } from "@xyflow/react";
import ActivityMap from "./ActivityMap";
import type { ActivityMapDataSource, ActivityMapResponse } from "./types";

let lastCanvasProps: {
  coordMode: string;
  dataSource: ActivityMapDataSource;
  initialViewport?: Viewport;
  onViewportChange?: (viewport: Viewport) => void;
} | null = null;

vi.mock("./ActivityMapCanvas", () => ({
  default: (props: {
    coordMode: string;
    dataSource: ActivityMapDataSource;
    initialViewport?: Viewport;
    onViewportChange?: (viewport: Viewport) => void;
  }) => {
    lastCanvasProps = props;
    return <div data-testid="activity-map-canvas" />;
  },
}));

afterEach(() => {
  lastCanvasProps = null;
});

const emptyResponse: ActivityMapResponse = { regions: [], systems: [], edges: [], values: [] };

// Each entry resolves via its own deferred promise so tests can control
// exactly when a given data source's fetch settles, in order to observe the
// loading/refetching states in between.
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

const renderActivityMap = (
  dataSources: ActivityMapDataSource[],
  {
    searchParams = "",
    onUrlUpdate,
  }: { searchParams?: string; onUrlUpdate?: OnUrlUpdateFunction } = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NuqsTestingAdapter hasMemory searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
        <ActivityMap id={1} dataSources={dataSources} queryKeyPrefix="test-activity-map" />
      </NuqsTestingAdapter>
    </QueryClientProvider>,
  );
};

describe("ActivityMap", () => {
  it("shows a full-area loading spinner before any data has arrived", async () => {
    const pending = deferred<ActivityMapResponse>();
    const dataSources: ActivityMapDataSource[] = [
      { value: "assets", label: "Assets", load: () => pending.promise },
    ];

    renderActivityMap(dataSources);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByTestId("activity-map-canvas")).not.toBeInTheDocument();

    pending.resolve(emptyResponse);

    await screen.findByTestId("activity-map-canvas");
  });

  it("renders the canvas with the selected data source and coord mode once data loads", async () => {
    const dataSources: ActivityMapDataSource[] = [
      { value: "assets", label: "Assets", load: async () => emptyResponse },
      { value: "mining", label: "Mining", load: async () => emptyResponse },
    ];

    renderActivityMap(dataSources);

    await screen.findByTestId("activity-map-canvas");

    expect(lastCanvasProps?.dataSource.value).toBe("assets");
    expect(lastCanvasProps?.coordMode).toBe("2d");
  });

  it("switches data source via the dropdown, updates the URL, and keeps the old map visible while refetching", async () => {
    const pendingMining = deferred<ActivityMapResponse>();
    const dataSources: ActivityMapDataSource[] = [
      { value: "assets", label: "Assets", load: async () => emptyResponse },
      { value: "mining", label: "Mining", load: () => pendingMining.promise },
    ];
    const onUrlUpdate = vi.fn();

    renderActivityMap(dataSources, { onUrlUpdate });
    await screen.findByTestId("activity-map-canvas");

    fireEvent.change(screen.getByLabelText("Data shown on map"), {
      target: { value: "mining" },
    });

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const lastUpdate = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
    expect(lastUpdate.searchParams.get("source")).toBe("mining");

    // keepPreviousData: the canvas (still showing the old "assets" data)
    // stays mounted, with the overlay spinner on top while mining loads.
    expect(screen.getByTestId("activity-map-canvas")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    pendingMining.resolve(emptyResponse);
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());

    expect(lastCanvasProps?.dataSource.value).toBe("mining");
  });

  it("toggles coord mode via the button group and reflects it in the URL and canvas props", async () => {
    const dataSources: ActivityMapDataSource[] = [
      { value: "assets", label: "Assets", load: async () => emptyResponse },
    ];
    const onUrlUpdate = vi.fn();

    renderActivityMap(dataSources, { onUrlUpdate });
    await screen.findByTestId("activity-map-canvas");

    fireEvent.click(screen.getByRole("radio", { name: "Real Coords" }));

    await waitFor(() => expect(lastCanvasProps?.coordMode).toBe("real"));
    const lastUpdate = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
    expect(lastUpdate.searchParams.get("coords")).toBe("real");
  });

  it("restores an initial viewport from the URL's x/y/zoom query params", async () => {
    const dataSources: ActivityMapDataSource[] = [
      { value: "assets", label: "Assets", load: async () => emptyResponse },
    ];

    renderActivityMap(dataSources, { searchParams: "?x=10&y=20&zoom=1.5" });
    await screen.findByTestId("activity-map-canvas");

    expect(lastCanvasProps?.initialViewport).toEqual({ x: 10, y: 20, zoom: 1.5 });
  });

  it("does not pass an initialViewport when the URL has no viewport params yet", async () => {
    const dataSources: ActivityMapDataSource[] = [
      { value: "assets", label: "Assets", load: async () => emptyResponse },
    ];

    renderActivityMap(dataSources);
    await screen.findByTestId("activity-map-canvas");

    expect(lastCanvasProps?.initialViewport).toBeUndefined();
  });

  it("persists viewport changes from the canvas back to the URL query params", async () => {
    const dataSources: ActivityMapDataSource[] = [
      { value: "assets", label: "Assets", load: async () => emptyResponse },
    ];
    const onUrlUpdate = vi.fn();

    renderActivityMap(dataSources, { onUrlUpdate });
    await screen.findByTestId("activity-map-canvas");

    act(() => {
      lastCanvasProps?.onViewportChange?.({ x: 5, y: 6, zoom: 2 });
    });

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const lastUpdate = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
    expect(lastUpdate.searchParams.get("x")).toBe("5");
    expect(lastUpdate.searchParams.get("y")).toBe("6");
    expect(lastUpdate.searchParams.get("zoom")).toBe("2");
  });
});
