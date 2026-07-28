import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import StarbaseModalFuelTable from "./StarbaseModalFuelTable";
import { StarbaseFuelItem } from "./StarbaseTypes";

const renderTable = (data: StarbaseFuelItem[], isFetching = false, header?: string) =>
  render(
    <MemoryRouter>
      <StarbaseModalFuelTable data={data} header={header} isFetching={isFetching} />
    </MemoryRouter>,
  );

describe("StarbaseModalFuelTable", () => {
  it("renders the header and a row per fuel item, with the quantity formatted", () => {
    renderTable([{ id: 4247, name: "Strontium Clathrates", qty: 5000 }], false, "Fuel Bay");

    expect(screen.getByText("Fuel Bay")).toBeInTheDocument();
    expect(screen.getByText("Strontium Clathrates")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
  });

  it("renders nothing when data is empty", () => {
    const { container } = renderTable([], false, "Fuel Bay");
    expect(screen.queryByText("Fuel Bay")).not.toBeInTheDocument();
    expect(container.querySelector("table")).not.toBeInTheDocument();
  });
});
