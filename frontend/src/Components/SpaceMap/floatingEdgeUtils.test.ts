import type { InternalNode } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import { getEdgeParams } from "./floatingEdgeUtils";

const makeNode = (x: number, y: number, width: number, height: number): InternalNode =>
  ({
    measured: { width, height },
    internals: { positionAbsolute: { x, y } },
  }) as unknown as InternalNode;

describe("getEdgeParams", () => {
  it("returns intersection points on the border between two horizontally aligned same-size nodes", () => {
    const source = makeNode(0, 0, 40, 40);
    const target = makeNode(100, 0, 40, 40);

    const { sx, sy, tx, ty } = getEdgeParams(source, target);

    // source is to the left of target, so the edge should leave from the
    // source's right edge and arrive at the target's left edge.
    expect(sx).toBeCloseTo(40);
    expect(sy).toBeCloseTo(20);
    expect(tx).toBeCloseTo(100);
    expect(ty).toBeCloseTo(20);
  });

  it("falls back to a zero-size measurement instead of dividing by zero when a node's dimensions haven't been measured yet", () => {
    const source = {
      measured: {},
      internals: { positionAbsolute: { x: 0, y: 0 } },
    } as unknown as InternalNode;
    const target = makeNode(50, 50, 20, 20);

    const result = getEdgeParams(source, target);

    expect(Number.isNaN(result.sx)).toBe(false);
    expect(Number.isNaN(result.sy)).toBe(false);
    expect(Number.isNaN(result.tx)).toBe(false);
    expect(Number.isNaN(result.ty)).toBe(false);
  });

  it("is symmetric in the sense that swapping source/target mirrors the intersection points", () => {
    const a = makeNode(0, 0, 30, 30);
    const b = makeNode(80, 40, 30, 30);

    const forward = getEdgeParams(a, b);
    const backward = getEdgeParams(b, a);

    expect(backward.sx).toBeCloseTo(forward.tx);
    expect(backward.sy).toBeCloseTo(forward.ty);
    expect(backward.tx).toBeCloseTo(forward.sx);
    expect(backward.ty).toBeCloseTo(forward.sy);
  });
});
