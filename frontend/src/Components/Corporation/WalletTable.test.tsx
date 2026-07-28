import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { loadWallet } from "../../api/corporation";
import CorporationWalletTable from "./WalletTable";

vi.mock("../../api/corporation", () => ({
  loadWallet: vi.fn(),
}));

describe("CorporationWalletTable", () => {
  it("fetches the wallet with the given corporationID/refTypes and renders it as a table", async () => {
    vi.mocked(loadWallet).mockResolvedValue([
      {
        id: 1,
        date: "2024-01-01",
        ref_type: "bounty_prizes",
        division: "1",
        first_party: { id: 1, name: "NPC" },
        second_party: { id: 2, name: "Test Character" },
        amount: 1000000,
        balance: 5000000,
        reason: "",
      },
    ]);

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CorporationWalletTable corporationID={7} refTypes="bounty_prizes" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(loadWallet).toHaveBeenCalledWith(7, "bounty_prizes", 1);
    expect(await screen.findByText("bounty prizes")).toBeInTheDocument();
    expect(screen.getByText("Test Character")).toBeInTheDocument();
    expect(screen.getByText("1,000,000")).toBeInTheDocument();
  });
});
