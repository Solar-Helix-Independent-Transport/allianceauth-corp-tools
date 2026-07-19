import type { InternalNode } from "@xyflow/react";

// Ported from xyflow's "Floating Edges" example: instead of anchoring an edge
// to a fixed handle, find where the straight line between the two nodes'
// centers crosses each node's rectangle - so the edge always looks like it
// leaves/enters at the closest point on the node's border, regardless of
// whether that node is a small dot or a large upgrade/transport card.
function getNodeIntersection(intersectionNode: InternalNode, targetNode: InternalNode) {
  // Before a node's first ResizeObserver pass (e.g. the very first frame
  // after mount, or right after a mode switch recreates nodes - see
  // SovMapCanvas), `measured` is undefined and this would otherwise divide
  // by zero, producing NaN coordinates and a briefly broken/invisible edge.
  const w = Math.max((intersectionNode.measured.width ?? 0) / 2, 0.5);
  const h = Math.max((intersectionNode.measured.height ?? 0) / 2, 0.5);
  const nodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const x2 = nodePosition.x + w;
  const y2 = nodePosition.y + h;
  const x1 = targetPosition.x + (targetNode.measured.width ?? 0) / 2;
  const y1 = targetPosition.y + (targetNode.measured.height ?? 0) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;

  return {
    x: w * (xx3 + yy3) + x2,
    y: h * (-xx3 + yy3) + y2,
  };
}

export function getEdgeParams(source: InternalNode, target: InternalNode) {
  const sourceIntersection = getNodeIntersection(source, target);
  const targetIntersection = getNodeIntersection(target, source);

  return {
    sx: sourceIntersection.x,
    sy: sourceIntersection.y,
    tx: targetIntersection.x,
    ty: targetIntersection.y,
  };
}
