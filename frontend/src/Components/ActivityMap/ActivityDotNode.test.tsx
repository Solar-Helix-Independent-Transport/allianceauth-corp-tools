import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NodeProps } from "@xyflow/react";
import { ActivityDotNode } from "./ActivityDotNode";
import type { ActivityMapSystem, ActivityNodeData } from "./types";

const makeSystem = (overrides: Partial<ActivityMapSystem> = {}): ActivityMapSystem => ({
  id: 1,
  name: "Amarr",
  region_id: 1,
  constellation_id: 1,
  x_2d: 0,
  y_2d: 0,
  x_real: 0,
  y_real: 0,
  security_status: 1,
  security_class: "A",
  external: false,
  ...overrides,
});

// ActivityDotNode only ever reads `data` off the NodeProps it's given, so a
// minimal stand-in for the rest of NodeProps is enough here.
const makeNodeProps = (data: ActivityNodeData): NodeProps & { data: ActivityNodeData } =>
  ({ id: "1", data }) as unknown as NodeProps & { data: ActivityNodeData };

describe("ActivityDotNode", () => {
  it("renders a DotVisual sized and colored from its node data, without a border", () => {
    const data: ActivityNodeData = {
      system: makeSystem({ name: "Amarr" }),
      color: "red",
      radius: 30,
      value: 10,
      count: 1,
      quantity: 2,
    };

    const { container } = render(<ActivityDotNode {...makeNodeProps(data)} />);

    const dot = container.querySelector("[title='Amarr']") as HTMLElement;
    expect(dot).toBeInTheDocument();
    expect(dot.style.width).toBe("60px");
    expect(dot.style.height).toBe("60px");
    expect(dot.style.background).toBe("red");
    expect(dot.style.borderStyle).toBe("none");
    expect(screen.getByText("Amarr")).toBeInTheDocument();
  });
});
