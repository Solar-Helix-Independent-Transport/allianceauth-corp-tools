import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import StarbaseModalTable from "./StarbaseModalTable";
import { StarbaseSpaceItem } from "./StarbaseTypes";

const renderTable = (data: StarbaseSpaceItem[], isFetching = false, header?: string) =>
  render(
    <MemoryRouter>
      <StarbaseModalTable data={data} header={header} isFetching={isFetching} />
    </MemoryRouter>,
  );

describe("StarbaseModalTable", () => {
  it("renders the header and a row per fitting item with a compact-formatted distance", () => {
    renderTable(
      [{ type: { id: 4247, name: "Warp Disruptor" }, distance: 12500 }],
      false,
      "Fittings",
    );

    expect(screen.getByText("Fittings")).toBeInTheDocument();
    expect(screen.getByText("Warp Disruptor")).toBeInTheDocument();
    // Rendered as two adjacent text nodes ("12.5K" then a literal "m"), not
    // one string, so match on the cell's combined text content instead.
    const distanceCell = screen.getByText("Warp Disruptor").closest("tr")!.lastElementChild!;
    expect(distanceCell).toHaveTextContent("12.5Km");
  });

  it("renders nothing when data is empty", () => {
    const { container } = renderTable([], false, "Fittings");
    expect(screen.queryByText("Fittings")).not.toBeInTheDocument();
    expect(container.querySelector("table")).not.toBeInTheDocument();
  });
});
