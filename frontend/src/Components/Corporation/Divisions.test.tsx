import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { loadDivisions } from "../../api/corporation";
import CorpDivisions from "./Divisions";

vi.mock("../../api/corporation", () => ({
  loadDivisions: vi.fn(),
}));

const renderDivisions = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <CorpDivisions corporationID={1} />
    </QueryClientProvider>,
  );
};

describe("CorpDivisions", () => {
  it("shows 'Divisions Unavailable' once loaded with no divisions", async () => {
    vi.mocked(loadDivisions).mockResolvedValue([]);
    renderDivisions();

    expect(await screen.findByText("Divisions Unavailable")).toBeInTheDocument();
  });

  it("renders a balance badge per division, omitting the name for 'Unknown'", async () => {
    vi.mocked(loadDivisions).mockResolvedValue([
      { division: 1, name: "Master Wallet", balance: 1000.5 },
      { division: 2, name: "Unknown", balance: 50 },
    ]);
    renderDivisions();

    expect(await screen.findByText("1 Master Wallet: 1,000.5 Isk")).toBeInTheDocument();
    expect(screen.getByText("2 : 50 Isk")).toBeInTheDocument();
  });
});
