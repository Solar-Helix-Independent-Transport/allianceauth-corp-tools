import { ResponsiveChord } from "@nivo/chord";
import { getCSSVariable } from "./GraphHelpers";
import { COMPACT_NUM_FORMAT } from "../Cards/IconStatusCard";

const MAX_ENTITIES = 12;

function buildChordData(rows: any[]) {
  const totals: Record<string, number> = {};
  rows.forEach((row) => {
    totals[row.fpn] = (totals[row.fpn] || 0) + Math.abs(row.value);
    totals[row.spn] = (totals[row.spn] || 0) + Math.abs(row.value);
  });

  const keys = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, MAX_ENTITIES)
    .map(([k]) => k);

  const idx = Object.fromEntries(keys.map((k, i) => [k, i]));
  const data = keys.map(() => keys.map(() => 0));

  rows.forEach((row) => {
    const fi = idx[row.fpn];
    const si = idx[row.spn];
    if (fi !== undefined && si !== undefined && fi !== si) {
      data[fi][si] += Math.abs(row.value);
    }
  });

  return { keys, data };
}

const WalletActivityChord = ({ data: rows }: { data: any[] }) => {
  const bg = getCSSVariable("--bs-body-bg");
  const txt = getCSSVariable("--bs-body-color");
  const bdr = getCSSVariable("--bs-light-border-subtle");

  if (!rows?.length) return null;

  const { keys, data } = buildChordData(rows);

  if (keys.length < 2) return null;

  return (
    <div style={{ height: "500px" }}>
      <ResponsiveChord
        data={data}
        keys={keys}
        margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
        padAngle={0.02}
        innerRadiusRatio={0.96}
        innerRadiusOffset={0.02}
        inactiveArcOpacity={0.25}
        arcBorderWidth={1}
        arcBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        inactiveRibbonOpacity={0.25}
        ribbonBorderWidth={1}
        ribbonBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
        enableLabel={true}
        label="id"
        labelOffset={12}
        labelRotation={-90}
        labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
        colors={{ scheme: "spectral" }}
        isInteractive={true}
        arcTooltip={({ arc }) => (
          <div
            style={{
              background: bg,
              color: txt,
              padding: "6px 10px",
              borderRadius: 4,
              border: `1px solid ${bdr}`,
              fontSize: 13,
            }}
          >
            <strong>{arc.label}</strong>
            <br />
            {Math.abs(arc.value).toLocaleString("en-US", COMPACT_NUM_FORMAT)} ISK
          </div>
        )}
        ribbonTooltip={({ ribbon }) => (
          <div
            style={{
              background: bg,
              color: txt,
              padding: "6px 10px",
              borderRadius: 4,
              border: `1px solid ${bdr}`,
              fontSize: 13,
            }}
          >
            <strong>{ribbon.source.label}</strong>
            {" → "}
            <strong>{ribbon.target.label}</strong>
            <br />
            {Math.abs(ribbon.source.value).toLocaleString("en-US", COMPACT_NUM_FORMAT)} ISK
          </div>
        )}
        theme={{
          background: bg,
          text: { fontSize: 11, fill: txt, outlineWidth: 0, outlineColor: "transparent" },
          tooltip: { container: { background: bg, fontSize: 13, color: txt } },
        }}
      />
    </div>
  );
};

export default WalletActivityChord;
