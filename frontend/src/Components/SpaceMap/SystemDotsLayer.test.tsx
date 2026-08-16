import { render } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import SystemDotsLayer from "./SystemDotsLayer";
import type { MapDot } from "./types";

describe("SystemDotsLayer", () => {
  it("renders a non-interactive canvas without throwing, even with no 2d context available", () => {
    const dots: MapDot[] = [
      { id: "1", x: 0, y: 0, radius: 5, color: "red", name: "Jita" },
      { id: "2", x: 100, y: 100, radius: 5, color: "blue", name: "Amarr" },
    ];

    const { container } = render(
      <ReactFlowProvider>
        <SystemDotsLayer dots={dots} />
      </ReactFlowProvider>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle({ pointerEvents: "none" });
  });
});
