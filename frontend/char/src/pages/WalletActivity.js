import React, { useLayoutEffect } from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadWalletActivity } from "../apis/Character";
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import ErrorBoundary from "../components/ErrorBoundary";
import { PanelLoader } from "../components/PanelLoader";
import { ErrorLoader } from "../components/ErrorLoader";

const CharWalletActivity = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(
    ["wallet-activity", character_id],
    () => loadWalletActivity(character_id),
    {
      initialData: [],
    }
  );

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create series
    // https://www.amcharts.com/docs/v5/charts/flow-charts/
    let series = root.container.children.push(
      am5flow.ChordDirected.new(root, {
        sourceIdField: "firstParty",
        targetIdField: "secondParty",
        valueField: "value",
        sort: "ascending",
        minSize: 0.03,
        padAngle: 3,
        radius: am5.percent(70),
      })
    );

    series.links.template.set("fillStyle", "source");

    series.nodes.get("colors").set("step", 2);

    let headers = new Set();
    let data_set = data.filter((d) => d.value !== 0);

    data_set.map((block) => headers.add(block.firstParty));
    data_set.map((block) => headers.add(block.secondParty));

    series.nodes.data.setAll(
      [...headers].map((a) => {
        return { id: a };
      })
    );

    series.nodes.get("colors").set("step", 2);

    series.bullets.push(function (_root, _series, dataItem) {
      let bullet = am5.Bullet.new(root, {
        locationY: Math.random(),
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: dataItem.get("source").get("fill"),
        }),
      });

      bullet.animate({
        key: "locationY",
        to: 1,
        from: 0,
        duration: Math.random() * 1000 + 2000,
        loops: Infinity,
      });

      return bullet;
    });

    series.nodes.labels.template.setAll({
      fill: root.interfaceColors.get("background"),
      textType: "radial",
      centerX: 0,
      fontSize: 9,
    });

    series.children.moveValue(series.bulletsContainer, 0);
    series.data.setAll(data_set);

    root.current = series;

    return () => {
      root.dispose();
    };
  }, [data]);

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body>
        <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharWalletActivity;
