import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { getCharacterRoles } from "../../api/character";
import CharacterRoles from "./Roles";

vi.mock("../../api/character", () => ({
  getCharacterRoles: vi.fn(),
}));

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/42"]}>
        <Routes>
          <Route path="/:characterID" element={<CharacterRoles />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("CharacterRoles", () => {
  it("fetches roles for the characterID route param and renders them in the table", async () => {
    vi.mocked(getCharacterRoles).mockResolvedValue([
      {
        character: {
          character_name: "Test Character",
          character_id: 42,
          corporation_id: 1,
          corporation_name: "Test Corp",
        },
        director: true,
        station_manager: false,
        personnel_manager: false,
        accountant: false,
        titles: [{ id: 1, name: "CEO" }],
      },
    ]);

    renderPage();

    expect(await screen.findByText("Test Character")).toBeInTheDocument();
    expect(screen.getByText("Test Corp")).toBeInTheDocument();
    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(getCharacterRoles).toHaveBeenCalledWith(42);

    // director=true renders a success checkmark button, the rest render the
    // secondary "x" button - BooleanCheckBox's two branches both show here.
    expect(document.querySelector(".btn-success .fa-check")).toBeInTheDocument();
    expect(document.querySelectorAll(".btn-secondary .fa-xmark").length).toBeGreaterThan(0);
  });
});
