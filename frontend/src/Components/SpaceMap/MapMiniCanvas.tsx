import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useReactFlow, useViewport } from "@xyflow/react";
import { resolveCanvasColor } from "./dotCanvas";
import type { MapDot } from "./types";

const WIDTH = 200;
const HEIGHT = 150;
// A dot's world-space radius is meaningless at minimap scale (the world-to-
// minimap scale factor is tiny across a map this large, so even the
// biggest dot would round to sub-pixel) - instead each dot's minimap size
// is its radius *relative to the biggest radius in the current dot set*,
// mapped into this small pixel range. That's also what makes the minimap
// legible at all on a map like the activity one: most systems have no
// activity and share one small default radius/muted color, while the
// handful with real activity have a much bigger radius - stretching that
// contrast back out at minimap scale is what lets the interesting systems
// actually stand out against the rest instead of disappearing into it.
const MIN_DOT_PX = 1;
const MAX_DOT_PX = 4;
// Matches the old xyflow-MiniMap-specific fixed radius (see the removed
// MIN_MINIMAP_NODE_RADIUS comment this replaces): plain-scaled node sizes
// shrink to sub-pixel across a map this large, so every point gets the same
// small fixed radius regardless of its real on-canvas size.
const NODE_RADIUS = 3;
const LABEL_FONT_SIZE = 7;

export type MiniPoint = { x: number; y: number; color: string };
export type MiniRegionLabel = { x: number; y: number; name: string };

type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

const computeBounds = (points: { x: number; y: number }[]): Bounds => {
  if (points.length === 0) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  // Guard against a degenerate (zero-area) bounds box, e.g. a single system.
  if (maxX - minX < 1) {
    maxX += 1;
    minX -= 1;
  }
  if (maxY - minY < 1) {
    maxY += 1;
    minY -= 1;
  }
  return { minX, minY, maxX, maxY };
};

