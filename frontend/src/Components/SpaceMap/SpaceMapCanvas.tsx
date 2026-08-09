import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Edge,
  type EdgeTypes,
  type MiniMapNodeProps,
  type Node,
  type NodeTypes,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RegionLabelNode from "./RegionLabelNode";
import { FloatingEdge } from "./FloatingEdge";
import StargateEdgesLayer from "./StargateEdgesLayer";
import JumpBridgeEdgesLayer from "./JumpBridgeEdgesLayer";
import RegionLabelsLayer, { LABEL_FONT_SIZE } from "./RegionLabelsLayer";
import { useFillHeight } from "./useFillHeight";
import { buildRegionLabelNodes } from "./layout";
import type { BaseMapEdge, BaseMapRegion, BaseMapSystem, MapCoordMode } from "./types";

// The default MiniMap node just scales each node's own on-canvas size down
// by the same factor as the whole map - fine when nodes are a decent
// fraction of the map's extent, but our systems are tiny dots/cards spread
// across a huge normalized coordinate space, so they shrink to sub-pixel and
// the minimap ends up looking empty. Drawing a fixed-radius circle per node
// instead keeps every system visible regardless of how vast the map is.
const MIN_MINIMAP_NODE_RADIUS = 6;

const BASE_EDGE_TYPES: EdgeTypes = { floating: FloatingEdge };

export type SpaceMapCanvasProps<
  TSystem extends BaseMapSystem,
  TNodeData extends { color: string },
> = {
  systems: TSystem[];
  regions: BaseMapRegion[];
  edges: BaseMapEdge[];
  // Undefined skips mounting the jump-bridge layer entirely - features with
  // no notion of jump bridges (the activity map) don't need it at all.
  jumpBridges?: BaseMapEdge[];
  coordMode: MapCoordMode;
  nodes: Node<TNodeData>[];
  flowEdges?: Edge[];
  nodeTypes: NodeTypes;
  renderDetailPanel?: (system: TSystem, onClose: () => void) => ReactNode;
  // Restores a previously-saved pan/zoom instead of auto-fitting on mount -
  // callers that want that persisted (e.g. to a URL query string) own the
  // storage; this component only needs the resulting value back out.
  // Omitting these preserves the original always-fitView behaviour.
  initialViewport?: Viewport;
  onViewportChange?: (viewport: Viewport) => void;
  // Identifies "which map" is being shown - e.g. the character/corporation
  // id an activity map is scoped to. A saved pan/zoom only frames the node
  // set it was captured against; if the caller switches to a different
  // scope (a different corp, or "all corporations") while keeping the same
  // coordMode, the node set's extent can change completely while the old
  // viewport - restored via initialViewport, or just left over from before -
  // stays put, framing the wrong region and clipping/overflowing the new
  // nodes. Changing this key re-fits, the same way a coordMode change does;
  // leave it undefined for callers with only one map/scope (e.g. sovmap).
  fitViewKey?: string | number;
  // Restricts the auto-fit to just these node ids instead of every node -
  // the activity map always renders the *entire* known-space backdrop (every
  // system, not just ones with data) so its nodes stay clickable, but fitting
  // to all of them zooms out to frame the whole universe even when actual
  // activity is a tiny cluster inside it. Passing just the nodes that have
  // data keeps the initial view zoomed to what's actually interesting;
  // omit (or pass an empty list) to fit every node as before.
  fitViewNodeIds?: string[];
};

