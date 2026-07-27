import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import type { BaseTableProps } from "../Components/Tables/BaseTable/BaseTable";
import AsyncTable from "./AsyncTable";

let lastProps: BaseTableProps | null = null;

vi.mock("../Components/Tables/BaseTable/BaseTable", () => ({
  default: (props: BaseTableProps) => {
    lastProps = props;
    return <div data-testid="base-table" />;
  },
}));

const renderAsyncTable = (apiEndpoint: (params: any) => Promise<any>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AsyncTable
        apiQueryKey="things"
        apiParams={[1, 2]}
        // AsyncTableProps types this as `(params: any) => Array<any>`, but
        // it's only ever called as `() => apiEndpoint(apiParams)` and handed
        // straight to react-query's queryFn, which awaits whatever comes
        // back - the declared return type doesn't match what's actually
        // supported (a promise), so a cast is needed here.
        apiEndpoint={apiEndpoint as unknown as (params: any) => any[]}
        columnDefinition={[{ accessorKey: "a", header: "A" }]}
      />
    </QueryClientProvider>,
  );
};

describe("AsyncTable", () => {
  it("starts with the [] initialData and isFetching=true before the query resolves", async () => {
    renderAsyncTable(() => new Promise(() => {}));

    await screen.findByTestId("base-table");
    expect(lastProps?.data).toEqual([]);
    expect(lastProps?.isFetching).toBe(true);
  });

  it("calls apiEndpoint with apiParams and passes the resolved data through once it settles", async () => {
    const data = [{ a: 1 }];
    const apiEndpoint = vi.fn(async () => data);

    renderAsyncTable(apiEndpoint);

    await screen.findByTestId("base-table");
    await vi.waitFor(() => expect(lastProps?.data).toEqual(data));
    expect(apiEndpoint).toHaveBeenCalledWith([1, 2]);
    expect(lastProps?.isFetching).toBe(false);
  });
});
