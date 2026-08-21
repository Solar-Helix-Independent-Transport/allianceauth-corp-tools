import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NativeSelectFilter } from "./NativeSelectFilter";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("NativeSelectFilter", () => {
  it("renders the label text and the default-selected option", () => {
    render(<NativeSelectFilter setFilter={() => {}} options={options} labelText="Filter by" />);

    expect(screen.getByText("Filter by")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("0");
  });

  it("calls setFilter with the selected option's value when changed", () => {
    const setFilter = vi.fn();
    render(<NativeSelectFilter setFilter={setFilter} options={options} labelText="Filter by" />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    expect(setFilter).toHaveBeenCalledWith("b");
  });
});
