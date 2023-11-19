import { loadContacts } from "../apis/Character";
import { BaseTable, SelectColumnFilter, textColumnFilter } from "../components/BaseTable";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CharMining = () => {
  let { characterID } = useParams();

  const [slice, setState] = useState({
    start: 0,
    end: 1,
  });

  // const { isLoading, isFetching, error, data } = useQuery(
  //   ["contacts", characterID],
  //   () => loadContacts(characterID),
  //   {
  //     initialData: [],
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const data = [
    {
      due_date: new Date("2023-05-05"),
      type: "Solid Pyroxeres",
      qty: 63,
    },
    {
      due_date: new Date("2023-05-04"),
      type: "Solid Pyroxeres",
      qty: 63,
    },
    {
      due_date: new Date("2023-05-03"),
      type: "Solid Pyroxeres",
      qty: 63,
    },
    {
      due_date: new Date("2023-05-02"),
      type: "Viscous Pyroxeres",
      qty: 63,
    },
    {
      due_date: new Date("2023-05-01"),
      type: "Pyroxeres",
      qty: 63,
    },
    {
      due_date: new Date("2023-05-04"),
      type: "Pyroxeres",
      qty: 55,
    },
    {
      due_date: new Date("2023-05-03"),
      type: "Pyroxeres",
      qty: 63,
    },
    {
      due_date: new Date("2023-05-01"),
      type: "Pyroxeres",
      qty: 63,
    },
  ];

  data.sort(function (a, b) {
    return a.due_date - b.due_date;
  });

  function formatXAxis(tickItem) {
    // If using moment.js
    return tickItem.toLocaleString();
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Character",
        accessor: "character.character_name",
        Filter: SelectColumnFilter,
        filter: "text",
      },
      {
        Header: "Contact",
        accessor: "contact.name",
        Filter: textColumnFilter,
        filter: "text",
      },
      {
        Header: "Blocked",
        accessor: "blocked",
        Cell: (props) => (
          <span className={props.value ? "fas fa-check-circle" : "far fa-times-circle"} />
        ),
        disableSortBy: true,
      },
      {
        Header: "Watching",
        accessor: "watched",
        Cell: (props) => (
          <span className={props.value ? "fas fa-check-circle" : "far fa-times-circle"} />
        ),
        disableSortBy: true,
      },
      {
        Header: "Standing",
        accessor: "standing",
      },
      {
        Header: "Type",
        accessor: "contact.cat",
        Filter: SelectColumnFilter,
        filter: "text",
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <ErrorBoundary>
      <Panel.Body>
        <LineChart
          width={500}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="due_date" tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pv" stroke="#ff0000" fill="#ff0000" />
          <Line type="monotone" dataKey="uv" stroke="#00ff00" fill="#00ff00" />
          <Line type="monotone" dataKey="amt" stroke="#0000ff" fill="#0000ff" />
          <Brush dataKey={"due_date"} tickFormatter={formatXAxis}>
            <AreaChart
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <Area type="monotone" dataKey="pv" stroke="#ff0000" fill="#ff0000a0" />
              <Area type="monotone" dataKey="uv" stroke="#00ff00" fill="#00ff00a0" />
              <Area type="monotone" dataKey="amt" stroke="#0000ff" fill="#0000ffa0" />
            </AreaChart>
          </Brush>
        </LineChart>

        <BaseTable {...{ data, columns }} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharMining;
