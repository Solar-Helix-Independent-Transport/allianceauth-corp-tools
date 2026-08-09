import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useReactTable, getCoreRowModel, type ColumnDef, type Row } from "@tanstack/react-table";
import Filter from "./BaseTableFilter";
import { NameObjectArrayFilterFn } from "./NameObjectArrayFilterFn";

// Filter picks its input type by inspecting the *first row's* value for a
// column, so a minimal one/two-row table per case is enough to drive it
// through react-table's real column/table objects rather than hand-rolled
// stand-ins.
const FilterHarness = ({
  data,
  accessorKey,
}: {
  data: Record<string, unknown>[];
  accessorKey: string;
}) => {
  const columns: ColumnDef<Record<string, unknown>, unknown>[] = [
    { accessorKey, header: accessorKey },
  ];
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  const column = table.getColumn(accessorKey)!;
  return <Filter column={column} table={table} />;
};

describe("Filter", () => {
  it("renders the number range filter for a numeric column", () => {
    render(<FilterHarness data={[{ n: 1 }, { n: 2 }]} accessorKey="n" />);
    expect(screen.getByPlaceholderText("Set Range")).toBeInTheDocument();
  });

  it("renders the boolean filter for a boolean column", () => {
    render(<FilterHarness data={[{ b: true }, { b: false }]} accessorKey="b" />);
    expect(screen.getByPlaceholderText("Filter")).toBeInTheDocument();
  });

  it("renders the plain text filter for an object/array column", () => {
    render(<FilterHarness data={[{ o: [{ name: "a" }] }]} accessorKey="o" />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("renders the select filter for a plain string column", () => {
    render(<FilterHarness data={[{ s: "alpha" }, { s: "beta" }]} accessorKey="s" />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("renders the select filter even when the first value happens to parse as a date", () => {
    // Used to infer a date column via Date.parse() on the first row and
    // render nothing for it - but Date.parse() is permissive enough to
    // treat plenty of ordinary strings as valid dates, which made the
    // filter vanish outright rather than just mis-render (#308).
    render(<FilterHarness data={[{ d: "2024-01-01T00:00:00Z" }]} accessorKey="d" />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("keeps the filter for an EVE item name Date.parse() misidentifies as a date (#308)", () => {
    render(
      <FilterHarness
        data={[{ type: "Inherent Implants 'Squire' Power Grid Management EG-602" }]}
        accessorKey="type"
      />,
    );
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });
});

describe("NameObjectArrayFilterFn", () => {
  it("matches case-insensitively against any object's name in the array", () => {
    const row = {
      getValue: () => [{ name: "Alpha Corp" }, { name: "Beta Alliance" }],
    } as unknown as Row<unknown>;
    expect(NameObjectArrayFilterFn(row, "col", "beta")).toBe(true);
    expect(NameObjectArrayFilterFn(row, "col", "gamma")).toBe(false);
  });
});
