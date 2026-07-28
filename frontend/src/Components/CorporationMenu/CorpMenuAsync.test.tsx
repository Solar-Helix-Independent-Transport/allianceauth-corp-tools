import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { CorpMenuAsync } from "./CorpMenuAsync";

// Same story as CorpMenuPortal/CharMenuAsync: `menuRoot` is resolved once at
// import time and the test environment never has a #nav-left element, so
// this only ever exercises the "nothing to portal into" branch - regardless
// of the menu query's own state.
describe("CorpMenuAsync", () => {
  it("renders nothing when there is no #nav-left element to portal into", () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CorpMenuAsync />
      </QueryClientProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
