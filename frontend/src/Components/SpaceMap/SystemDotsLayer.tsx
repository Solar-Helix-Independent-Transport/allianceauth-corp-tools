import { useEffect, useRef, useState } from "react";
import { useViewport } from "@xyflow/react";
import { drawDots } from "./dotCanvas";
import type { MapDot } from "./types";

// The many-thousands-of-systems layer: one <canvas> repaint instead of a
// real xyflow DOM node (plus its ResizeObserver) per system, which is what
// made the map slow in the first place - see StargateEdgesLayer/
// JumpBridgeEdgesLayer for the same bypass-xyflow's-own-renderer pattern
// already used for edges. pointerEvents stays "none": clicks are hit-tested
// against `dots` from SpaceMapCanvas's onPaneClick instead (via
// screenToFlowPosition), so this layer never has to fight the pane's own
// drag-to-pan/wheel-to-zoom handling.
const SystemDotsLayer = ({ dots }: { dots: MapDot[] }) => {
  const { x, y, zoom } = useViewport();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Bumped by a ResizeObserver on the canvas itself so a container resize
  // (sidebar toggle, page layout change, ...) that isn't a window resize
  // still triggers a repaint at the right backing-store size.
  const [resizeTick, setResizeTick] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => setResizeTick((t) => t + 1));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    // jsdom (unit tests) has no canvas backend - getContext returns null.
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const backingWidth = Math.max(1, Math.round(cssWidth * dpr));
    const backingHeight = Math.max(1, Math.round(cssHeight * dpr));
    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
    }

    drawDots(ctx, dots, { viewport: { x, y, zoom }, cssWidth, cssHeight, dpr });
  }, [dots, x, y, zoom, resizeTick]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default SystemDotsLayer;
