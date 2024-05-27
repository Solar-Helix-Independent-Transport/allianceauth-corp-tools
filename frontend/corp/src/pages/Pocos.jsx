import { loadPocos } from "../apis/Structures";
import {
  BaseTable,
  SelectColumnFilter,
  colourStyles,
  textColumnFilter,
} from "../components/BaseTable";
import { CorporationLogo } from "../components/EveImages";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import Select from "react-select";

TimeAgo.addDefaultLocale(en);

export const CorpPocos = () => {
  const { isLoading, isFetching, error, data } = useQuery(["pocos"], () => loadPocos(), {
    initialData: [],
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "Region",
        accessor: "location.region",
        Filter: SelectColumnFilter,
      },
      {
        Header: "Planet",
        accessor: "location.name",
        Filter: textColumnFilter,
        filter: "text",
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
        Header: "Standing Access",
        accessor: "allow_access_with_standings",
        Cell: (props) => (
          <p>
            {props.value ? (
              <i class="fas fa-check-circle"></i>
            ) : (
              <i class="fas fa-times-circle"></i>
            )}
          </p>
        ),
      },
      {
        Header: "Alliance Access",
        accessor: "allow_alliance_access",
        Cell: (props) => (
          <p>
            {props.value ? (
              <i class="fas fa-check-circle"></i>
            ) : (
              <i class="fas fa-times-circle"></i>
            )}
          </p>
        ),
      },
      {
        Header: "Alliance",
        accessor: "alliance_tax_rate",
      },
      {
        Header: "Corporation",
        accessor: "corporation_tax_rate",
      },
      {
        Header: "Terrible",
        accessor: "terrible_standing_tax_rate",
      },
      {
        Header: "Bad",
        accessor: "bad_standing_tax_rate",
      },
      {
        Header: "Neutral",
        accessor: "neutral_standing_tax_rate",
      },
      {
        Header: "Good",
        accessor: "good_standing_tax_rate",
      },
      {
        Header: "Excellent",
        accessor: "excellent_standing_tax_rate",
      },
      {
        Header: "Ref Exit Start",
        accessor: "reinforce_exit_start",
      },
      {
        Header: "Ref Exit End",
        accessor: "reinforce_exit_end",
      },
    ],
    []
  );

  return (
    <Panel.Body>
      <BaseTable {...{ isLoading, isFetching, data, columns, error }} />
    </Panel.Body>
  );
};
