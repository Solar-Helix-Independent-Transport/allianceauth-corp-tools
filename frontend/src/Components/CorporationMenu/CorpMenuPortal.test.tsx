import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CorpMenuPortal } from "./CorpMenuPortal";

// `menuRoot` is resolved once, at module import time, from
// document.getElementById("nav-left") - the test environment never has that
// element (it's injected by the surrounding Django page in production), so
// this only ever exercises the "nothing to portal into" branch.
describe("CorpMenuPortal", () => {
  it("renders nothing when there is no #nav-left element to portal into", () => {
    const { container } = render(<CorpMenuPortal />);
    expect(container).toBeEmptyDOMElement();
  });
});
