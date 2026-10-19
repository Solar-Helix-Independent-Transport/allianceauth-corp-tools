import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ColumnDef } from "@tanstack/react-table";
import BaseTable from "./BaseTable";
import { MAX_SELECT_OPTIONS } from "./BaseTableFilter";
import { FILTER_DEBOUNCE_MS } from "./useDebouncedFilter";

type Row = { name: string; tags: { name: string }[] };

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  // an object column gets the plain TextFilter
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (c) => (c.getValue() as Row["tags"]).map((t) => t.name).join(","),
    filterFn: (row, id, value: string) =>
      (row.getValue(id) as Row["tags"]).some((t) => t.name.includes(value)),
  },
];

// more unique names than the dropdown shows
const data: Row[] = Array.from({ length: MAX_SELECT_OPTIONS + 50 }, (_, i) => ({
  name: `Item ${String(i).padStart(3, "0")}`,
  tags: [{ name: i % 2 ? "odd" : "even" }],
}));

const renderTable = () =>
  render(
    <MemoryRouter>
      <BaseTable columns={columns} data={data} />
    </MemoryRouter>,
  );

const bodyRows = () => document.querySelectorAll("tbody tr").length;
const [selectInput, textInput] = [0, 1].map(
  (i) => () => screen.getAllByPlaceholderText("Search")[i] as HTMLInputElement,
);

describe("BaseTable filter performance", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("only filters the table once typing pauses", () => {
    renderTable();
    expect(bodyRows()).toBe(15);

    fireEvent.change(textInput(), { target: { value: "od" } });
    fireEvent.change(textInput(), { target: { value: "odd" } });
    // the box shows the text at once, the table hasn't refiltered yet
    expect(textInput().value).toBe("odd");
    act(() => vi.advanceTimersByTime(FILTER_DEBOUNCE_MS - 1));
    expect(screen.getAllByRole("row").some((r) => r.textContent?.includes("even"))).toBe(true);

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getAllByRole("row").some((r) => r.textContent?.includes("even"))).toBe(false);
  });

  it("clears the text box and the filter straight away", () => {
    renderTable();
    fireEvent.change(textInput(), { target: { value: "odd" } });
    act(() => vi.advanceTimersByTime(FILTER_DEBOUNCE_MS));

    const clear = textInput().parentElement!.querySelector("button")!;
    fireEvent.click(clear);

    expect(textInput().value).toBe("");
    expect(screen.getAllByRole("row").some((r) => r.textContent?.includes("even"))).toBe(true);
  });

  it("caps the select dropdown and says how many more there are", () => {
    renderTable();
    fireEvent.click(selectInput());

    expect(document.querySelectorAll(".dropdown-item:not(.disabled)")).toHaveLength(
      MAX_SELECT_OPTIONS,
    );
    expect(screen.getByText("50 more, keep typing to narrow down.")).toBeInTheDocument();
  });

  it("narrows the select dropdown by what's typed", () => {
    renderTable();
    fireEvent.click(selectInput());
    fireEvent.focus(selectInput());
    fireEvent.change(selectInput(), { target: { value: "item 12" } });

    const items = Array.from(document.querySelectorAll(".dropdown-item")).map((e) => e.textContent);
    expect(items).toEqual(Array.from({ length: 10 }, (_, i) => `Item 12${i}`));
  });
});
