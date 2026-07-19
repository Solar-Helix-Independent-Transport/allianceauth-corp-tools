import { useMemo } from "react";
import { useViewport } from "@xyflow/react";
import { resolveSystemPosition } from "./layout";
import type { SovMapCoordMode, SovMapEdge, SovMapSystem } from "./types";

const StargateEdgesLayer = ({
  systems,
  edges,
  coordMode,
}: {
  systems: SovMapSystem[];
  edges: SovMapEdge[];
  coordMode: SovMapCoordMode;
}) => {
  const { x, y, zoom } = useViewport();

  const positionById = useMemo(() => {
    const m = new Map<number, { x: number; y: number }>();
    systems.forEach((s) => m.set(s.id, resolveSystemPosition(s, coordMode)));
    return m;
  }, [systems, coordMode]);

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 0,
      }}
    >
      <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
        {edges.map((e, i) => {
          const a = positionById.get(e.source);
          const b = positionById.get(e.target);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--bs-secondary-color)"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default StargateEdgesLayer;
