import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextFilter } from "./TextFilter";

describe("TextFilter", () => {
  it("renders the label and calls setFilterText as the input changes", () => {
    const setFilterText = vi.fn();
    render(<TextFilter setFilterText={setFilterText} labelText="Search" />);

    expect(screen.getByText("Search")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "abc" } });

    expect(setFilterText).toHaveBeenCalledWith("abc");
  });
});
