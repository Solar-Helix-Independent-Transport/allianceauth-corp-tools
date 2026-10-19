import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ColumnDef } from "@tanstack/react-table";
import BaseTable, { BaseTableProps } from "./BaseTable";
import { csvSafe } from "./csvSafe";

type Row = { name: string; count: number };

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "count", header: "Count" },
];

const rows: Row[] = Array.from({ length: 20 }, (_, i) => ({
  name: `Row ${String(i).padStart(2, "0")}`,
  count: i,
}));

const renderTable = (props: Partial<BaseTableProps<Row>> = {}) =>
  render(
    <MemoryRouter>
      <BaseTable columns={columns} data={rows} {...props} />
    </MemoryRouter>,
  );

describe("BaseTable", () => {
  it("renders a header per column and one row per page (defaulting to a 15-row page size)", () => {
    renderTable();

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(
      // 2 header rows (labels + filters) + 15 data rows
      2 + 15,
    );
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });

  it("sorts by a column when its header is clicked, cycling asc -> desc", () => {
    renderTable();

    const nameHeader = screen.getByText("Name");
    fireEvent.click(nameHeader);

    const firstRowCells = within(screen.getAllByRole("row")[2]).getAllByRole("cell");
    expect(firstRowCells[0]).toHaveTextContent("Row 00");

    fireEvent.click(nameHeader);
    const firstRowCellsDesc = within(screen.getAllByRole("row")[2]).getAllByRole("cell");
    expect(firstRowCellsDesc[0]).toHaveTextContent("Row 19");
  });

  it("navigates pages and disables prev/first on the first page, next/last on the last", () => {
    renderTable();

    const [firstPage, prevPage, nextPage, lastPage] = screen
      .getAllByRole("button")
      .filter((b) =>
        ["fa-angle-double-left", "fa-caret-left", "fa-caret-right", "fa-angle-double-right"].some(
          (cls) => b.querySelector(`.${cls}`),
        ),
      );

    expect(firstPage).toBeDisabled();
    expect(prevPage).toBeDisabled();
    expect(nextPage).not.toBeDisabled();
    expect(lastPage).not.toBeDisabled();

    fireEvent.click(lastPage);
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
    expect(nextPage).toBeDisabled();
    expect(lastPage).toBeDisabled();

    fireEvent.click(firstPage);
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });

  it("changes page size via the dropdown, including the 'Show All' option", () => {
    renderTable();

    const pageSizeSelect = screen.getByText("Page Size:").nextElementSibling as HTMLSelectElement;
    fireEvent.change(pageSizeSelect, { target: { value: "1000000" } });

    expect(screen.getAllByRole("row")).toHaveLength(2 + rows.length);
    expect(screen.getByText("1 of 1")).toBeInTheDocument();
  });

  it("shows a refreshing indicator while isFetching, and a loaded checkmark otherwise", () => {
    const { container, rerender } = renderTable({ isFetching: true });
    expect(container.querySelector(".fa-sync")).toBeInTheDocument();
    expect(container.querySelector(".fa-check-circle")).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <BaseTable columns={columns} data={rows} isFetching={false} />
      </MemoryRouter>,
    );
    expect(container.querySelector(".fa-check-circle")).toBeInTheDocument();
  });

  it("renders the current page's row count and JSON state when debugTable is set", () => {
    renderTable({ debugTable: true });
    // getRowModel().rows is the *paginated* row model, so this is the page
    // size (15), not the full 20-row dataset.
    expect(screen.getByText("15 Rows")).toBeInTheDocument();
  });

  describe("CSV export", () => {
    let createObjectURL: ReturnType<typeof vi.fn>;
    let revokeObjectURL: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      createObjectURL = vi.fn(() => "blob:mock-url");
      revokeObjectURL = vi.fn();
      // jsdom doesn't implement these - BaseTable's export button calls them
      // directly to build a downloadable link.
      (URL as unknown as { createObjectURL: typeof createObjectURL }).createObjectURL =
        createObjectURL;
      (URL as unknown as { revokeObjectURL: typeof revokeObjectURL }).revokeObjectURL =
        revokeObjectURL;
      // The export flow programmatically clicks a real `blob:` anchor link -
      // jsdom logs a "navigation to another Document" warning trying to
      // follow it, which this stub avoids without changing what's asserted.
      vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("builds a CSV blob and clicks a download link when 'Export Table to CSV' is clicked", () => {
      renderTable();

      fireEvent.click(screen.getByText("Export Table to CSV"));

      expect(createObjectURL).toHaveBeenCalledTimes(1);
      const blob = createObjectURL.mock.calls[0][0] as Blob;
      expect(blob.type).toBe("text/csv;charset=utf8;");
    });

    const exportedCsv = async () => {
      fireEvent.click(screen.getByText("Export Table to CSV"));
      return (createObjectURL.mock.calls[0][0] as Blob).text();
    };

    it("escapes player-written text that a spreadsheet would run as a formula", async () => {
      renderTable({
        data: [
          { name: '=HYPERLINK("http://evil","click")', count: -5 },
          { name: "@SUM(A1)", count: 1 },
          { name: "+cmd", count: 2 },
          { name: "-1+2", count: 3 },
          { name: "Plain name", count: 4 },
        ],
      });

      const csv = await exportedCsv();

      expect(csv).toContain(`"'=HYPERLINK(""http://evil"",""click"")",-5`);
      expect(csv).toContain("'@SUM(A1),1");
      expect(csv).toContain("'+cmd,2");
      expect(csv).toContain("'-1+2,3");
      expect(csv).toContain("Plain name,4");
    });

    it("uses the column id as the header when the header is rendered by a function", async () => {
      renderTable({
        columns: [
          { accessorKey: "name", header: () => <span>Name</span> },
          { id: "doubled", accessorFn: (r) => r.count * 2, header: () => <span>Doubled</span> },
        ],
        data: [{ name: "a", count: 2 }],
      });

      const csv = await exportedCsv();

      expect(csv.split("\n")[0]).toBe("name,doubled");
      expect(csv).toContain("a,4");
    });

    it("frees the download's object URL afterwards", () => {
      vi.useFakeTimers();
      renderTable();

      fireEvent.click(screen.getByText("Export Table to CSV"));
      expect(revokeObjectURL).not.toHaveBeenCalled();
      vi.runAllTimers();

      expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
      vi.useRealTimers();
    });
  });

  describe("csvSafe", () => {
    it("leaves numbers and numeric strings alone", () => {
      expect(csvSafe(-5)).toBe(-5);
      expect(csvSafe("-5")).toBe("-5");
      expect(csvSafe("+1.5")).toBe("+1.5");
      expect(csvSafe(null)).toBe(null);
    });

    it("escapes tab and carriage return prefixes too", () => {
      expect(csvSafe("\t=1")).toBe("'\t=1");
      expect(csvSafe("\r=1")).toBe("'\r=1");
    });
  });
});
