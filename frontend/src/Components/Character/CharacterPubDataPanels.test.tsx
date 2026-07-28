import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CharacterPubDataPanels from "./CharacterPubDataPanels";

describe("CharacterPubDataPanels", () => {
  it("shows a loading panel when there is no data", () => {
    render(<CharacterPubDataPanels isFetching data={undefined} />);
    expect(document.querySelector("h3")).toBeInTheDocument();
  });

  it("renders a portrait card per character with their corp history", () => {
    const data = {
      characters: [
        {
          character: {
            character_id: 1,
            character_name: "Test Character",
            corporation_id: 2,
            corporation_name: "Test Corp",
          },
          history: [
            {
              start: "2020-01-01T00:00:00Z",
              corporation: { corporation_id: 5, corporation_name: "Old Corp" },
            },
          ],
        },
        {
          character: {
            character_id: 3,
            character_name: "Other Character",
            corporation_id: 4,
            corporation_name: "Other Corp",
          },
          history: [],
        },
      ],
    };

    render(<CharacterPubDataPanels isFetching={false} data={data} />);

    expect(screen.getByText("Test Character")).toBeInTheDocument();
    expect(screen.getByText("Other Character")).toBeInTheDocument();
    expect(screen.getByText("Old Corp")).toBeInTheDocument();
  });

  it("always borders panels as 'warning' - CharacterHistory has no active field to vary on", () => {
    const data = {
      characters: [
        {
          character: {
            character_id: 1,
            character_name: "Some Guy",
            corporation_id: 2,
            corporation_name: "Some Corp",
          },
          history: [],
        },
      ],
    };

    const { container } = render(<CharacterPubDataPanels isFetching={false} data={data} />);

    expect(container.querySelector(".border-warning")).toBeInTheDocument();
    expect(container.querySelector(".border-success")).not.toBeInTheDocument();
  });
});
