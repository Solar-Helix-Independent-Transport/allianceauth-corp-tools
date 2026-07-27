import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AssetGroups } from "./AssetGroups";

describe("AssetGroups", () => {
  it("renders one card per group with its items and formatted counts", () => {
    const data = [
      {
        name: "Ships",
        items: [
          { label: "Rifter", value: 3 },
          { label: "Merlin", value: 1234 },
        ],
      },
      { name: "Modules", items: [{ label: "Afterburner", value: 2 }] },
    ];

    render(<AssetGroups data={data} />);

    expect(screen.getByText("Ships")).toBeInTheDocument();
    expect(screen.getByText("Modules")).toBeInTheDocument();
    expect(screen.getByText("Rifter")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("renders nothing when data is empty", () => {
    const { container } = render(<AssetGroups data={[]} />);
    expect(container.querySelectorAll(".card")).toHaveLength(0);
  });
});
