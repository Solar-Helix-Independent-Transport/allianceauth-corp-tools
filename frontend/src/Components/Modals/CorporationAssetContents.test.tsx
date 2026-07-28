import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { loadAssetContents } from "../../api/corporation";
import CorporationAssetModal from "./CorporationAssetContents";

vi.mock("../../api/corporation", () => ({
  loadAssetContents: vi.fn(),
}));

const item = { id: 55, item: { id: 34, name: "Tritanium" }, quantity: 1 };

const renderModal = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CorporationAssetModal item={item} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("CorporationAssetModal", () => {
  it("does not fetch contents until the modal is opened", () => {
    renderModal();
    expect(loadAssetContents).not.toHaveBeenCalled();
  });

  it("fetches and shows the asset's contents once opened", async () => {
    vi.mocked(loadAssetContents).mockResolvedValue([
      { id: 2, item: { id: 1, name: "Widget" }, quantity: 3, location: { id: 1, name: "Hold" } },
    ]);

    renderModal();
    fireEvent.click(screen.getByText("Show Contents"));

    // Called with the asset item's own id (55), not its item-type id (34).
    expect(loadAssetContents).toHaveBeenCalledWith(55);
    expect(await screen.findByText("Widget")).toBeInTheDocument();
  });
});
