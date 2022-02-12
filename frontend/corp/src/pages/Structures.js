import React from "react";
import { Panel, Label } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadStructures } from "../apis/Structures";
import Select from "react-select";
import {
  BaseTable,
  SelectColumnFilter,
  textColumnFilter,
  colourStyles,
} from "../components/BaseTable";
import ReactTimeAgo from "react-time-ago";
import { TypeIcon } from "../components/EveImages";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { CorporationLogo } from "../components/EveImages";

TimeAgo.addDefaultLocale(en);

export const CorpStructures = () => {
  const { isLoading, error, data } = useQuery(
    ["stuctures"],
    () => loadStructures(),
    {
      initialData: [],
    }
  );

  const valueSort = React.useMemo(
    () => (rowA, rowB, columnId) => {
      const a = rowA.values[columnId];
      const b = rowB.values[columnId];
      if ((a === null) | (b === null)) {
        return 1; //null at end
      }
      return a > b ? 1 : -1;
    },
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "System",
        accessor: "location",
        Filter: SelectColumnFilter,
        filter: "text",
        Cell: (props) => (
          <a
            href={
              "https://evemaps.dotlan.net/system/" +
              props.value.name.replace(" ", "_")
            }
          >
            {props.value.name}
          </a>
        ),
      },
      {
        Header: "Structure",
        accessor: "name",
        Filter: textColumnFilter,
        filter: "text",
      },
      {
        Header: "Type",
        accessor: "type",
        disableSortBy: true,
        Filter: SelectColumnFilter,
        filter: "text",
        Cell: (props) => (
          <div className="flex-image-text">
            <div className="pull-left">
              <TypeIcon type_id={props.value.id}></TypeIcon>
            </div>
            <div className="pull-left">{props.value.name}</div>
          </div>
        ),
      },
      {
        Header: "Owner",
        accessor: "owner",
        disableSortBy: true,
        Filter: ({
          column: { setFilter, filterValue, preFilteredRows, id },
        }) => {
          const options = React.useMemo(() => {
            const options = new Set();
            if (!preFilteredRows) {
              return [];
            }
            preFilteredRows.forEach((row) => {
              if (row.values[id] !== null) {
                options.add(row.values[id].corporation_name);
              }
            });
            return [...options.values()];
          }, [id, preFilteredRows]);
          return (
            <Select
              key={filterValue}
              title={filterValue}
              onChange={(e) => setFilter(e.value)}
              value={{ label: filterValue || "All" }}
              defaultValue={{ label: "All" }}
              styles={colourStyles}
              options={[{ id: -1, value: "", label: "All" }].concat(
                options.map((o, i) => {
                  return { id: i, value: o, label: o };
                })
              )}
            />
          );
        },
        filter: (rows, ids, filterValue) => {
          return rows.filter((row) => {
            return ids.some((id) => {
              if (!filterValue) {
                return true;
              } else {
                let rowValue = row.values[id].corporation_name;
                return rowValue
                  ? rowValue.toLowerCase().includes(filterValue.toLowerCase())
                  : false;
              }
            });
          });
        },
        Cell: (props) => (
          <div className="flex-image-text">
            <div className="pull-left">
              <CorporationLogo
                corporation_id={props.value.corporation_id}
                size={32}
              ></CorporationLogo>
            </div>
            <div className="pull-left">{props.value.corporation_name}</div>
          </div>
        ),
      },
      {
        Header: "Fuel Expiry",
        accessor: "fuel_expiry",
        sortType: valueSort,
        Cell: (props) => (
          <div>{props.value ? <ReactTimeAgo date={props.value} /> : ""}</div>
        ),
      },
      {
        Header: "State",
        accessor: "state",
        Filter: SelectColumnFilter,
        disableSortBy: true,
        filter: "text",
      },
      {
        Header: "Services",
        accessor: "services",
        disableSortBy: true,
        Filter: ({
          column: { setFilter, filterValue, preFilteredRows, id },
        }) => {
          const options = React.useMemo(() => {
            const options = new Set();
            if (!preFilteredRows) {
              return [];
            }
            preFilteredRows.forEach((row) => {
              if (row.values[id] !== null) {
                row.values[id].forEach((service) => {
                  options.add(service.name);
                });
              }
            });
            return [...options.values()];
          }, [id, preFilteredRows]);
          return (
            <Select
              key={filterValue}
              title={filterValue}
              onChange={(e) => setFilter(e.value)}
              value={{ label: filterValue || "All" }}
              defaultValue={{ label: "All" }}
              styles={colourStyles}
              options={[{ id: -1, value: "", label: "All" }].concat(
                options.map((o, i) => {
                  return { id: i, value: o, label: o };
                })
              )}
            />
          );
        },
        filter: (rows, ids, filterValue) => {
          return rows.filter((row) => {
            return ids.some((id) => {
              if (!filterValue) {
                return true;
              } else {
                let rowValue = row.values[id].reduce((p, c) => {
                  return p + "  " + c.name;
                }, "");
                return rowValue
                  ? rowValue.toLowerCase().includes(filterValue.toLowerCase())
                  : false;
              }
            });
          });
        },
        Cell: (props) =>
          props.value ? (
            <div className="text-center">
              {props.value.map((service) => {
                return (
                  <Label
                    className="padded-label"
                    bsStyle={service.state === "online" ? "primary" : "danger"}
                  >
                    {service.name}
                  </Label>
                );
              })}
            </div>
          ) : (
            <></>
          ),
      },
    ],
    [valueSort]
  );

  return (
    <Panel.Body>
      <BaseTable {...{ isLoading, data, columns, error }} />
    </Panel.Body>
  );
};
