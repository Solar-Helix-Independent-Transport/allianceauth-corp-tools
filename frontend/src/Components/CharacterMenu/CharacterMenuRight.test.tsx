import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { CharMenuRight } from "./CharacterMenuRight";

// `menuRoot` is resolved once at import time from
// document.getElementById("nav-right"), which the test environment never
// has - so `innerHtmlEmptied` never flips true and the component's very
// first `if (!innerHtmlEmptied) return null` fires unconditionally. The
// `if (!menuRoot) return <></>` fallback right below it is unreachable in
// this environment; this pins down the actual (render `null`) behaviour.
describe("CharMenuRight", () => {
  it("renders nothing when there is no #nav-right element to portal into", () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CharMenuRight />
      </QueryClientProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
