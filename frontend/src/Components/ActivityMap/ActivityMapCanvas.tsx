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
  id,
  data,
  coordMode,
  dataSource,
  initialViewport,
  onViewportChange,
}: {
  id: number;
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

  // Every known-space system renders as a node (see buildActivityNodes) so
  // the whole map stays clickable, but that means an unrestricted fitView
  // frames the entire backdrop rather than the handful of systems that
  // actually have data - restricting the initial fit to just these keeps the
  // map zoomed to what's actually interesting instead of the whole universe.
  // Intersected with data.systems because the backdrop excludes wormhole/
  // abyssal systems entirely (see build_base_map_payload) - a value entry
  // for one of those has no matching node at all, and handing fitView an id
  // with zero real matches collapses its bounds to a single degenerate
  // point, which xyflow resolves as "zoom in as far as possible" rather than
  // falling back to fitting everything else.
  const activeNodeIds = useMemo(() => {
    const systemIds = new Set(data.systems.map((s) => String(s.id)));
    return data.values
      .filter((v) => v.value > 0 && systemIds.has(String(v.system_id)))
      .map((v) => String(v.system_id));
  }, [data.systems, data.values]);

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
      fitViewKey={id}
      fitViewNodeIds={activeNodeIds}
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
