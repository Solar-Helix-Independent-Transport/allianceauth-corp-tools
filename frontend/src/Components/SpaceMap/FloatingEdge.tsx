import { BaseEdge, getStraightPath, useInternalNode, type EdgeProps } from "@xyflow/react";
import { getEdgeParams } from "./floatingEdgeUtils";

// Nodes paint over edges (xyflow renders the edges pane below the nodes
// pane), so an arrowhead drawn all the way up to a node's border ends up
// tucked invisibly under it. Pulling the target point back leaves the
// arrowhead sitting in open space, clearly visible pointing at the card
// instead of disappearing into it.
const TARGET_GAP = 12;
const SOURCE_GAP = 4;

export function FloatingEdge({ id, source, target, markerEnd, style }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  // If the two nodes are close enough that the gaps would cross over each
  // other (overlapping hub cards), scale them down instead of inverting the
  // line's direction.
  const totalGap = SOURCE_GAP + TARGET_GAP;
  const gapScale = totalGap > 0 && len < totalGap + 8 ? Math.max(0, len - 8) / totalGap : 1;
  const sourceGap = SOURCE_GAP * gapScale;
  const targetGap = TARGET_GAP * gapScale;

  const [path] = getStraightPath({
    sourceX: sx + ux * sourceGap,
    sourceY: sy + uy * sourceGap,
    targetX: tx - ux * targetGap,
    targetY: ty - uy * targetGap,
  });

  return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />;
}
