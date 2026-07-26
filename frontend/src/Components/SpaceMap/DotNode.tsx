import { memo } from "react";
import type { NodeProps } from "@xyflow/react";

export type DotNodeData = {
  radius: number;
  color: string;
  name: string;
  // Defaults to true (the sov map's plain dots keep their border) - features
  // that want a soft, borderless blob (the activity map's transparent
  // overlay circles) can opt out.
  bordered?: boolean;
};

// The plain "just a circle + label" system rendering shared by every space
// map that doesn't need a detail card (the sov map's non-hub systems, the
// activity map's systems). `DotVisual` is the bare markup, reusable inline
// by features (like the sov map) that switch between this and their own
// richer node visuals within a single xyflow node type; `DotNode` is the
// same thing wrapped as a standalone node-type component for features (like
// the activity map) that only ever render dots.
export const DotVisual = ({ radius, color, name, bordered = true }: DotNodeData) => {
  const size = radius * 2;
  return (
    // No content-visibility here: it implies paint containment, which clips
    // the label below at the edge of this tiny box - exactly the bug that
    // made non-hub system names disappear.
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        title={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          border: bordered ? "1px solid var(--bs-border-color)" : "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: size + 1,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 9,
          lineHeight: 1.2,
          color: "var(--bs-body-color)",
          textShadow:
            "0 0 2px var(--bs-body-bg), 0 0 3px var(--bs-body-bg), 0 0 4px var(--bs-body-bg)",
          pointerEvents: "none",
        }}
      >
        {name}
      </div>
    </div>
  );
};

const DotNodeImpl = ({ data }: NodeProps & { data: DotNodeData }) => <DotVisual {...data} />;

export const DotNode = memo(DotNodeImpl);
