import type { MapDot } from "./types";

// Dot colors come in as CSS color expressions (var(--bs-success),
// color-mix(in srgb, var(--bs-info) 50%, transparent), ...) - canvas's own
// fillStyle color parser doesn't resolve custom properties or color-mix(),
// it just silently ignores the assignment and keeps whatever color was set
// before. Routing the value through a real (but invisible, live-in-DOM so it
// inherits :root's theme custom properties) element and reading back
// getComputedStyle lets the browser's actual CSS engine do the resolution
// instead, which handles every valid CSS color expression for free.
let resolverEl: HTMLDivElement | null = null;
const getResolverEl = (): HTMLDivElement => {
  if (!resolverEl) {
    resolverEl = document.createElement("div");
    resolverEl.style.cssText =
      "position:absolute;top:-9999px;left:-9999px;pointer-events:none;visibility:hidden;";
    document.body.appendChild(resolverEl);
  }
  return resolverEl;
};

export const resolveCanvasColor = (cssColor: string): string => {
  const el = getResolverEl();
  el.style.color = cssColor;
  const resolved = getComputedStyle(el).color;
  // jsdom (unit tests) has no real CSS engine behind getComputedStyle, so it
  // just echoes back whatever was set - falling back to the raw string keeps
  // draw calls from producing an empty fillStyle there.
  return resolved || cssColor;
};

// Fresh per draw call rather than module-level: the theme (data-bs-theme)
// can change between draws, and the handful of distinct colors a map
// actually uses makes re-resolving every one every draw cheap regardless -
// no cache invalidation to get wrong.
const makeColorResolver = () => {
  const cache = new Map<string, string>();
  return (cssColor: string): string => {
    let resolved = cache.get(cssColor);
    if (resolved === undefined) {
      resolved = resolveCanvasColor(cssColor);
      cache.set(cssColor, resolved);
    }
    return resolved;
  };
};

export type DrawDotsOptions = {
  viewport: { x: number; y: number; zoom: number };
  // Device-pixel canvas backing size and its CSS size - kept separate so the
  // draw logic can set up the dpr transform without also owning resize
  // observation (that's SystemDotsLayer's job).
  cssWidth: number;
  cssHeight: number;
  dpr: number;
  borderColor?: string;
  textColor?: string;
  textHaloColor?: string;
};

const LABEL_FONT_SIZE = 9;
const LABEL_OFFSET = 1;
// Below this on-screen size a label is unreadable anyway, and skipping the
// fillText/strokeText calls entirely is a real cost saving at high dot
// counts and low zoom (the exact case that made the DOM version slow).
const MIN_LABEL_SCREEN_SIZE = 6;

export const drawDots = (
  ctx: CanvasRenderingContext2D,
  dots: MapDot[],
  options: DrawDotsOptions,
) => {
  const { viewport, cssWidth, cssHeight, dpr } = options;
  const { x, y, zoom } = viewport;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.translate(x, y);
  ctx.scale(zoom, zoom);

  const resolve = makeColorResolver();
  const borderColor = resolve(options.borderColor ?? "var(--bs-border-color)");
  const textColor = resolve(options.textColor ?? "var(--bs-body-color)");
  const textHaloColor = resolve(options.textHaloColor ?? "var(--bs-body-bg)");

  for (const d of dots) {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
    ctx.fillStyle = resolve(d.color);
    ctx.fill();
    if (d.bordered !== false) {
      ctx.lineWidth = 1 / zoom;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    }
  }

  if (LABEL_FONT_SIZE * zoom < MIN_LABEL_SCREEN_SIZE) return;

  ctx.font = `${LABEL_FONT_SIZE}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineWidth = 3 / zoom;
  ctx.strokeStyle = textHaloColor;
  ctx.fillStyle = textColor;
  for (const d of dots) {
    const ty = d.y + d.radius + LABEL_OFFSET;
    ctx.strokeText(d.name, d.x, ty);
    ctx.fillText(d.name, d.x, ty);
  }
};

// Nearest dot whose radius (plus a caller-supplied screen-space tolerance,
// already converted to world units) contains the given world-space point -
// used to hit-test a pane click against dots that, unlike real xyflow nodes,
// have no DOM element of their own to receive the click.
export const findDotAt = (
  dots: MapDot[],
  worldX: number,
  worldY: number,
  extraHitRadius = 0,
): MapDot | null => {
  let best: MapDot | null = null;
  let bestDist = Infinity;
  for (const d of dots) {
    const dist = Math.hypot(d.x - worldX, d.y - worldY);
    const hitRadius = d.radius + extraHitRadius;
    if (dist <= hitRadius && dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return best;
};
