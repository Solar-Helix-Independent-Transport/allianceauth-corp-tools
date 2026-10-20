import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { ColumnDef } from "@tanstack/react-table";
import BaseTable from "./BaseTable";

type Row = { name: string; active: boolean; online: boolean };

const rows: Row[] = [
  { name: "a", active: true, online: false },
  { name: "b", active: false, online: true },
];

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "active", header: "Active" },
  { accessorKey: "online", header: "Online" },
];

const renderTable = (isFetching = false) => {
  const view = (fetching: boolean) => (
    <MemoryRouter>
      <BaseTable columns={columns} data={rows} isFetching={fetching} />
    </MemoryRouter>
  );
  const result = render(view(isFetching));
  return { ...result, setFetching: (f: boolean) => result.rerender(view(f)) };
};

const hoverLoaded = async (container: HTMLElement) => {
  fireEvent.mouseOver(container.querySelector(".fa-check-circle")!.closest("button")!);
  return screen.findByRole("tooltip");
};

describe("BaseTable data loaded time", () => {
  it("shows when the fetch finished, not when the table last rendered", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2026-01-01T10:00:00"));
    const { container, setFetching } = renderTable(true);
    setFetching(false);

    vi.setSystemTime(new Date("2026-01-01T12:00:00"));
    setFetching(false); // a later re-render, with no new fetch

    const tooltip = await hoverLoaded(container);
    expect(tooltip).toHaveTextContent(new Date("2026-01-01T10:00:00").toLocaleString());
    vi.useRealTimers();
  });

  it("shows no time for a table that never fetched", async () => {
    const { container } = renderTable(false);

    const tooltip = await hoverLoaded(container);
    expect(tooltip.textContent?.trim()).toBe("Data Loaded");
  });
});

describe("BoolFilter", () => {
  // the bool filters are the read-only inputs; the name column's isn't
  const boolInputs = () =>
    screen.getAllByRole("textbox").filter((i) => (i as HTMLInputElement).readOnly);
  // clicking a filter toggles its popover; wait out the fade so only one
  // popover's radios are on the page
  const toggleFilter = async (index: number, open: boolean) => {
    await act(async () => fireEvent.click(boolInputs()[index]));
    await waitFor(() => expect(document.querySelectorAll(".popover")).toHaveLength(open ? 1 : 0));
  };

  it("shows the current value when reopened", async () => {
    renderTable();
    await toggleFilter(0, true);
    fireEvent.click(screen.getByLabelText("True"));
    await toggleFilter(0, false);

    await toggleFilter(0, true);
    expect(screen.getByLabelText("True")).toBeChecked();
    expect(screen.getByLabelText("False")).not.toBeChecked();
  });

  it("gives each column's radios their own ids and group", async () => {
    renderTable();
    await toggleFilter(0, true);
    const first = screen.getByLabelText("True") as HTMLInputElement;
    const [firstId, firstName] = [first.id, first.name];
    await toggleFilter(0, false);

    await toggleFilter(1, true);
    const second = screen.getByLabelText("True") as HTMLInputElement;
    expect(second.id).not.toBe(firstId);
    expect(second.name).not.toBe(firstName);
  });
});
