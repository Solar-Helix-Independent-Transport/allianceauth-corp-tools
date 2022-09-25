import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import React, { useLayoutEffect } from "react";

export const ActivityChord = ({ data }) => {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create series
    // https://www.amcharts.com/docs/v5/charts/flow-charts/
    let series = root.container.children.push(
      am5flow.ChordDirected.new(root, {
        sourceIdField: "fpn",
        targetIdField: "spn",
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

    data_set.map((block) => headers.add(block.fpn));
    data_set.map((block) => headers.add(block.spn));

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
      fontSize: 14,
    });

    series.children.moveValue(series.bulletsContainer, 0);
    series.data.setAll(data_set);

    root.current = series;

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="chartdiv" style={{ width: "100%", height: "900px" }}></div>;
};
