import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import type { BaseTableProps } from "./BaseTable";
import AsyncTableWrapper from "./AsyncTableWrapper";

let lastProps: BaseTableProps | null = null;

vi.mock("./BaseTable", () => ({
  default: (props: BaseTableProps) => {
    lastProps = props;
    return <div data-testid="base-table" />;
  },
}));

const columns = [{ accessorKey: "a", header: "A" }];

const renderWrapper = (queryFn: () => Promise<unknown>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AsyncTableWrapper queryFn={queryFn} queryKey={["test"]} columns={columns} />
    </QueryClientProvider>,
  );
};

describe("AsyncTableWrapper", () => {
  it("passes isFetching=true and no data to BaseTable while the query is in flight", async () => {
    renderWrapper(() => new Promise(() => {}));

    await screen.findByTestId("base-table");
    expect(lastProps?.isFetching).toBe(true);
    expect(lastProps?.data).toBeUndefined();
  });

  it("passes the resolved data and isFetching=false once the query settles", async () => {
    const data = [{ a: 1 }, { a: 2 }];
    renderWrapper(async () => data);

    await screen.findByTestId("base-table");
    await vi.waitFor(() => expect(lastProps?.isFetching).toBe(false));
    expect(lastProps?.data).toEqual(data);
    expect(lastProps?.columns).toBe(columns);
  });
});