// A from-scratch replacement for xyflow's <MiniMap>: that component only
// ever draws real xyflow nodes, and moving the bulk of systems onto a canvas
// layer (see SystemDotsLayer) to fix the main map's performance means they
// no longer exist as xyflow nodes at all - so the built-in minimap can't see
// them either. This draws straight from the same dot/node data instead.
const MapMiniCanvas = ({
  dots,
  nodePoints,
  regionLabels,
  containerRef,
}: {
  dots: MapDot[];
  nodePoints: MiniPoint[];
  regionLabels: MiniRegionLabel[];
  containerRef: RefObject<HTMLElement | null>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { x, y, zoom } = useViewport();
  const { setViewport } = useReactFlow();
  const isPointerDownRef = useRef(false);

  const bounds = useMemo(() => computeBounds([...dots, ...nodePoints]), [dots, nodePoints]);

  const scale = useMemo(() => {
    const w = bounds.maxX - bounds.minX;
    const h = bounds.maxY - bounds.minY;
    return Math.min(WIDTH / w, HEIGHT / h);
  }, [bounds]);

  // Centers the (generally non-square) world bounds inside the fixed-size
  // minimap box rather than pinning to its top-left corner.
  const offset = useMemo(
    () => ({
      x: (WIDTH - (bounds.maxX - bounds.minX) * scale) / 2,
      y: (HEIGHT - (bounds.maxY - bounds.minY) * scale) / 2,
    }),
    [bounds, scale],
  );

  const worldToMini = useCallback(
    (wx: number, wy: number) => ({
      mx: (wx - bounds.minX) * scale + offset.x,
      my: (wy - bounds.minY) * scale + offset.y,
    }),
    [bounds, scale, offset],
  );

  const miniToWorld = useCallback(
    (mx: number, my: number) => ({
      wx: (mx - offset.x) / scale + bounds.minX,
      wy: (my - offset.y) / scale + bounds.minY,
    }),
    [bounds, scale, offset],
  );

  const [resizeTick, setResizeTick] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setResizeTick((t) => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const backingWidth = Math.round(WIDTH * dpr);
    const backingHeight = Math.round(HEIGHT * dpr);
    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = resolveCanvasColor("var(--bs-tertiary-bg)");
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.font = `${LABEL_FONT_SIZE}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = resolveCanvasColor("var(--bs-secondary-color)");
    ctx.globalAlpha = 0.6;
    for (const r of regionLabels) {
      const { mx, my } = worldToMini(r.x, r.y);
      ctx.fillText(r.name, mx, my);
    }
    ctx.globalAlpha = 1;

    const colorCache = new Map<string, string>();
    const resolved = (c: string) => {
      let v = colorCache.get(c);
      if (v === undefined) {
        v = resolveCanvasColor(c);
        colorCache.set(c, v);
      }
      return v;
    };

    // Biggest-radius (generally the most "interesting", e.g. highest
    // activity) dots drawn last, so they paint over the mass of small
    // default-radius ones instead of getting buried underneath it - the
    // opposite priority from the main canvas (see SystemDotsLayer), which
    // draws small dots last purely so they stay clickable over big ones.
    // The minimap has no click-through-to-the-right-dot concern, only a
    // "make the signal visible" one.
    const maxRadius = dots.reduce((max, d) => Math.max(max, d.radius), 0);
    const sortedDots = maxRadius > 0 ? [...dots].sort((a, b) => a.radius - b.radius) : dots;
    for (const d of sortedDots) {
      const { mx, my } = worldToMini(d.x, d.y);
      const t = maxRadius > 0 ? d.radius / maxRadius : 0;
      const miniRadius = MIN_DOT_PX + t * (MAX_DOT_PX - MIN_DOT_PX);
      ctx.fillStyle = resolved(d.color);
      ctx.beginPath();
      ctx.arc(mx, my, miniRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const n of nodePoints) {
      const { mx, my } = worldToMini(n.x, n.y);
      ctx.fillStyle = resolved(n.color);
      ctx.beginPath();
      ctx.arc(mx, my, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    const containerEl = containerRef.current;
    const w = containerEl?.clientWidth ?? 0;
    const h = containerEl?.clientHeight ?? 0;
    if (w > 0 && h > 0 && zoom > 0) {
      const topLeft = worldToMini(-x / zoom, -y / zoom);
      const bottomRight = worldToMini((w - x) / zoom, (h - y) / zoom);
      ctx.strokeStyle = resolveCanvasColor("var(--bs-emphasis-color)");
      ctx.lineWidth = 1;
      ctx.strokeRect(
        topLeft.mx,
        topLeft.my,
        bottomRight.mx - topLeft.mx,
        bottomRight.my - topLeft.my,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dots, nodePoints, regionLabels, worldToMini, x, y, zoom, resizeTick]);

  const jumpTo = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const containerEl = containerRef.current;
      if (!canvas || !containerEl) return;
      const rect = canvas.getBoundingClientRect();
      const { wx, wy } = miniToWorld(clientX - rect.left, clientY - rect.top);
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight;
      setViewport({ x: w / 2 - wx * zoom, y: h / 2 - wy * zoom, zoom });
    },
    [containerRef, miniToWorld, setViewport, zoom],
  );

  return (
    <canvas
      ref={canvasRef}
      role="button"
      aria-label="Minimap"
      style={{
        position: "absolute",
        right: 10,
        bottom: 10,
        width: WIDTH,
        height: HEIGHT,
        border: "1px solid var(--bs-border-color)",
        borderRadius: 4,
        cursor: "pointer",
        zIndex: 5,
      }}
      onPointerDown={(e) => {
        isPointerDownRef.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        jumpTo(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isPointerDownRef.current) jumpTo(e.clientX, e.clientY);
      }}
      onPointerUp={() => {
        isPointerDownRef.current = false;
      }}
    />
  );
};

export default MapMiniCanvas;
