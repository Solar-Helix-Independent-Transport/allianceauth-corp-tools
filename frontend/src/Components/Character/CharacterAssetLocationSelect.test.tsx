import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { loadAssetLocations } from "../../api/character";
import CharacterAssetLocationSelect from "./CharacterAssetLocationSelect";

vi.mock("../../api/character", () => ({
  loadAssetLocations: vi.fn(),
}));

const renderSelect = (setLocation = vi.fn()) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return {
    setLocation,
    ...render(
      <QueryClientProvider client={queryClient}>
        <CharacterAssetLocationSelect characterID={1} setLocation={setLocation} />
      </QueryClientProvider>,
    ),
  };
};

describe("CharacterAssetLocationSelect", () => {
  it("loads locations for the given characterID and calls setLocation when one is chosen", async () => {
    vi.mocked(loadAssetLocations).mockResolvedValue([
      { value: 100, label: "Jita IV - Moon 4" },
      { value: 200, label: "Amarr VIII" },
    ]);
    const { setLocation } = renderSelect();

    expect(loadAssetLocations).toHaveBeenCalledWith(1);

    // react-select only renders option labels once the menu is opened, so
    // there's nothing to find as static text before interacting with it.
    const input = await screen.findByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    await screen.findByText("Jita IV - Moon 4");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(setLocation).toHaveBeenCalledWith(200);
  });
});
