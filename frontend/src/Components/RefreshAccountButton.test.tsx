import { fireEvent, render, screen } from "@testing-library/react";
import { ApiError } from "../api/Api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { postAccountRefresh } from "../api/character";
import { RefreshCharButton } from "./RefreshAccountButton";

vi.mock("../api/character", () => ({
  postAccountRefresh: vi.fn(),
}));

const renderButton = () => {
  const queryClient = new QueryClient();
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
  beforeEach(() => {
    vi.mocked(postAccountRefresh).mockReset();
  });

  it("does nothing until clicked", () => {
    renderButton();
    expect(postAccountRefresh).not.toHaveBeenCalled();
  });

  it("calls postAccountRefresh with the characterID route param when clicked", async () => {
    vi.mocked(postAccountRefresh).mockResolvedValue({ message: "Requested Update!" });

    renderButton();
    fireEvent.click(screen.getByRole("button"));

    await vi.waitFor(() => expect(postAccountRefresh).toHaveBeenCalledWith(7));
  });

  it("posts once per click, with no retries when it fails", async () => {
    vi.mocked(postAccountRefresh).mockRejectedValue(
      new ApiError(new Response(null, { status: 500 }), undefined),
    );

    renderButton();
    const button = screen.getByRole("button");
    fireEvent.click(button);

    await vi.waitFor(() => expect(button).toHaveClass("btn-danger"));
    expect(postAccountRefresh).toHaveBeenCalledTimes(1);
  });

  it("is disabled and spinning while the refresh is in flight", async () => {
    vi.mocked(postAccountRefresh).mockReturnValue(new Promise(() => {}));

    renderButton();
    const button = screen.getByRole("button");
    fireEvent.click(button);

    await vi.waitFor(() => expect(button).toBeDisabled());
    expect(button.querySelector("i")?.className).not.toContain("false");
  });

  it("has no stray class when idle", () => {
    renderButton();
    expect(screen.getByRole("button").querySelector("i")?.className).not.toContain("false");
  });
});
