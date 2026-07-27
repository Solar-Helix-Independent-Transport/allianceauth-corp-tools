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
          active: true,
          character: { character_id: 1, character_name: "Test Character", corporation_id: 2 },
          history: [
            { start: "2020-01-01T00:00:00Z", corporation: { corporation_name: "Old Corp" } },
          ],
        },
        {
          active: false,
          character: { character_id: 3, character_name: "Other Character", corporation_id: 4 },
          history: [],
        },
      ],
    };

    render(<CharacterPubDataPanels isFetching={false} data={data} />);

    expect(screen.getByText("Test Character")).toBeInTheDocument();
    expect(screen.getByText("Other Character")).toBeInTheDocument();
    expect(screen.getByText("Old Corp")).toBeInTheDocument();
  });

  it("borders inactive characters differently from active ones", () => {
    const data = {
      characters: [
        {
          active: true,
          character: { character_id: 1, character_name: "Active Guy", corporation_id: 2 },
          history: [],
        },
        {
          active: false,
          character: { character_id: 3, character_name: "Inactive Guy", corporation_id: 4 },
          history: [],
        },
      ],
    };

    const { container } = render(<CharacterPubDataPanels isFetching={false} data={data} />);

    expect(container.querySelector(".border-success")).toBeInTheDocument();
    expect(container.querySelector(".border-warning")).toBeInTheDocument();
  });
});
