import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NodeProps } from "@xyflow/react";
import { DotNode, DotVisual } from "./DotNode";
import type { DotNodeData } from "./DotNode";

describe("DotVisual", () => {
  it("renders a circle of the given size/color with a title and visible label", () => {
    const { container } = render(<DotVisual radius={10} color="blue" name="Jita" />);

    const circle = container.querySelector("[title='Jita']") as HTMLElement;
    expect(circle.style.width).toBe("20px");
    expect(circle.style.height).toBe("20px");
    expect(circle.style.background).toBe("blue");
    expect(screen.getByText("Jita")).toBeInTheDocument();
  });

  it("defaults to bordered=true", () => {
    const { container } = render(<DotVisual radius={5} color="red" name="Amarr" />);
    const circle = container.querySelector("[title='Amarr']") as HTMLElement;
    expect(circle.style.border).toContain("solid");
  });

  it("renders no border when bordered=false", () => {
    const { container } = render(
      <DotVisual radius={5} color="red" name="Amarr" bordered={false} />,
    );
    const circle = container.querySelector("[title='Amarr']") as HTMLElement;
    expect(circle.style.borderStyle).toBe("none");
  });
});

describe("DotNode", () => {
  it("renders a DotVisual sourced from its node data", () => {
    const data: DotNodeData = { radius: 8, color: "green", name: "Dodixie" };
    const nodeProps = { id: "1", data } as unknown as NodeProps & { data: DotNodeData };

    render(<DotNode {...nodeProps} />);

    expect(screen.getByText("Dodixie")).toBeInTheDocument();
  });
});
