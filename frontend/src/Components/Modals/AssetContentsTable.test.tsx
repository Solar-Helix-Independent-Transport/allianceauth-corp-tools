import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import AssetContentsTable, { AssetContentItem } from "./AssetContentsTable";

const renderTable = (data: AssetContentItem[], isFetching = false, header?: string) =>
  render(
    <MemoryRouter>
      <AssetContentsTable data={data} header={header} isFetching={isFetching} />
    </MemoryRouter>,
  );

describe("AssetContentsTable", () => {
  it("renders the header and a row per item with a formatted quantity and its location", () => {
    renderTable(
      [
        {
          id: 1,
          item: { id: 34, name: "Tritanium" },
          quantity: 25000,
          location: { id: 60003760, name: "Cargo Hold" },
        },
      ],
      false,
      "Contents",
    );

    expect(screen.getByText("Contents")).toBeInTheDocument();
    expect(screen.getByText("Tritanium")).toBeInTheDocument();
    expect(screen.getByText("25,000")).toBeInTheDocument();
    expect(screen.getByText("Cargo Hold")).toBeInTheDocument();
  });

  it("renders nothing when data is empty", () => {
    const { container } = renderTable([], false, "Contents");
    expect(screen.queryByText("Contents")).not.toBeInTheDocument();
    expect(container.querySelector("table")).not.toBeInTheDocument();
  });
});
