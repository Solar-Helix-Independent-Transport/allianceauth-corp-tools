import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { loadAllStructures } from "../../api/corporation";
import Structures from "./Structures";

vi.mock("../../api/corporation", () => ({
  loadAllStructures: vi.fn(),
}));

let lastProps: { data: unknown; isFetching: boolean } | null = null;
vi.mock("../../Components/Corporation/Structures", () => ({
  default: (props: { data: unknown; isFetching: boolean }) => {
    lastProps = props;
    return <div data-testid="structures-table" />;
  },
}));

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <Structures />
    </QueryClientProvider>,
  );
};

describe("Structures (Corp page)", () => {
  it("passes an empty array as initialData before the query resolves", async () => {
    vi.mocked(loadAllStructures).mockReturnValue(new Promise(() => {}));

    renderPage();

    await screen.findByTestId("structures-table");
    expect(lastProps?.data).toEqual([]);
    expect(lastProps?.isFetching).toBe(true);
  });

  it("passes the resolved structures array through once loadAllStructures settles", async () => {
    const resolved = [
      {
        id: 1,
        owner: { corporation_id: 1, corporation_name: "Test Corp", alliance_name: "" },
        type: { id: 1, name: "Astrahus" },
        location: { id: 1, name: "Jita IV - Moon 4" },
        constellation: { id: 1, name: "Kimotoro" },
        region: { id: 1, name: "The Forge" },
        name: "My Citadel",
        state: "online",
        fuel_expiry: "2024-01-01T00:00:00Z",
        services: [],
      },
    ];
    vi.mocked(loadAllStructures).mockResolvedValue(resolved);

    renderPage();

    await screen.findByTestId("structures-table");
    await vi.waitFor(() => expect(lastProps?.data).toEqual(resolved));
    expect(lastProps?.isFetching).toBe(false);
  });
});
