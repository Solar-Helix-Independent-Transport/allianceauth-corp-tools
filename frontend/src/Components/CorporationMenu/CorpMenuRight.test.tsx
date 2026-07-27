import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { CorpMenuRight } from "./CorpMenuRight";

// Same story as CharMenuRight: no #nav-right in the test DOM means
// `innerHtmlEmptied` never becomes true, so this always renders null.
describe("CorpMenuRight", () => {
  it("renders nothing when there is no #nav-right element to portal into", () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CorpMenuRight />
      </QueryClientProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
