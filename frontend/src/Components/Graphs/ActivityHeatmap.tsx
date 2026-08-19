import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { scaleBand, scaleSequential } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import { getCSSVariable } from "./GraphHelpers";
import { components } from "../../api/CtApi";

type HeatmapData = components["schemas"]["GlanceActivityHeatmap"];

// Rows are UTC 4h blocks - matches how the backend buckets
// CharacterWalletJournalEntry.date (always UTC, as returned by ESI).
const BLOCK_LABELS = ["0000-0400", "0400-0800", "0800-1200", "1200-1600", "1600-2000", "2000-2400"];

// Day-only rows on top - CharacterMiningLedger.date and the ratting-ISK
// aggregate have no time-of-day breakdown
const MINING_ROW_LABEL = "Mining (m3)";
const RATTING_ROW_LABEL = "Ratting (ISK)";
const DAY_ROW_LABELS = [RATTING_ROW_LABEL, MINING_ROW_LABEL];
const ROW_LABELS = [...DAY_ROW_LABELS, ...BLOCK_LABELS];

const LOOK_BACK_DAYS = 90;
const HEIGHT = 200;
const MARGIN = { top: 10, right: 10, bottom: 30, left: 70 };

function isWeekend(day: string): boolean {
  const dow = new Date(day).getUTCDay();
  return dow === 0 || dow === 6;
}

