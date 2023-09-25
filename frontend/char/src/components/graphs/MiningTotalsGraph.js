// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBarCanvas } from "@nivo/bar";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export const MiningTotalsGraph = ({ data, ores, groups }) => {
  console.log(ores, data);
  return (
    <ResponsiveBarCanvas
      data={data}
      keys={ores}
      indexBy={"name"}
      padding={0.2}
      margin={{ top: 10, right: 0, bottom: 50, left: 80 }}
      pixelRatio={1}
      innerPadding={0}
      minValue="auto"
      maxValue="auto"
      groupMode="stacked"
      layout="vertical"
      reverse={false}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "red_blue" }}
      colorBy="id"
      borderWidth={0}
      borderRadius={0}
      borderColor={{
        from: "color",
        modifiers: [["brighter", 2]],
      }}
      axisRight={null}
      axisBottom={{
        background: "#222",
        tickSize: 5,
        tickPadding: 3,
        legend: "Ore",
        legendPosition: "middle",
        legendOffset: 35,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Total Volume",
        legendPosition: "middle",
        legendOffset: -70,
      }}
      enableGridX={false}
      enableGridY={true}
      enableLabel={false}
      labelSkipWidth={24}
      labelSkipHeight={24}
      labelTextColor={"#fff"}
      valueFormat=" ^-.0f"
      isInteractive={true}
      legends={[]}
      theme={{
        background: "#303030",
        text: {
          fontSize: 12,
          fill: "#fff",
          outlineWidth: 0,
          outlineColor: "transparent",
        },
        axis: {
          domain: {
            line: {
              stroke: "#666",
              strokeWidth: 1,
            },
          },
          legend: {
            text: {
              fontSize: 12,
              fill: "#fff",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          ticks: {
            line: {
              stroke: "#666",
              strokeWidth: 1,
            },
            text: {
              fontSize: 12,
              fill: "#fff",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        grid: {
          line: {
            stroke: "#666",
            strokeWidth: 1,
          },
        },
        legends: {
          title: {
            text: {
              fontSize: 12,
              fill: "#fff",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          text: {
            fontSize: 12,
            fill: "#fff",
            outlineWidth: 0,
            outlineColor: "transparent",
          },
          ticks: {
            line: {},
            text: {
              fontSize: 12,
              fill: "#333333",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        annotations: {
          text: {
            fontSize: 13,
            fill: "#333333",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          link: {
            stroke: "#000000",
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          outline: {
            stroke: "#000000",
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          symbol: {
            fill: "#000000",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
        },
        tooltip: {
          container: {
            background: "#444",
            fontSize: 12,
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
