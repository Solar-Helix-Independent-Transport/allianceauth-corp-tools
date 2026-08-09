import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RegionLabelNode from "./RegionLabelNode";

describe("RegionLabelNode", () => {
  it("renders no visible content - it only exists so the MiniMap has a node to hang a label off of", () => {
    const { container } = render(<RegionLabelNode />);
    expect(container).toHaveTextContent("");
    expect(container.querySelector("svg, img, canvas")).not.toBeInTheDocument();
  });

  it("still renders a real DOM element for xyflow to measure, rather than null", () => {
    // A node type that renders nothing at all leaves xyflow's per-node
    // ResizeObserver measurement unresolved, which can stall
    // useNodesInitialized() forever for maps with many of these (see the
    // comment in RegionLabelNode.tsx).
    const { container } = render(<RegionLabelNode />);
    expect(container.firstChild).not.toBeNull();
  });
});
