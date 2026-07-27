import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectFilter } from "./SelectFilter";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("SelectFilter", () => {
  it("renders the label text and the default-selected option", () => {
    render(<SelectFilter setFilter={() => {}} options={options} labelText="Filter by" />);

    expect(screen.getByText("Filter by")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("calls setFilter with the selected option's value when changed", () => {
    const setFilter = vi.fn();
    render(<SelectFilter setFilter={setFilter} options={options} labelText="Filter by" />);

    // react-select renders a hidden native <input> for its combobox; open it
    // and choose the second option via keyboard, the standard way to drive
    // react-select in tests without reaching into its internal DOM. The
    // first ArrowDown only opens the menu (defaultValue - option A - starts
    // focused), so a second ArrowDown is what actually moves focus to B.
    const input = screen.getByRole("combobox", { hidden: true }) ?? document.querySelector("input");
    fireEvent.keyDown(input!, { key: "ArrowDown" });
    fireEvent.keyDown(input!, { key: "ArrowDown" });
    fireEvent.keyDown(input!, { key: "Enter" });

    expect(setFilter).toHaveBeenCalledWith("b");
  });
});
