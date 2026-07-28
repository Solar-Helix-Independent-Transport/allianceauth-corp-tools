import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { loadAssetContents } from "../../api/character";
import CharacterAssetModal from "./CharacterAssetContents";

vi.mock("../../api/character", () => ({
  loadAssetContents: vi.fn(),
}));

const item = {
  id: 55,
  item: { id: 34, name: "Tritanium" },
  quantity: 1,
  character: { character_id: 42, character_name: "Test", corporation_id: 1, corporation_name: "" },
};

const renderModal = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/audit/r/42/assets"]}>
        <Routes>
          <Route path="/audit/r/:characterID/*" element={<CharacterAssetModal item={item} />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("CharacterAssetModal", () => {
  it("does not fetch contents until the modal is opened", () => {
    renderModal();
    expect(loadAssetContents).not.toHaveBeenCalled();
  });

  it("fetches and shows the asset's contents once opened", async () => {
    vi.mocked(loadAssetContents).mockResolvedValue([
      {
        id: 2,
        item: { id: 1, name: "Widget" },
        quantity: 3,
        location: { id: 1, name: "Hold" },
        character: item.character,
      },
    ]);

    renderModal();
    fireEvent.click(screen.getByText("Show Contents"));

    // loadAssetContents is called with the *asset item's own* id (55), not
    // its item-type id (34) - the modal fetches the contents of this
    // specific inventory item, not a lookup by EVE type.
    expect(loadAssetContents).toHaveBeenCalledWith(42, 55);
    expect(await screen.findByText("Widget")).toBeInTheDocument();
    expect(screen.getAllByText("Tritanium").length).toBeGreaterThan(0);
  });
});
