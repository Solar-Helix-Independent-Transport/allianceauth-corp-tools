import { useMemo } from "react";
import type { Viewport } from "@xyflow/react";
import SpaceMapCanvas from "../SpaceMap/SpaceMapCanvas";
import type { MapCoordMode } from "../SpaceMap/types";
import { ActivityDotNode } from "./ActivityDotNode";
import ActivityDetailPanel from "./ActivityDetailPanel";
import { buildActivityNodes } from "./layout";
import type { ActivityMapDataSource, ActivityMapResponse } from "./types";

const nodeTypes = { dot: ActivityDotNode };

const ActivityMapCanvas = ({
  data,
  coordMode,
  dataSource,
  initialViewport,
  onViewportChange,
}: {
  data: ActivityMapResponse;
  coordMode: MapCoordMode;
  dataSource: ActivityMapDataSource;
  initialViewport?: Viewport;
  onViewportChange?: (viewport: Viewport) => void;
}) => {
  const nodes = useMemo(() => buildActivityNodes(data, coordMode), [data, coordMode]);

  const valuesBySystem = useMemo(
    () => new Map(data.values.map((v) => [v.system_id, v])),
    [data.values],
  );

  return (
    <SpaceMapCanvas
      systems={data.systems}
      regions={data.regions}
      edges={data.edges}
      coordMode={coordMode}
      nodes={nodes}
      nodeTypes={nodeTypes}
      initialViewport={initialViewport}
      onViewportChange={onViewportChange}
      renderDetailPanel={(system, onClose) => {
        const v = valuesBySystem.get(system.id);
        return (
          <ActivityDetailPanel
            system={system}
            value={v?.value ?? 0}
            count={v?.count ?? 0}
            quantity={v?.quantity ?? 0}
            valueLabel={dataSource.valueLabel}
            countLabel={dataSource.countLabel}
            quantityLabel={dataSource.quantityLabel}
            onClose={onClose}
          />
        );
      }}
    />
  );
};

export default ActivityMapCanvas;
