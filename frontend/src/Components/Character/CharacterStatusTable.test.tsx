import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CharacterStatusTable from "./CharacterStatusTable";

const renderTable = (data: unknown) =>
  render(
    <MemoryRouter>
      <CharacterStatusTable data={data} isFetching={false} />
    </MemoryRouter>,
  );

describe("CharacterStatusTable", () => {
  it("renders a row per character with formatted isk/sp and an active checkmark", () => {
    renderTable({
      characters: [
        {
          character: {
            character_name: "Test Character",
            corporation_name: "Test Corp",
            alliance_name: "Test Alliance",
          },
          last_login: null,
          last_logoff: null,
          total_logins: 42,
          isk: 1234567,
          sp: 9876543,
          active: true,
        },
      ],
    });

    expect(screen.getByText("Test Character")).toBeInTheDocument();
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
    expect(screen.getByText("9,876,543")).toBeInTheDocument();
    // last_login/last_logoff are both null -> "Never" appears for both.
    expect(screen.getAllByText("Never")).toHaveLength(2);
    expect(document.querySelector(".btn-success .fa-check")).toBeInTheDocument();
  });

  it("adds a dynamic column per key in the first character's last_updates", () => {
    renderTable({
      characters: [
        {
          character: { character_name: "Test Character" },
          total_logins: 1,
          active: false,
          last_updates: { assets: "2024-01-01T00:00:00Z", wallet: null },
        },
      ],
    });

    expect(screen.getByText("assets")).toBeInTheDocument();
    expect(screen.getByText("wallet")).toBeInTheDocument();
    expect(document.querySelector(".btn-warning .fa-xmark")).toBeInTheDocument();
  });
});
