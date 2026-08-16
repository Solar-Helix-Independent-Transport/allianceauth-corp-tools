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
  ReactFlow,
  useReactFlow,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FloatingEdge } from "./FloatingEdge";
import StargateEdgesLayer from "./StargateEdgesLayer";
import JumpBridgeEdgesLayer from "./JumpBridgeEdgesLayer";
import SystemDotsLayer from "./SystemDotsLayer";
import MapMiniCanvas from "./MapMiniCanvas";
import RegionLabelsLayer from "./RegionLabelsLayer";
import { findDotAt } from "./dotCanvas";
import { useFillHeight } from "./useFillHeight";
import { computeFitBounds, computeRegionCentroids } from "./layout";
import type { BaseMapEdge, BaseMapRegion, BaseMapSystem, MapCoordMode, MapDot } from "./types";

const BASE_EDGE_TYPES: EdgeTypes = { floating: FloatingEdge };

// A click within this many *screen* pixels of a dot's edge still counts as
// hitting it - dots at the smallest radii are only a couple of world units
// across, which at low zoom would otherwise need pixel-perfect precision to
// select at all.
const DOT_CLICK_TOLERANCE_PX = 6;

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
  // The many-thousands-of-systems case: plain circle+label systems drawn
  // straight to canvas instead of as real xyflow nodes (see
  // SystemDotsLayer) - this is what keeps the map fast at full-universe
  // scale. Pass an empty array for a map with nothing but rich nodes.
  dots: MapDot[];
  // Real xyflow nodes for anything that needs to be an actual interactive
  // DOM element - rich cards, or anything that participates in a flow edge
  // (FloatingEdge routes via each node's measured xyflow internals, which
  // only real nodes have). Expected to stay a small set; the bulk of
  // systems belong in `dots` instead.
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
  // Restricts the auto-fit to just the dots with these ids instead of every
  // dot/node - the activity map always renders the *entire* known-space
  // backdrop (every system, not just ones with data) so its systems stay
  // clickable, but fitting to all of them zooms out to frame the whole
  // universe even when actual activity is a tiny cluster inside it. Passing
  // just the dot ids that have data keeps the initial view zoomed to what's
  // actually interesting; omit (or pass an empty list) to fit every
  // dot/node as before.
  fitViewNodeIds?: string[];
};

