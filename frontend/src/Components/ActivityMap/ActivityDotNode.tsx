import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { DotVisual } from "../SpaceMap/DotNode";
import type { ActivityNodeData } from "./types";

const ActivityDotNodeImpl = ({ data }: NodeProps & { data: ActivityNodeData }) => (
  <DotVisual radius={data.radius} color={data.color} name={data.system.name} bordered={false} />
);

export const ActivityDotNode = memo(ActivityDotNodeImpl);