// The shared, feature-agnostic space map shell: normalized system positions,
// the dim stargate/jump-bridge background layers, region watermark labels,
// themed pan/zoom/minimap. Callers own their own node/edge shapes and
// building them - this only handles the ReactFlow plumbing and chrome that's
// identical across every map built on top of it (sovereignty map, activity
// map, ...).
const SpaceMapCanvas = <TSystem extends BaseMapSystem, TNodeData extends { color: string }>({
  systems,
  regions,
  edges,
  jumpBridges,
  coordMode,
  nodes: nodesProp,
  flowEdges,
  nodeTypes: nodeTypesProp,
  renderDetailPanel,
  initialViewport,
  onViewportChange,
  fitViewKey,
  fitViewNodeIds,
}: SpaceMapCanvasProps<TSystem, TNodeData>) => {
  const nodeTypes = useMemo(
    () => ({ regionLabel: RegionLabelNode, ...nodeTypesProp }),
    [nodeTypesProp],
  );

  // We don't wire up onNodesChange (there's nothing to drag/connect here), so
  // xyflow never gets to persist its own "select" change back onto our node
  // objects - without that, `node.selected` never becomes true and
  // elevateNodesOnSelect's z-index math has nothing to elevate. Tracking the
  // selected id ourselves and stamping it onto the nodes we pass in fixes
  // both that z-index elevation and the selection highlight on the card.
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Needed early: getInternalNode lets us read a node's already-known
  // measured size (see below) when stamping selection onto it.
  const { fitView, getInternalNode } = useReactFlow();

  // xyflow only keeps a node's already-measured size across a render if the
  // node object we pass in is the *exact same reference* as last time
  // (adoptUserNodes' `userNode === internalNode.internals.userNode` check) -
  // otherwise it wipes the measured size and re-measures from scratch,
  // which - since nodeOrigin is [0.5, 0.5] - visibly snaps every node's
  // position toward its center while its box is momentarily the tiny
  // initialWidth/initialHeight placeholder. A naive `.map(n => ({...n,
  // selected}))` recreates every node's object on every click, so every
  // node would flicker, not just the one being selected. This cache reuses
  // the previous stamped object whenever both the underlying node (from
  // nodesProp) and the desired selected flag are unchanged, so only the
  // node(s) whose selection actually flipped get a new reference - and for
  // those, we seed `.measured` from xyflow's own current internal size
  // (adoptUserNodes trusts `userNode.measured` over re-measuring from
  // scratch when it's present), so even the node whose selection just
  // flipped keeps its real size instead of blipping through the tiny
  // placeholder for a frame.
  const selectionStampCache = useRef(
    new Map<string, { source: Node<TNodeData>; selected: boolean; result: Node<TNodeData> }>(),
  );
  const nodes: Node<TNodeData>[] = useMemo(() => {
    const cache = selectionStampCache.current;
    const nextCache = new Map<
      string,
      { source: Node<TNodeData>; selected: boolean; result: Node<TNodeData> }
    >();
    // Reading/writing selectionStampCache.current here is intentional: this
    // memo IS the cache's synchronization point (see the comment above) - an
    // effect-based update would only apply after this render has already
    // committed with wrong/stale stamped nodes, defeating the whole point.
    // eslint-disable-next-line react-hooks/refs
    const result = nodesProp.map((n) => {
      const isSelected = n.id === selectedNodeId;
      const cached = cache.get(n.id);
      if (cached && cached.source === n && cached.selected === isSelected) {
        nextCache.set(n.id, cached);
        return cached.result;
      }
      const known = getInternalNode(n.id)?.measured;
      const measured =
        known?.width != null && known?.height != null
          ? { width: known.width, height: known.height }
          : n.measured;
      const stamped = { ...n, selected: isSelected, measured };
      nextCache.set(n.id, { source: n, selected: isSelected, result: stamped });
      return stamped;
    });
    // eslint-disable-next-line react-hooks/refs
    selectionStampCache.current = nextCache;
    return result;
  }, [nodesProp, selectedNodeId, getInternalNode]);

  // Zero-size, non-interactive real nodes that exist purely so the
  // MiniMap's nodeComponent has something to render text through (see the
  // comment on buildRegionLabelNodes) - listed first so they paint behind
  // the system nodes in the minimap, matching the "behind everything" intent
  // of the big watermark version drawn by RegionLabelsLayer.
  const regionLabelNodes = useMemo(
    () => buildRegionLabelNodes(regions, systems, coordMode),
    [regions, systems, coordMode],
  );
  const allNodes: Node[] = useMemo(
    () => [...regionLabelNodes, ...nodes],
    [regionLabelNodes, nodes],
  );

  const regionNameById = useMemo(
    () => new Map(regionLabelNodes.map((n) => [n.id, n.data.regionLabelName])),
    [regionLabelNodes],
  );
  const MiniMapNode = useCallback(
    ({ id, x, y, width, height, color, selected }: MiniMapNodeProps) => {
      const regionLabelName = regionNameById.get(id);
      if (regionLabelName) {
        return (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={LABEL_FONT_SIZE}
            fontWeight={700}
            fill="var(--bs-secondary-color)"
            opacity={0.6}
          >
            {regionLabelName}
          </text>
        );
      }
      const r = Math.max(width, height, MIN_MINIMAP_NODE_RADIUS * 2) / 2;
      return (
        <circle
          cx={x + width / 2}
          cy={y + height / 2}
          r={r}
          fill={color}
          stroke={selected ? "var(--bs-emphasis-color)" : "none"}
          strokeWidth={selected ? 1 : 0}
        />
      );
    },
    [regionNameById],
  );

  const selectedSystem = useMemo(
    () => systems.find((s) => String(s.id) === selectedNodeId) ?? null,
    [systems, selectedNodeId],
  );

  const { ref, height } = useFillHeight<HTMLDivElement>();

  // Switching coordinate systems moves every node to a completely different
  // layout, and switching fitViewKey (e.g. the corp/character a map is
  // scoped to) swaps in a differently-sized/positioned node set entirely -
  // either way the previous pan/zoom no longer frames anything meaningful,
  // so re-fit when either changes (but not on every data refresh with the
  // same scope, which would otherwise fight the user's own panning). The one
  // exception is the very first run: if the caller handed us a restored
  // viewport (e.g. from a URL query string), that's an explicit request to
  // land somewhere specific instead of auto-fitting - honour it once, then
  // fall back to the normal re-fit-on-change behaviour.
  const skippedInitialFit = useRef(false);
  useEffect(() => {
    if (!skippedInitialFit.current) {
      skippedInitialFit.current = true;
      if (initialViewport) return;
    }
    // fitView only counts a node toward the fit bounds once xyflow has
    // measured its rendered size (getFitViewNodes checks node.measured
    // directly, no initialWidth/initialHeight fallback) - useNodesInitialized
    // is the documented way to wait for that, but on this map's node count
    // (thousands of backdrop systems plus one zero-footprint node per region
    // - see RegionLabelNode) it was observed, live, to never resolve at all,
    // permanently blocking every fit. So instead: check readiness of just the
    // handful of nodes this fit actually needs, retry a few animation frames
    // if they're not measured yet, and fit with whatever's ready once the
    // budget runs out rather than waiting forever on a signal that may never
    // come.
    let cancelled = false;
    let attempts = 0;
    const tryFit = () => {
      if (cancelled) return;
      const measuredFitIds = fitViewNodeIds?.filter((id) => {
        const measured = getInternalNode(id)?.measured;
        return Boolean(measured?.width && measured?.height);
      });
      const targetCount = fitViewNodeIds?.length ?? 0;
      const ready = targetCount === 0 || (measuredFitIds?.length ?? 0) > 0;
      if (!ready && attempts < 30) {
        attempts += 1;
        requestAnimationFrame(tryFit);
        return;
      }
      fitView(measuredFitIds?.length ? { nodes: measuredFitIds.map((id) => ({ id })) } : undefined);
    };
    tryFit();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordMode, fitViewKey, fitViewNodeIds]);

  return (
    // xyflow's own Controls/MiniMap chrome is styled via these CSS custom
    // properties (see @xyflow/react/dist/style.css), defaulting to a fixed
    // light palette unless a "dark" class is applied to the root - pointing
    // them at Bootstrap's variables instead keeps the zoom controls in sync
    // with data-bs-theme rather than xyflow's own separate light/dark switch.
    <div
      ref={ref}
      style={
        {
          position: "relative",
          width: "100%",
          height,
          // The stargate/jump-bridge/region-label layers below are drawn as
          // sibling <svg> overlays with their own overflow:visible (needed
          // so lines aren't clipped by their own SVG box at every zoom
          // level) - neither that nor xyflow's own container clips content
          // to the map's actual footprint, so at low zoom or once panned,
          // nodes and lines bleed out past this box into whatever page
          // chrome sits above/around it. This is the one place that clips
          // the whole assembly - ReactFlow, MiniMap/Controls, and all three
          // overlay layers alike - back down to the intended area.
          overflow: "hidden",
          "--xy-controls-button-background-color": "var(--bs-tertiary-bg)",
          "--xy-controls-button-background-color-hover": "var(--bs-secondary-bg)",
          "--xy-controls-button-color": "var(--bs-body-color)",
          "--xy-controls-button-color-hover": "var(--bs-emphasis-color)",
          "--xy-controls-button-border-color": "var(--bs-border-color)",
        } as CSSProperties
      }
    >
      {/* Rendered before (so painted below) ReactFlow's own edges/nodes -
          as a child of <ReactFlow> this used to paint on top of and
          completely hide the colored flow-mode edges underneath it. It
          still has access to the shared viewport store via the
          ReactFlowProvider the caller wraps this whole component in. */}
      <RegionLabelsLayer regions={regions} systems={systems} coordMode={coordMode} />
      <StargateEdgesLayer systems={systems} edges={edges} coordMode={coordMode} />
      {jumpBridges && (
        <JumpBridgeEdgesLayer systems={systems} edges={jumpBridges} coordMode={coordMode} />
      )}
      <ReactFlow
        nodes={allNodes}
        edges={flowEdges ?? []}
        nodeTypes={nodeTypes}
        edgeTypes={BASE_EDGE_TYPES}
        nodeOrigin={[0.5, 0.5]}
        // Deliberately not using the declarative fitView prop here: it fits
        // *every* node with no way to pass fitViewNodeIds, so on first mount
        // it would race the effect below (both wait on nodesInitialized) and
        // could win, clobbering our restricted fit with an unrestricted one
        // that frames the whole backdrop instead of just the active systems.
        // The effect handles the initial fit too, so this only needs to
        // restore a saved viewport when we have one.
        {...(initialViewport ? { defaultViewport: initialViewport } : {})}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        elevateNodesOnSelect
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        onMoveEnd={onViewportChange ? (_, viewport) => onViewportChange(viewport) : undefined}
        minZoom={0.02}
        maxZoom={4}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={64} size={1} style={{ opacity: 0.15 }} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => (node.data as TNodeData).color ?? "var(--bs-secondary)"}
          nodeComponent={MiniMapNode}
          maskColor="color-mix(in srgb, var(--bs-body-bg) 65%, transparent)"
          bgColor="var(--bs-tertiary-bg)"
          style={{
            backgroundColor: "var(--bs-tertiary-bg)",
            border: "1px solid var(--bs-border-color)",
          }}
        />
      </ReactFlow>
      {selectedSystem &&
        renderDetailPanel &&
        renderDetailPanel(selectedSystem, () => setSelectedNodeId(null))}
    </div>
  );
};

export default SpaceMapCanvas;
