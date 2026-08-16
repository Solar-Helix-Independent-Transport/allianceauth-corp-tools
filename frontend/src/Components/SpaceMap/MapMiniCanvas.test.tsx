import { createRef } from "react";
import { fireEvent, render } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import MapMiniCanvas from "./MapMiniCanvas";
import type { MapDot } from "./types";

describe("MapMiniCanvas", () => {
  it("renders a clickable canvas and doesn't throw when clicked, even with no 2d context available", () => {
    const containerRef = createRef<HTMLDivElement>();
    const dots: MapDot[] = [{ id: "1", x: 0, y: 0, radius: 5, color: "red", name: "Jita" }];

    const { container } = render(
      <div ref={containerRef}>
        <ReactFlowProvider>
          <MapMiniCanvas
            dots={dots}
            nodePoints={[]}
            regionLabels={[]}
            containerRef={containerRef}
          />
        </ReactFlowProvider>
      </div>,
    );

    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
    expect(() => fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })).not.toThrow();
  });
});
