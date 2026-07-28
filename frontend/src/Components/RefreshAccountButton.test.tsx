import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { postAccountRefresh } from "../api/character";
import { RefreshCharButton } from "./RefreshAccountButton";

vi.mock("../api/character", () => ({
  postAccountRefresh: vi.fn(),
}));

const renderButton = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/7"]}>
        <Routes>
          <Route path="/:characterID" element={<RefreshCharButton />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("RefreshCharButton", () => {
  it("does nothing until clicked (the query is disabled by default)", () => {
    renderButton();
    expect(postAccountRefresh).not.toHaveBeenCalled();
  });

  it("calls postAccountRefresh with the characterID route param when clicked", async () => {
    vi.mocked(postAccountRefresh).mockResolvedValue(undefined);

    renderButton();
    fireEvent.click(screen.getByRole("button"));

    await vi.waitFor(() => expect(postAccountRefresh).toHaveBeenCalledWith(7));
  });
});
