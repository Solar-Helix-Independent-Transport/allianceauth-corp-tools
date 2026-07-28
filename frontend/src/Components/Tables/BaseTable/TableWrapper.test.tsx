import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BaseTableProps } from "./BaseTable";
import TableWrapper from "./TableWrapper";

type Row = { a: number };

let lastProps: BaseTableProps<Row> | null = null;

vi.mock("../../Tables/BaseTable/BaseTable", () => ({
  default: (props: BaseTableProps<Row>) => {
    lastProps = props;
    return <div data-testid="base-table" />;
  },
}));

describe("TableWrapper", () => {
  it("passes data, isFetching, and columns straight through to BaseTable", () => {
    const data = [{ a: 1 }];
    const columns = [{ accessorKey: "a", header: "A" }];

    render(<TableWrapper data={data} isFetching columns={columns} />);

    expect(screen.getByTestId("base-table")).toBeInTheDocument();
    expect(lastProps?.data).toBe(data);
    expect(lastProps?.columns).toBe(columns);
    expect(lastProps?.isFetching).toBe(true);
  });
});
