import { useTranslation } from "react-i18next";
import { ResponsiveRadar } from "@nivo/radar";
import { useQuery } from "@tanstack/react-query";
import { getCharacterSkillGraph } from "../../api/character";
import { getCSSVariable } from "./GraphHelpers";

// getCharacterSkillGraph's OpenAPI schema is under-specified (loose
// object), so the response is asserted to the shape this component
// actually consumes:
// { data: [{ group: "Gunnery", "Name 1": 500, ... }, ...], characters: ["Name 1", ...] }
type SkillGraphResponse = {
  data: Record<string, unknown>[];
  characters: string[];
};

export const SkillsRadarGraph = ({ characterID }: { characterID: number }) => {
  const { t } = useTranslation();
  const { isLoading, error, data } = useQuery({
    queryKey: ["skillgraph", characterID ? Number(characterID) : 0],
    queryFn: () =>
      getCharacterSkillGraph(
        characterID ? Number(characterID) : 0,
      ) as unknown as Promise<SkillGraphResponse>,
    refetchOnWindowFocus: false,
  });
  const bg = getCSSVariable("--bs-body-bg");
  const txt = getCSSVariable("--bs-body-color");
  const bdr = getCSSVariable("--bs-light-border-subtle");

  if (isLoading) return <div>{t("Loading...")}</div>;

  if (error || !data) return <div>{t("Error loading data")}</div>;

  return (
    <ResponsiveRadar
      colors={{ scheme: "category10" }}
      data={data.data}
      keys={data.characters}
      indexBy="group"
      margin={{ top: 70, right: 80, bottom: 100, left: 80 }}
      gridLabelOffset={50}
      dotSize={5}
      dotColor={{ theme: "background" }}
      dotBorderWidth={3}
      maxValue={100}
      fillOpacity={0.2}
      blendMode="normal"
      curve="cardinalClosed"
      // legends={[
      //     {
      //         anchor: 'top-left',
      //         direction: 'column',
      //         translateX: -50,
      //         translateY: -40,
      //         itemWidth: 80,
      //         itemHeight: 20,
      //         symbolShape: 'circle'
      //     }
      // ]}
      theme={{
        background: bg,
        text: {
          fontSize: 11,
          fill: txt,
          outlineWidth: 0,
          outlineColor: "transparent",
        },
        axis: {
          domain: {
            line: {
              stroke: bdr,
              strokeWidth: 1,
            },
          },
          legend: {
            text: {
              fontSize: 14,
              fill: txt,
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          ticks: {
            line: {
              stroke: bdr,
              strokeWidth: 1,
            },
            text: {
              fontSize: 14,
              fill: txt,
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        grid: {
          line: {
            stroke: bdr,
            strokeWidth: 1,
          },
        },
        legends: {
          title: {
            text: {
              fontSize: 14,
              fill: txt,
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          text: {
            fontSize: 14,
            fill: txt,
            outlineWidth: 0,
            outlineColor: "transparent",
          },
          ticks: {
            line: {},
            text: {
              fontSize: 12,
              fill: bdr,
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        annotations: {
          text: {
            fontSize: 12,
            fill: bg,
            outlineWidth: 2,
            outlineColor: txt,
            outlineOpacity: 1,
          },
          link: {
            stroke: bg,
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: txt,
            outlineOpacity: 1,
          },
          outline: {
            stroke: bg,
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: txt,
            outlineOpacity: 1,
          },
          symbol: {
            fill: bg,
            outlineWidth: 2,
            outlineColor: txt,
            outlineOpacity: 1,
          },
        },
        tooltip: {
          container: {
            width: 250,
            background: bg,
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
