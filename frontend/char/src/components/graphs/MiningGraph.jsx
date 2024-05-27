// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { abbreviateNumber } from "./GraphHelpers";
import { ResponsiveBarCanvas } from "@nivo/bar";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

function tickGen(a, n) {
  // pick n elements from a, distibuted evenly
  if (a.length <= n) {
    return a;
  }
  var p = Math.round(a.length / n);
  console.log(a.length, n, p);

  return a.slice(Math.round(p / 2), p * n + Math.round(p / 2)).filter(function (_, i) {
    return 0 === i % p;
  });
}

export const MiningGraph = ({ data, keys }) => {
  const ticks = tickGen(data, 10).map((e) => {
    return e.id;
  });
  return (
    <ResponsiveBarCanvas
      data={data}
      keys={keys}
      indexBy="id"
      padding={0.2}
      margin={{ top: 10, right: 0, bottom: 50, left: 80 }}
      pixelRatio={2}
      innerPadding={0}
      minValue="auto"
      maxValue="auto"
      groupMode="stacked"
      layout="vertical"
      reverse={false}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "spectral" }}
      colorBy="id"
      borderWidth={0}
      borderRadius={0}
      valueFormat=" ^-,.0f"
      borderColor={{
        from: "color",
        modifiers: [["brighter", 2]],
      }}
      axisRight={null}
      axisBottom={{
        background: "#222",
        tickSize: 5,
        tickPadding: 3,
        tickValues: ticks,
        legend: "Date",
        legendPosition: "middle",
        legendOffset: 35,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: (tick) => `${abbreviateNumber(tick)}`,
        legend: "Daily Volume",
        legendPosition: "middle",
        legendOffset: -70,
      }}
      enableGridX={false}
      enableGridY={true}
      enableLabel={false}
      labelSkipWidth={24}
      labelSkipHeight={24}
      labelTextColor={"#fff"}
      isInteractive={true}
      legends={[]}
      theme={{
        background: "#646464",
        text: {
          fontSize: 11,
          fill: "#fff",
          outlineWidth: 0,
          outlineColor: "transparent",
        },
        axis: {
          domain: {
            line: {
              stroke: "#ddd",
              strokeWidth: 1,
            },
          },
          legend: {
            text: {
              fontSize: 14,
              fill: "#fff",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          ticks: {
            line: {
              stroke: "#ddd",
              strokeWidth: 1,
            },
            text: {
              fontSize: 14,
              fill: "#fff",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        grid: {
          line: {
            stroke: "#999",
            strokeWidth: 1,
          },
        },
        legends: {
          title: {
            text: {
              fontSize: 14,
              fill: "#fff",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          text: {
            fontSize: 14,
            fill: "#fff",
            outlineWidth: 0,
            outlineColor: "transparent",
          },
          ticks: {
            line: {},
            text: {
              fontSize: 12,
              fill: "#000",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        annotations: {
          text: {
            fontSize: 12,
            fill: "#ddd",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          link: {
            stroke: "#ddd",
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          outline: {
            stroke: "#ddd",
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          symbol: {
            fill: "#ddd",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
        },
        tooltip: {
          container: {
            background: "#000",
            fontSize: 14,
          },
          basic: {},
          chip: {},
          table: {},
          tableCell: {},
          tableCellValue: {},
        },
      }}
    />
  );
};
