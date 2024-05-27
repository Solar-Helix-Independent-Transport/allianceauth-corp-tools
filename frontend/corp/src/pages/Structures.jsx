import { loadStructures } from "../apis/Structures";
import {
  BaseTable,
  SelectColumnFilter,
  colourStyles,
  textColumnFilter,
} from "../components/BaseTable";
import { TypeIcon } from "../components/EveImages";
import { CorporationLogo } from "../components/EveImages";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import React from "react";
import { Label, Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import Select from "react-select";
import ReactTimeAgo from "react-time-ago";

TimeAgo.addDefaultLocale(en);

export const CorpStructures = () => {
  const { isLoading, isFetching, error, data } = useQuery(["stuctures"], () => loadStructures(), {
    initialData: [],
  });

  const valueSort = React.useMemo(
    () => (rowA, rowB, columnId, desc) => {
      const a = rowA.values[columnId] ? rowA.values[columnId] : "0001-01-01T00:00:00Z";
      const b = rowB.values[columnId] ? rowB.values[columnId] : "0001-01-01T00:00:00Z";
      if (a > b) return 1;
      if (b > a) return -1;
      return 0; //null at end
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
          <a href={"https://evemaps.dotlan.net/system/" + props.value.name.replace(" ", "_")}>
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
        Filter: ({ column: { setFilter, filterValue, preFilteredRows, id } }) => {
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
          <div>
            {props.value ? (
              <>
                {/* {props.value}<br/> */}
                <ReactTimeAgo date={props.value} />
              </>
            ) : (
              ""
            )}
          </div>
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
        Filter: ({ column: { setFilter, filterValue, preFilteredRows, id } }) => {
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
            <div
              className="text-center"
              style={{
                maxWidth: "300px",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                alignContent: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
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
      <BaseTable {...{ isLoading, isFetching, data, columns, error }} />
    </Panel.Body>
  );
};
