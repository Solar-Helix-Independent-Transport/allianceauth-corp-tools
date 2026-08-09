// These nodes exist only so the MiniMap has a real flow node to hang its
// region-label text off of (see buildRegionLabelNodes in layout.ts) - the
// visible, large watermark version is drawn separately by RegionLabelsLayer,
// so this renders nothing visible on the actual canvas.
//
// It must still render a real (if invisible) element rather than null,
// though: xyflow measures each node's wrapper via ResizeObserver, and with
// thousands of these on the activity map, a node type that renders no DOM
// content at all can leave that observation permanently unresolved - which
// stalls useNodesInitialized() forever and, with it, any fitView() call
// gated on it. The 1x1 box matches the width/height buildRegionLabelNodes
// already declares on the node itself, so this is just giving xyflow
// something real to observe, not changing the node's footprint.
const RegionLabelNode = () => <div style={{ width: 1, height: 1 }} />;

export default RegionLabelNode;
