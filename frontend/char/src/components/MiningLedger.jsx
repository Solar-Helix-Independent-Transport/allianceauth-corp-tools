// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import "./MiningLedger.css";
import { MiningGraph } from "./graphs/MiningGraph";
import { MiningGraphBrush } from "./graphs/MiningGraphBrush";
import { MiningTotalsGraph } from "./graphs/MiningTotalsGraph";
import { useState } from "react";
import ReactSlider from "react-slider";

function dateSort(a, b) {
  if (a.date > b.date) {
    return 1;
  }
  if (a.date < b.date) {
    return -1;
  }
  return 0;
}

// Function to create js objects from python api data. types later...
function apiDataToObject(input, dataKey = "volume") {
  let out = input.map((d) => {
    let o = {
      id: d.date,
    };
    for (let i = 0; i < d.ores.length; ++i) o[d.ores[i]["name"]] = d.ores[i][dataKey];
    return o;
  });
  return out;
}

// Function to create js objects from python api data. types later...
function apiDataToTotals(group_list, ore_list, input, dataKey = "volume") {
  let out = Object.fromEntries(
    group_list.map((x) => [x, Object.fromEntries(ore_list.map((x) => [x, 0]))])
  );
  console.log("PRE", out);
  input.map((d) => {
    for (let i = 0; i < d.ores.length; ++i)
      out[d.ores[i]["group"]][d.ores[i]["name"]] += d.ores[i][dataKey];
    return 0;
  });
  console.log("POST", out);

  return Object.entries(out).map((elem) => {
    let out = { name: elem[0] };
    Object.entries(elem[1]).map((subElem) => (out[subElem[0]] = subElem[1]));
    return out;
  });
}

const MiningLedger = ({ data }) => {
  const [slice, setSlice] = useState([0, data.data.length]);
  data.data.sort(dateSort);
  const graphData = apiDataToObject(
    data.data.filter((e, index) => {
      let pass = slice[0] < index && index < slice[1];
      return pass;
    })
  );
  const totalData = apiDataToTotals(
    data.all_groups,
    data.all_ores,
    data.data.filter((e, index) => {
      let pass = slice[0] < index && index < slice[1];
      return pass;
    })
  );
  return (
    <div
      style={{
        background: "#646464",
        color: "#ffffff",
        paddingTop: "2px",
        paddingBottom: "2px",
        borderRadius: "10px",
        margin: "5px",
      }}
    >
      <div style={{ height: "250px", margin: "5px", background: "#646464" }}>
        <MiningTotalsGraph data={totalData} groups={data.all_groups} ores={data.all_ores} />
      </div>
      <div style={{ height: "300px", margin: "5px", background: "#646464" }}>
        <MiningGraph data={graphData} keys={data.all_ores} />
      </div>
      <div style={{ display: "flex", margin: "7px" }}>
        <p style={{ margin: "5px", marginTop: "auto", marginBottom: "auto" }}>Zoom:</p>
        <div style={{ flexGrow: "1", height: "50px" }}>
          <ReactSlider
            className="slider"
            thumbClassName="thumb"
            trackClassName="track"
            defaultValue={[0, data.data.length - 1]}
            pearling
            minDistance={3}
            min={0}
            max={data.data.length - 1}
            onChange={(value) => setSlice(value)}
          />
          <div style={{ height: "50px", top: "-50px" }}>
            <MiningGraphBrush data={apiDataToObject(data.data)} keys={data.all_ores} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningLedger;