function buildDayRange(days: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

type Hover = {
  row: string;
  day: string;
  value: number;
  unit: string;
  clientX: number;
  clientY: number;
};

type DayRow = {
  label: string;
  data: Map<string, number>;
  colorScale: (value: number) => string;
  unit: string;
};

const HeatmapGrid = memo(function HeatmapGrid({
  days,
  counts,
  dayRows,
  innerWidth,
  colorScale,
  emptyColor,
  gridLineColor,
  onHover,
  onLeave,
}: {
  days: string[];
  counts: Map<string, number>;
  dayRows: DayRow[];
  innerWidth: number;
  colorScale: (value: number) => string;
  emptyColor: string;
  gridLineColor: string;
  onHover: (h: Hover) => void;
  onLeave: () => void;
}) {
  const xScale = useMemo(
    () => scaleBand<string>().domain(days).range([0, innerWidth]).paddingInner(0.02),
    [days, innerWidth],
  );
  const yScale = useMemo(
    () =>
      scaleBand<string>()
        .domain(ROW_LABELS)
        .range([0, HEIGHT - MARGIN.top - MARGIN.bottom])
        .paddingInner(0.02),
    [],
  );

  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();

  return (
    <>
      {dayRows.map((row) => {
        const y = yScale(row.label) ?? 0;
        return days.map((day) => {
          const value = row.data.get(day) ?? 0;
          const x = xScale(day) ?? 0;
          return (
            <rect
              key={`${row.label}-${day}`}
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              fill={value > 0 ? row.colorScale(value) : emptyColor}
              onMouseEnter={(e) =>
                onHover({
                  row: row.label,
                  day,
                  value,
                  unit: row.unit,
                  clientX: e.clientX,
                  clientY: e.clientY,
                })
              }
              onMouseMove={(e) =>
                onHover({
                  row: row.label,
                  day,
                  value,
                  unit: row.unit,
                  clientX: e.clientX,
                  clientY: e.clientY,
                })
              }
              onMouseLeave={onLeave}
            />
          );
        });
      })}
      {BLOCK_LABELS.map((block, blockIdx) => {
        const y = yScale(block) ?? 0;
        return days.map((day) => {
          const value = counts.get(`${day}-${blockIdx}`) ?? 0;
          const x = xScale(day) ?? 0;
          return (
            <rect
              key={`${day}-${blockIdx}`}
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              fill={value > 0 ? colorScale(value) : emptyColor}
              onMouseEnter={(e) =>
                onHover({
                  row: block,
                  day,
                  value,
                  unit: "transactions",
                  clientX: e.clientX,
                  clientY: e.clientY,
                })
              }
              onMouseMove={(e) =>
                onHover({
                  row: block,
                  day,
                  value,
                  unit: "transactions",
                  clientX: e.clientX,
                  clientY: e.clientY,
                })
              }
              onMouseLeave={onLeave}
            />
          );
        });
      })}
      {days.map((day, i) => {
        if (!isWeekend(day)) return null;
        const x = xScale(day) ?? 0;
        const gridHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
        // Only the outer edges of the Sat+Sun block - not the boundary
        // between Saturday night and Sunday morning.
        const showLeft = !isWeekend(days[i - 1] ?? "");
        const showRight = !isWeekend(days[i + 1] ?? "");
        return (
          <g key={`weekend-${day}`}>
            {showLeft && (
              <line x1={x} x2={x} y1={0} y2={gridHeight} stroke={gridLineColor} strokeWidth={1} />
            )}
            {showRight && (
              <line
                x1={x + cellW}
                x2={x + cellW}
                y1={0}
                y2={gridHeight}
                stroke={gridLineColor}
                strokeWidth={1}
              />
            )}
          </g>
        );
      })}
      {(() => {
        const miningTop = yScale(MINING_ROW_LABEL) ?? 0;
        const miningBottom = miningTop + cellH;
        return (
          <>
            <line
              x1={0}
              x2={innerWidth}
              y1={miningTop}
              y2={miningTop}
              stroke={gridLineColor}
              strokeWidth={1}
            />
            <line
              x1={0}
              x2={innerWidth}
              y1={miningBottom}
              y2={miningBottom}
              stroke={gridLineColor}
              strokeWidth={1}
            />
          </>
        );
      })()}
    </>
  );
});

function toMap<T>(rows: T[] | undefined, key: (row: T) => string, value: (row: T) => number) {
  const m = new Map<string, number>();
  rows?.forEach((row) => m.set(key(row), value(row)));
  return m;
}

const ActivityHeatmap = ({ data }: { data?: HeatmapData }) => {
  const bg = getCSSVariable("--bs-body-bg");
  const txt = getCSSVariable("--bs-body-color");
  const bdr = getCSSVariable("--bs-light-border-subtle");
  const warningColor = getCSSVariable("--bs-warning");
  const infoColor = getCSSVariable("--bs-info");
  const successColor = getCSSVariable("--bs-success");

  const [containerRef, containerWidth] = useContainerWidth();
  const [hover, setHover] = useState<Hover | null>(null);

  const onHover = useCallback((h: Hover) => setHover(h), []);
  const onLeave = useCallback(() => setHover(null), []);

  const days = useMemo(() => buildDayRange(LOOK_BACK_DAYS), []);

  const counts = useMemo(
    () =>
      toMap(
        data?.cells,
        (c) => `${c.day}-${c.block}`,
        (c) => c.count,
      ),
    [data],
  );
  const mining = useMemo(
    () =>
      toMap(
        data?.mining,
        (m) => m.day,
        (m) => m.m3,
      ),
    [data],
  );
  const ratting = useMemo(
    () =>
      toMap(
        data?.ratting,
        (r) => r.day,
        (r) => r.isk,
      ),
    [data],
  );

  const maxCount = useMemo(() => Math.max(1, ...(data?.cells.map((c) => c.count) ?? [1])), [data]);
  const maxMining = useMemo(() => Math.max(1, ...(data?.mining.map((m) => m.m3) ?? [1])), [data]);
  const maxRatting = useMemo(
    () => Math.max(1, ...(data?.ratting.map((r) => r.isk) ?? [1])),
    [data],
  );

  // Lowest value = the panel's own background colour, highest = the
  // matching bootstrap theme colour
  // transactions/warning
  // mining/info
  // ratting/success
  const colorScale = useMemo(
    () => scaleSequential(interpolateRgb(bg, warningColor)).domain([0, maxCount]),
    [bg, warningColor, maxCount],
  );
  const miningColorScale = useMemo(
    () => scaleSequential(interpolateRgb(bg, infoColor)).domain([0, maxMining]),
    [bg, infoColor, maxMining],
  );
  const rattingColorScale = useMemo(
    () => scaleSequential(interpolateRgb(bg, successColor)).domain([0, maxRatting]),
    [bg, successColor, maxRatting],
  );

  const dayRows: DayRow[] = useMemo(
    () => [
      { label: RATTING_ROW_LABEL, data: ratting, colorScale: rattingColorScale, unit: "ISK" },
      { label: MINING_ROW_LABEL, data: mining, colorScale: miningColorScale, unit: "m3" },
    ],
    [ratting, rattingColorScale, mining, miningColorScale],
  );

  const innerWidth = Math.max(0, containerWidth - MARGIN.left - MARGIN.right);
  const yScale = useMemo(
    () =>
      scaleBand<string>()
        .domain(ROW_LABELS)
        .range([0, HEIGHT - MARGIN.top - MARGIN.bottom])
        .paddingInner(0.02),
    [],
  );

  const hasData = !!(data && (data.cells.length || data.mining.length || data.ratting.length));
  if (!hasData) return null;

  // Thin the x-axis labels to roughly one every 7 days
  const xTickDays = days.filter((_, i) => i % 7 === 0);
  const xScale = scaleBand<string>().domain(days).range([0, innerWidth]).paddingInner(0.02);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg width="100%" height={HEIGHT}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {containerWidth > 0 && (
            <HeatmapGrid
              days={days}
              counts={counts}
              dayRows={dayRows}
              innerWidth={innerWidth}
              colorScale={colorScale}
              emptyColor={bg}
              gridLineColor={bdr}
              onHover={onHover}
              onLeave={onLeave}
            />
          )}
          {ROW_LABELS.map((row) => (
            <text
              key={row}
              x={-8}
              y={(yScale(row) ?? 0) + yScale.bandwidth() / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill={txt}
            >
              {row}
            </text>
          ))}
          {xTickDays.map((day) => (
            <text
              key={day}
              x={(xScale(day) ?? 0) + xScale.bandwidth() / 2}
              y={HEIGHT - MARGIN.top - MARGIN.bottom + 16}
              textAnchor="middle"
              fontSize={10}
              fill={txt}
            >
              {day}
            </text>
          ))}
        </g>
      </svg>
      {hover && (
        <div
          style={{
            position: "fixed",
            left: hover.clientX + 12,
            top: hover.clientY + 12,
            background: bg,
            color: txt,
            padding: "6px 10px",
            borderRadius: 4,
            border: `1px solid ${bdr}`,
            fontSize: 13,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <strong>{hover.row}</strong>
          {" - "}
          {hover.day}
          <br />
          {hover.unit === "m3" || hover.unit === "ISK"
            ? hover.value.toLocaleString("en-US", { maximumFractionDigits: 1 })
            : hover.value}{" "}
          {hover.unit}
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
