import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RegionLabelNode from "./RegionLabelNode";

describe("RegionLabelNode", () => {
  it("renders nothing on the canvas - it only exists so the MiniMap has a node to hang a label off of", () => {
    const { container } = render(<RegionLabelNode />);
    expect(container).toBeEmptyDOMElement();
  });
});