// The shared, feature-agnostic space map shell: normalized system positions,
// the dim stargate/jump-bridge background layers, region watermark labels,
// themed pan/zoom/minimap. Callers own their own dot/node shapes - this only
// handles the ReactFlow plumbing and chrome that's identical across every
// map built on top of it (sovereignty map, activity map, ...).
const SpaceMapCanvas = <TSystem extends BaseMapSystem, TNodeData extends { color: string }>({
  systems,
  regions,
  edges,
  jumpBridges,
  coordMode,
  dots,
  nodes: nodesProp,
  flowEdges,
  nodeTypes,
  renderDetailPanel,
  initialViewport,
  onViewportChange,
  fitViewKey,
  fitViewNodeIds,
}: SpaceMapCanvasProps<TSystem, TNodeData>) => {
  // We don't wire up onNodesChange (there's nothing to drag/connect here), so
  // xyflow never gets to persist its own "select" change back onto our node
  // objects - without that, `node.selected` never becomes true and
  // elevateNodesOnSelect's z-index math has nothing to elevate. Tracking the
  // selected id ourselves and stamping it onto the nodes we pass in fixes
  // both that z-index elevation and the selection highlight on the card.
  // Selection can also land on a dot (see onPaneClick below) - dots have no
  // DOM element of their own to elevate, so this only visibly matters for
  // real nodes, but the id itself is shared between the two spaces (both key
  // off the same system id) so `selectedSystem` below doesn't need to care
  // which kind was clicked.
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Needed early: getInternalNode lets us read a node's already-known
  // measured size (see below) when stamping selection onto it. fitBounds/
  // screenToFlowPosition/getZoom are plain imperative getters - calling them
  // doesn't subscribe this component to viewport changes, so using them here
  // (rather than the reactive useViewport hook) keeps SpaceMapCanvas from
  // re-rendering - and re-running the nodes memo below - on every pan/zoom
  // frame.
  const { fitBounds, getInternalNode, screenToFlowPosition, getZoom } = useReactFlow();

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

  const regionLabels = useMemo(
    () => computeRegionCentroids(regions, systems, coordMode),
    [regions, systems, coordMode],
  );

  // Feeds the minimap: real nodes (cards etc.) have no fixed radius of their
  // own the way dots do, so the minimap just needs a point + color for them.
  const nodePoints = useMemo(
    () => nodesProp.map((n) => ({ x: n.position.x, y: n.position.y, color: n.data.color })),
    [nodesProp],
  );

  const selectedSystem = useMemo(
    () => systems.find((s) => String(s.id) === selectedNodeId) ?? null,
    [systems, selectedNodeId],
  );

  const { ref, height } = useFillHeight<HTMLDivElement>();

  // Bounding-box hints for the still-unmeasured real nodes (cards) used by
  // the fit-bounds effect below - falls back to each node's initialWidth/
  // initialHeight hint (or a small default) rather than waiting on xyflow's
  // ResizeObserver measurement, which - unlike dots, whose exact radius is
  // already known synchronously - is only actually needed for the (much
  // smaller) set of real nodes, and even then only as an approximation good
  // enough to fit the view.
  const nodeFitPositions = useMemo(
    () =>
      nodesProp.map((n) => ({
        x: n.position.x,
        y: n.position.y,
        halfWidth: (n.measured?.width ?? n.initialWidth ?? 40) / 2,
        halfHeight: (n.measured?.height ?? n.initialHeight ?? 40) / 2,
      })),
    [nodesProp],
  );

  // Switching coordinate systems moves every system to a completely
  // different layout, and switching fitViewKey (e.g. the corp/character a
  // map is scoped to) swaps in a differently-sized/positioned set entirely -
  // either way the previous pan/zoom no longer frames anything meaningful,
  // so re-fit when either changes (but not on every data refresh with the
  // same scope, which would otherwise fight the user's own panning). The one
  // exception is the very first run: if the caller handed us a restored
  // viewport (e.g. from a URL query string), that's an explicit request to
  // land somewhere specific instead of auto-fitting - honour it once, then
  // fall back to the normal re-fit-on-change behaviour.
  //
  // Computing the bounds ourselves from known dot radii/node position hints
  // (rather than xyflow's own fitView, which only counts a node once it's
  // been measured via ResizeObserver) sidesteps a real problem this used to
  // hit: at this map's node count, useNodesInitialized/getFitViewNodes was
  // observed, live, to never resolve at all, permanently blocking every fit.
  const skippedInitialFit = useRef(false);
  useEffect(() => {
    if (!skippedInitialFit.current) {
      skippedInitialFit.current = true;
      if (initialViewport) return;
    }
    const restrictToIds = fitViewNodeIds?.length ? new Set(fitViewNodeIds) : null;
    const targetDots = restrictToIds ? dots.filter((d) => restrictToIds.has(d.id)) : dots;
    const targetNodes = restrictToIds ? [] : nodeFitPositions;
    const bounds = computeFitBounds(targetDots, targetNodes);
    if (bounds) fitBounds(bounds, { padding: 0.1 });
    // Deliberately narrow: `dots`/`nodeFitPositions` (and, once the URL has
    // viewport params, `initialViewport`) get a new reference on essentially
    // every render of a caller like ActivityMapCanvas (its `nodes` prop is a
    // fresh `[]` literal each time, and `initialViewport` is rebuilt from
    // URL query state) - including them here would re-fit, and so undo the
    // user's own pan/zoom, on every render rather than only on an actual
    // scope/coordMode change. `dots` and node positions are still read
    // fresh from closure every time this runs; they just don't drive *when*
    // it runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordMode, fitViewKey, fitViewNodeIds]);

  const handlePaneClick = useCallback(
    (event: { clientX: number; clientY: number }) => {
      const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const tolerance = DOT_CLICK_TOLERANCE_PX / getZoom();
      const hit = findDotAt(dots, pos.x, pos.y, tolerance);
      setSelectedNodeId(hit ? hit.id : null);
    },
    [dots, screenToFlowPosition, getZoom],
  );

  return (
    // xyflow's own Controls chrome is styled via these CSS custom properties
    // (see @xyflow/react/dist/style.css), defaulting to a fixed light
    // palette unless a "dark" class is applied to the root - pointing them
    // at Bootstrap's variables instead keeps the zoom controls in sync with
    // data-bs-theme rather than xyflow's own separate light/dark switch.
    <div
      ref={ref}
      style={
        {
          position: "relative",
          width: "100%",
          height,
          // The stargate/jump-bridge/region-label/dots layers below are
          // drawn as sibling overlays with their own overflow:visible
          // (needed so lines aren't clipped by their own SVG box at every
          // zoom level) - neither that nor xyflow's own container clips
          // content to the map's actual footprint, so at low zoom or once
          // panned, content bleeds out past this box into whatever page
          // chrome sits above/around it. This is the one place that clips
          // the whole assembly back down to the intended area.
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
      <SystemDotsLayer dots={dots} />
      <ReactFlow
        nodes={nodes}
        edges={flowEdges ?? []}
        nodeTypes={nodeTypes}
        edgeTypes={BASE_EDGE_TYPES}
        nodeOrigin={[0.5, 0.5]}
        // Deliberately not using the declarative fitView prop here: the
        // fit-bounds effect above already handles the initial fit (and
        // restricted fitViewNodeIds), so this only needs to restore a saved
        // viewport when we have one.
        {...(initialViewport ? { defaultViewport: initialViewport } : {})}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        elevateNodesOnSelect
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={handlePaneClick}
        onMoveEnd={onViewportChange ? (_, viewport) => onViewportChange(viewport) : undefined}
        minZoom={0.02}
        maxZoom={4}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={64} size={1} style={{ opacity: 0.15 }} />
        <Controls showInteractive={false} />
      </ReactFlow>
      <MapMiniCanvas
        dots={dots}
        nodePoints={nodePoints}
        regionLabels={regionLabels}
        containerRef={ref}
      />
      {selectedSystem &&
        renderDetailPanel &&
        renderDetailPanel(selectedSystem, () => setSelectedNodeId(null))}
    </div>
  );
};

export default SpaceMapCanvas;
