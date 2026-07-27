import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CharacterContractModalTable from "./CharacterContractModalTable";

const renderTable = (data: unknown[], header?: string) =>
  render(
    <MemoryRouter>
      <CharacterContractModalTable data={data} header={header} />
    </MemoryRouter>,
  );

describe("CharacterContractModalTable", () => {
  it("renders the header and a table row per item when there is data", () => {
    renderTable([{ type_name: "Tritanium", quantity: 100 }], "Items Included");

    expect(screen.getByText("Items Included")).toBeInTheDocument();
    expect(screen.getByText("Tritanium")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders nothing when data is empty", () => {
    const { container } = renderTable([], "Items Included");
    expect(screen.queryByText("Items Included")).not.toBeInTheDocument();
    expect(container.querySelector("table")).not.toBeInTheDocument();
  });
});
