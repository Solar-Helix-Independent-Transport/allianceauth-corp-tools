import { useMemo, useState } from "react";
import { useViewport } from "@xyflow/react";
import { BOOTSTRAP_HEX, resolveSystemPosition } from "./layout";
import type { SovMapCoordMode, SovMapEdge, SovMapSystem } from "./types";

// Text size in flow-space units, same coordinate space the line/system
// positions live in - roughly matches the on-canvas size of a hub card's
// own text at a typical zoom level (both are inside the same zoom-scaled
// transform), so the label reads at a comparable size to the map around it.
const LABEL_FONT_SIZE = 12;
const LABEL_OFFSET_Y = -10;
// A 2px line is a thin target to click - this invisible, wider line sits on
// top of it purely for hit-testing (see pointerEvents: "stroke" below).
const HIT_AREA_WIDTH = 14;

const edgeKey = (e: SovMapEdge) => `${e.source}-${e.target}`;

// Same always-on background layer pattern as StargateEdgesLayer, painted
// after it (so jump bridges - a much smaller, more notable set of
// connections) stand out over the fainter grey stargate lines beneath them.
const JumpBridgeEdgesLayer = ({
  systems,
  edges,
  coordMode,
}: {
  systems: SovMapSystem[];
  edges: SovMapEdge[];
  coordMode: SovMapCoordMode;
}) => {
  const { x, y, zoom } = useViewport();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const positionById = useMemo(() => {
    const m = new Map<number, { x: number; y: number }>();
    systems.forEach((s) => m.set(s.id, resolveSystemPosition(s, coordMode)));
    return m;
  }, [systems, coordMode]);

  const nameById = useMemo(() => {
    const m = new Map<number, string>();
    systems.forEach((s) => m.set(s.id, s.name));
    return m;
  }, [systems]);

  // SVG has no z-index - later-painted elements sit on top of earlier ones -
  // so "bring to front" means rendering the selected bridge last, same
  // effect elevateNodesOnSelect gives system nodes.
  const orderedEdges = useMemo(() => {
    if (!selectedKey) return edges;
    const idx = edges.findIndex((e) => edgeKey(e) === selectedKey);
    if (idx === -1) return edges;
    const reordered = edges.slice();
    const [selected] = reordered.splice(idx, 1);
    reordered.push(selected);
    return reordered;
  }, [edges, selectedKey]);

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
        {orderedEdges.map((e) => {
          const a = positionById.get(e.source);
          const b = positionById.get(e.target);
          if (!a || !b) return null;
          const key = edgeKey(e);
          const isSelected = key === selectedKey;
          const aName = nameById.get(e.source);
          const bName = nameById.get(e.target);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          return (
            <g
              key={key}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
              onClick={() => setSelectedKey(isSelected ? null : key)}
            >
              {/* Invisible wide hit area - the visible line below is too
                  thin to click reliably on its own. */}
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="transparent"
                strokeWidth={HIT_AREA_WIDTH}
              />
              {isSelected && (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={BOOTSTRAP_HEX.primary}
                  strokeOpacity={0.35}
                  strokeWidth={8}
                />
              )}
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={BOOTSTRAP_HEX.primary}
                strokeOpacity={isSelected ? 1 : 0.85}
                strokeWidth={isSelected ? 3 : 2}
                strokeDasharray="8 6"
              />
              {aName && bName && (
                <text
                  x={midX}
                  y={midY + LABEL_OFFSET_Y}
                  textAnchor="middle"
                  fontSize={LABEL_FONT_SIZE}
                  fontWeight={600}
                  fill={BOOTSTRAP_HEX.primary}
                  stroke="var(--bs-body-bg)"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {aName} {`>>`} {bName}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default JumpBridgeEdgesLayer;
