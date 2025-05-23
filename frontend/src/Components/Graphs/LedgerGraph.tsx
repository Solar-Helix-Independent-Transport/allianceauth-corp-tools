import "./MiningLedger.css";
import { useState } from "react";
import ReactSlider from "react-slider";
import { MiningTotalsGraph } from "../../Components/Graphs/MiningTotalsGraph";
import { MiningGraph } from "../../Components/Graphs/MiningGraph";
import { MiningGraphBrush } from "../../Components/Graphs/MiningGraphBrush";
import { createColumnHelper } from "@tanstack/react-table";
import TableWrapper from "../Tables/BaseTable/TableWrapper";
import { useTranslation } from "react-i18next";
import { TypeIcon, CharacterPortrait } from "../EveImages/EveImages";
import { Card, Form } from "react-bootstrap";

// Function to create js objects from python api data. types later...
function apiDataToObject(input: any, dataKey = "volume") {
  let out = input.map((d: any) => {
    let o: any = {
      id: d.date,
    };
    for (let i = 0; i < d.ores.length; ++i) o[d.ores[i]["name"]] = d.ores[i][dataKey];
    return o;
  });
  return out;
}

// Function to create js objects from python api data. types later...
function apiDataToTotals(group_list: any, ore_list: any, input: any, dataKey = "volume") {
  let out = Object.fromEntries(
    group_list.map((x: any) => [x, Object.fromEntries(ore_list.map((x: any) => [x, 0]))]),
  );
  input.map((d: any) => {
    for (let i = 0; i < d.ores.length; ++i)
      out[d.ores[i]["group"]][d.ores[i]["name"]] += Math.floor(Number(d.ores[i][dataKey]));
    return 0;
  });

  return Object.entries(out).map((elem) => {
    let out: any = { name: elem[0] };
    Object.entries(elem[1]).map((subElem) => (out[subElem[0]] = subElem[1]));
    return out;
  });
}

const LedgerGraph = ({ data }: any) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState(false);
  const [slice, setSlice] = useState([0, data.data.length]);

  const graphData = apiDataToObject(
    data.data.filter((_: any, index: any) => {
      let pass = slice[0] < index && index < slice[1];
      return pass;
    }),
    mode ? "value" : "volume",
  );

  const tableData = data.data.filter((e: any, index: any) => {
    let pass = slice[0] < index && index < slice[1];
    pass = pass && e.characters.length > 0;
    return pass;
  });

  const totalData = apiDataToTotals(
    data.all_groups,
    data.all_ores,
    data.data.filter((_: any, index: any) => {
      let pass = slice[0] < index && index < slice[1];
      return pass;
    }),
    mode ? "value" : "volume",
  );

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("date", {
      header: t("Date"),
    }),
    columnHelper.accessor("value", {
      header: () => <span className="ms-auto">{t("Total Value")}</span>,
      enableColumnFilter: false,
      cell: (cell) => (
        <p className=" m-0 w-100 text-end">{`${Math.floor(
          Number(cell.getValue()),
        ).toLocaleString()} Isk`}</p>
      ),
    }),
    columnHelper.accessor("volume", {
      header: () => <span className="ms-auto">{t("Total Volume")}</span>,
      enableColumnFilter: false,
      cell: (cell) => `${Math.floor(Number(cell.getValue())).toLocaleString()} m3`,
    }),
    columnHelper.accessor("characters", {
      header: t("Characters"),
      enableSorting: false,
      enableColumnFilter: false,
      cell: (cell) =>
        cell.getValue()?.map((d: any) => {
          return (
            <>
              <CharacterPortrait className="me-2" character_id={d.id} size={32} />
              {`${d.name}`}
              <br />
            </>
          );
        }),
    }),
    columnHelper.accessor("systems", {
      header: t("Systems"),
      enableSorting: false,
      enableColumnFilter: false,
      cell: (cell) =>
        cell.getValue()?.map((d: any) => {
          return (
            <>
              {`${d.name}`}
              <br />
            </>
          );
        }),
    }),
    columnHelper.accessor("ores", {
      header: () => <span className="ms-auto">{t("Detail")}</span>,
      enableSorting: false,
      enableColumnFilter: false,
      cell: (cell) => (
        <table className="w-100">
          <tr>
            <th>{t("Type")}</th>
            <th className="text-end">{t("Volume")}</th>
            <th className="text-end">{t("Value")}</th>
          </tr>
          {cell.getValue()?.map((d: any) => {
            return (
              <>
                <tr>
                  <td style={{ width: "60%" }}>
                    <TypeIcon type_id={d.id} size={32} />
                    {d.name}
                  </td>
                  <td className="text-end" style={{ width: "20%" }}>
                    {Math.floor(Number(d.volume)).toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                      notation: "compact",
                      compactDisplay: "short",
                    })}{" "}
                    m3
                  </td>
                  <td className="text-end" style={{ width: "20%" }}>
                    {Math.floor(Number(d.value)).toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                      notation: "compact",
                      compactDisplay: "short",
                    })}{" "}
                    Isk
                  </td>
                </tr>
              </>
            );
          })}
        </table>
      ),
    }),
  ];

  return (
    <>
      <div className="d-flex me-2">
        <Form.Check
          type="switch"
          id="custom-switch"
          label={t("Show As Value")}
          className="ms-auto"
          onChange={(event: any) => {
            setMode(event.target.checked);
          }}
          defaultChecked={mode}
        />
      </div>
      <Card
        className="m-1"
        // style={{
        //   // background: "#646464",
        //   // color: "#ffffff",
        //   paddingTop: "2px",
        //   paddingBottom: "2px",
        //   borderRadius: "10px",
        //   margin: "5px",
        // }}
      >
        <div style={{ height: "250px", margin: "5px", background: "#646464" }}>
          <MiningTotalsGraph
            data={totalData}
            groups={data.all_groups}
            ores={data.all_ores}
            dataType={mode ? "Value" : "Volume"}
          />
        </div>
        <div style={{ height: "300px", margin: "5px", background: "#646464" }}>
          <MiningGraph data={graphData} keys={data.all_ores} dataType={mode ? "Value" : "Volume"} />
        </div>
        <div style={{ display: "flex", margin: "7px" }}>
          <p style={{ margin: "5px", marginTop: "auto", marginBottom: "auto" }}>Zoom:</p>
          <div style={{ flexGrow: "1", height: "50px" }}>
            <ReactSlider
              className="slider"
              thumbClassName="thumb"
              trackClassName="track"
              // @ts-ignore:
              defaultValue={[0, data.data.length - 1]}
              pearling
              minDistance={3}
              min={0}
              max={data.data.length - 1}
              onChange={(value: any) => setSlice(value)}
            />
            <div style={{ height: "50px", top: "-50px" }}>
              <MiningGraphBrush data={apiDataToObject(data.data)} keys={data.all_ores} />
            </div>
          </div>
        </div>
      </Card>
      <Card className="m-1 mt-3">
        <TableWrapper data={tableData} columns={columns} isFetching={false} />
      </Card>
    </>
  );
};

export default LedgerGraph;
