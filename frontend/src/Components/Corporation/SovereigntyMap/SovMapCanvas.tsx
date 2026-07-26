import { useMemo } from "react";
import type { Edge, Node } from "@xyflow/react";
import SpaceMapCanvas from "../../SpaceMap/SpaceMapCanvas";
import { SystemNode } from "./SystemNode";
import SystemDetailPanel from "./SystemDetailPanel";
import { buildBaseNodes, buildFlowEdges, buildHubsById, decorateNodesForMode } from "./layout";
import type { SovMapCoordMode, SovMapMode, SovMapResponse, SystemNodeData } from "./types";

const nodeTypes = { system: SystemNode };

const SovMapCanvas = ({
  data,
  mode,
  upgradeSearch,
  coordMode,
}: {
  data: SovMapResponse;
  mode: SovMapMode;
  upgradeSearch: string;
  coordMode: SovMapCoordMode;
}) => {
  const hubsById = useMemo(() => buildHubsById(data.hubs), [data.hubs]);

  const regionNameByRegionId = useMemo(
    () => new Map(data.regions.map((r) => [r.id, r.name])),
    [data.regions],
  );

  const baseNodes = useMemo(() => buildBaseNodes(data, coordMode), [data, coordMode]);

  const nodes: Node<SystemNodeData>[] = useMemo(
    () => decorateNodesForMode(baseNodes, hubsById, mode, upgradeSearch),
    [baseNodes, hubsById, mode, upgradeSearch],
  );

  const flowEdges: Edge[] = useMemo(
    () => (mode === "flow" ? buildFlowEdges(data.hubs) : []),
    [data.hubs, mode],
  );

  return (
    <SpaceMapCanvas
      systems={data.systems}
      regions={data.regions}
      edges={data.edges}
      jumpBridges={data.jump_bridges}
      coordMode={coordMode}
      nodes={nodes}
      flowEdges={flowEdges}
      nodeTypes={nodeTypes}
      renderDetailPanel={(system, onClose) => (
        <SystemDetailPanel
          system={system}
          hub={hubsById.get(system.id) ?? null}
          regionName={
            system.region_id != null ? regionNameByRegionId.get(system.region_id) : undefined
          }
          onClose={onClose}
        />
      )}
    />
  );
};

export default SovMapCanvas;
