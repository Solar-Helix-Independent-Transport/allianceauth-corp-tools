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
  it("passes the {characters: [], main: undefined, headers: []} initialData before the query resolves", async () => {
    vi.mocked(loadAllStructures).mockReturnValue(new Promise(() => {}));

    renderPage();

    await screen.findByTestId("structures-table");
    expect(lastProps?.data).toEqual({ characters: [], main: undefined, headers: [] });
    expect(lastProps?.isFetching).toBe(true);
  });

  it("passes the resolved structures data through once loadAllStructures settles", async () => {
    const resolved = { characters: [{ id: 1 }], main: 1, headers: ["Name"] };
    vi.mocked(loadAllStructures).mockResolvedValue(resolved);

    renderPage();

    await screen.findByTestId("structures-table");
    await vi.waitFor(() => expect(lastProps?.data).toEqual(resolved));
    expect(lastProps?.isFetching).toBe(false);
  });
});
