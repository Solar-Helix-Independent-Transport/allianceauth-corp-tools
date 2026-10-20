import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Link, MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/Api";
import { createQueryClient } from "../../queryClient";
import PageErrorBoundary from "./PageErrorBoundary";

const httpError = (status: number) => new ApiError(new Response(null, { status }), undefined);

const Page = ({ queryFn }: { queryFn: () => Promise<string> }) => {
  const { data } = useQuery({ queryKey: ["page"], queryFn, retry: false });
  return <div>{data ?? "loading"}</div>;
};

const renderPage = (queryFn: () => Promise<string>, client = createQueryClient()) => {
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/a"]}>
        <Link to="/b">to b</Link>
        <PageErrorBoundary>
          <Routes>
            <Route path="/a" element={<Page queryFn={queryFn} />} />
            <Route path="/b" element={<div>page b</div>} />
          </Routes>
        </PageErrorBoundary>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("PageErrorBoundary with the app's query defaults", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a failed request as an error, not an empty page", async () => {
    renderPage(() => Promise.reject(httpError(500)));
    expect(await screen.findByText("Error 500")).toBeInTheDocument();
    // a request failure isn't a bug report
    expect(screen.queryByText(/report this error/)).not.toBeInTheDocument();
  });

  it("explains a 403", async () => {
    const response = new Response(null, { status: 403 });
    renderPage(() => Promise.reject(new ApiError(response, { detail: "nope" })));
    expect(await screen.findByText("Error 403")).toBeInTheDocument();
    expect(screen.getByText("You do not have permission to view this.")).toBeInTheDocument();
  });

  it("shows a network failure as a connection problem", async () => {
    renderPage(() => Promise.reject(new ApiError(undefined, undefined, "Failed to fetch")));
    expect(await screen.findByText("Connection problem")).toBeInTheDocument();
  });

  it("try again refetches the failed query", async () => {
    const queryFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(httpError(500))
      .mockResolvedValue("loaded");
    renderPage(queryFn);

    await userEvent.click(await screen.findByRole("button", { name: "Try again" }));

    expect(await screen.findByText("loaded")).toBeInTheDocument();
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it("clears when navigating to another page", async () => {
    renderPage(() => Promise.reject(httpError(500)));
    await screen.findByText("Error 500");

    await userEvent.click(screen.getByRole("link", { name: "to b" }));

    expect(await screen.findByText("page b")).toBeInTheDocument();
  });

  it("keeps showing data when only a background refetch fails", async () => {
    const queryFn = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce("loaded")
      .mockRejectedValue(httpError(500));
    const client = createQueryClient();
    const { container } = renderPage(queryFn, client);
    await screen.findByText("loaded");

    await act(() => client.refetchQueries({ queryKey: ["page"] }));

    expect(queryFn).toHaveBeenCalledTimes(2);
    expect(container).toHaveTextContent("loaded");
  });
});
