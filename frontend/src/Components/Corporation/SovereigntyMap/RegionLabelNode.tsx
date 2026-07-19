// These nodes exist only so the MiniMap has a real flow node to hang its
// region-label text off of (see buildRegionLabelNodes in layout.ts) - the
// visible, large watermark version is drawn separately by RegionLabelsLayer,
// so this renders nothing on the actual canvas.
const RegionLabelNode = () => null;

export default RegionLabelNode;
