import { useMemo } from "react";
import { useViewport } from "@xyflow/react";
import { computeRegionCentroids } from "./layout";
import type { SovMapCoordMode, SovMapRegion, SovMapSystem } from "./types";

// Large, dim watermark-style text centered on each region's system centroid -
// purely a background label, so it sits behind the stargate lines and every
// node (rendered first, painted lowest) and never intercepts clicks/drags.
// Shared with the MiniMap's region labels so the two stay visually
// consistent (both draw in the same flow-space coordinates).
export const LABEL_FONT_SIZE = 420;

const RegionLabelsLayer = ({
  regions,
  systems,
  coordMode,
}: {
  regions: SovMapRegion[];
  systems: SovMapSystem[];
  coordMode: SovMapCoordMode;
}) => {
  const { x, y, zoom } = useViewport();

  const centroids = useMemo(
    () => computeRegionCentroids(regions, systems, coordMode),
    [regions, systems, coordMode],
  );

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
        {centroids.map((r) => (
          <text
            key={r.id}
            x={r.x}
            y={r.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={LABEL_FONT_SIZE}
            fontWeight={700}
            fill="var(--bs-secondary-color)"
            opacity={0.18}
          >
            {r.name}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default RegionLabelsLayer;
