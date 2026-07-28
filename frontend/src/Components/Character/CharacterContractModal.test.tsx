import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import CharacterContractModal from "./CharacterContractModal";
import { postContractItemsRefresh } from "../../api/character";
import { components } from "../../api/CtApi";

vi.mock("../../api/character", () => ({
  postContractItemsRefresh: vi.fn(),
}));

const renderModal = (data: components["schemas"]["CharacterContract"] | null) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <CharacterContractModal data={data} shown setShown={() => {}} characterID={42} />
    </QueryClientProvider>,
  );
};

const baseContract: components["schemas"]["CharacterContract"] = {
  character: "Some Character",
  contract: 555,
  items: [],
  contract_type: "item_exchange",
  days_to_complete: 0,
  collateral: 0,
  buyout: 0,
  price: 0,
  reward: 0,
  volume: 0,
  status: "outstanding",
  for_corporation: false,
  own_account: false,
};

describe("CharacterContractModal repull items button", () => {
  it("calls postContractItemsRefresh with the character and contract id", async () => {
    vi.mocked(postContractItemsRefresh).mockResolvedValue({ message: "Requested Update!" });
    renderModal(baseContract);

    fireEvent.click(screen.getByRole("button", { name: /Repull Items/i }));

    await waitFor(() => {
      expect(postContractItemsRefresh).toHaveBeenCalledWith(42, 555);
    });
  });

  it("disables the button while there is no contract loaded", () => {
    renderModal(null);
    expect(screen.getByRole("button", { name: /Repull Items/i })).toBeDisabled();
  });
});
