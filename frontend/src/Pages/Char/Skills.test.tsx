import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import {
  getCharacterSkillQueues,
  getCharacterSkills,
  loadCharacterStatus,
} from "../../api/character";
import CharacterSkills from "./Skills";

vi.mock("../../api/character", () => ({
  getCharacterSkills: vi.fn(),
  getCharacterSkillQueues: vi.fn(),
  loadCharacterStatus: vi.fn(),
}));

// Stubbed so tests can assert which character actually ended up loaded,
// independent of Character Select's own display (which always shows the
// main character first regardless of what char_id currently resolves to).
vi.mock("../../Components/Graphs/SkillGroups", () => ({
  SkillsRadarGraph: ({ characterID }: { characterID: number }) => (
    <div data-testid="radar-character-id">{characterID}</div>
  ),
}));

const character = (id: number, name: string) => ({
  character_name: name,
  character_id: id,
  corporation_id: 1,
  corporation_name: "Test Corp",
});

const renderPage = (id = "2") => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/${id}`]}>
        <Routes>
          <Route path="/:characterID" element={<CharacterSkills />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("CharacterSkills", () => {
  it("lists the main character first in Character Select, then the rest alphabetically", async () => {
    vi.mocked(getCharacterSkills).mockResolvedValue([
      { character: character(3, "Zulu Char"), skills: [], total_sp: 0, unallocated_sp: 0 },
      { character: character(1, "Alpha Char"), skills: [], total_sp: 0, unallocated_sp: 0 },
      { character: character(2, "Beta Char"), skills: [], total_sp: 0, unallocated_sp: 0 },
    ]);
    vi.mocked(getCharacterSkillQueues).mockResolvedValue([]);
    vi.mocked(loadCharacterStatus).mockResolvedValue({
      characters: [],
      main: character(2, "Beta Char"),
    } as never);

    renderPage();

    const label = await screen.findByText("Character Select:");
    const select = label.parentElement?.nextElementSibling as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map((o) => o.textContent);
    expect(optionLabels).toEqual(["Beta Char", "Alpha Char", "Zulu Char"]);
  });

  it("resolves the generic char_id=0 entry to the main character, even when the skills query resolves before the status query", async () => {
    vi.mocked(getCharacterSkills).mockResolvedValue([
      { character: character(3, "Zulu Char"), skills: [], total_sp: 0, unallocated_sp: 0 },
      { character: character(1, "Alpha Char"), skills: [], total_sp: 0, unallocated_sp: 0 },
      { character: character(2, "Beta Char"), skills: [], total_sp: 0, unallocated_sp: 0 },
    ]);
    vi.mocked(getCharacterSkillQueues).mockResolvedValue([]);
    // Deliberately resolves after the skills query, to reproduce the real
    // race - the resolved default must still be the main character (Beta),
    // not data[0] (Zulu, whatever order the skills endpoint happens to use).
    vi.mocked(loadCharacterStatus).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ characters: [], main: character(2, "Beta Char") } as never),
            20,
          ),
        ),
    );

    renderPage("0");

    expect(await screen.findByTestId("radar-character-id")).toHaveTextContent("2");
  });
});
