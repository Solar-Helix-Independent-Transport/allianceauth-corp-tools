import { formatShortValue } from "./layout";

// Matches @xyflow/react's own .react-flow__controls-button CSS (26x26px) -
// the bar/numbers below are centered within a column this wide so they line
// up with the button stack directly beneath, rather than the (much
// narrower) bar's own width.
const CONTROLS_BUTTON_WIDTH = 26;

// Mirrors the EVE in-game star map's activity-circle key: a vertical
// warning->danger bar with the current data source's max/min value labelled
// at either end, and the metric name below - so the heat scale in
// layout.ts's heatColorForFraction has an on-map legend instead of relying
// on the user to infer what the colors mean.
const ActivityLegend = ({ maxValue, title }: { maxValue: number; title: string }) => {
  if (maxValue <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 15,
        bottom: 110,
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        // flex-start (not center): a shrink-to-fit column centers its
        // children on its own widest child, so the title (whose wrapped
        // width varies a lot by data source) would otherwise shift the
        // whole block sideways. The bar/numbers are pinned to the controls'
        // button width via their own fixed-width wrapper below instead.
        alignItems: "flex-start",
        gap: 4,
        pointerEvents: "none",
        color: "var(--bs-body-color)",
        textShadow: "0 1px 2px var(--bs-body-bg)",
      }}
    >
      <div
        style={{
          width: CONTROLS_BUTTON_WIDTH,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600 }}>{formatShortValue(maxValue)}</span>
        <div
          style={{
            width: 8,
            height: 90,
            borderRadius: 4,
            background: "linear-gradient(to top, var(--bs-warning), var(--bs-danger))",
          }}
        />
        <span style={{ fontSize: 11, fontWeight: 600 }}>0</span>
      </div>
      <span
        style={{
          marginTop: 2,
          fontSize: 10,
          maxWidth: 70,
          lineHeight: 1.2,
        }}
      >
        {title}
      </span>
    </div>
  );
};

export default ActivityLegend;
