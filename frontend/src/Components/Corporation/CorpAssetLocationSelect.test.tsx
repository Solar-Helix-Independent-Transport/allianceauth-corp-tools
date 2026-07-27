import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { loadAssetLocations } from "../../api/corporation";
import CorporationAssetLocationSelect from "./CorpAssetLocationSelect";

vi.mock("../../api/corporation", () => ({
  loadAssetLocations: vi.fn(),
}));

const renderSelect = (setLocation = vi.fn()) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return {
    setLocation,
    ...render(
      <QueryClientProvider client={queryClient}>
        <CorporationAssetLocationSelect corporationID={5} setLocation={setLocation} />
      </QueryClientProvider>,
    ),
  };
};

describe("CorporationAssetLocationSelect", () => {
  it("auto-selects the first location once loaded and reports it via setLocation", async () => {
    vi.mocked(loadAssetLocations).mockResolvedValue([
      { value: 100, label: "Jita IV - Moon 4" },
      { value: 200, label: "Amarr VIII" },
    ]);
    const { setLocation } = renderSelect();

    expect(loadAssetLocations).toHaveBeenCalledWith(5);

    await screen.findByText("Jita IV - Moon 4");
    expect(setLocation).toHaveBeenCalledWith(100);
  });

  it("is disabled when there is no corporationID", () => {
    vi.mocked(loadAssetLocations).mockResolvedValue([]);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <CorporationAssetLocationSelect corporationID={0} setLocation={vi.fn()} />
      </QueryClientProvider>,
    );

    expect(document.querySelector("input")).toBeDisabled();
  });
});
