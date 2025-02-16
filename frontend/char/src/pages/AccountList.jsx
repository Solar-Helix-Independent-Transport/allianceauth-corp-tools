import { loadAccountList } from "../apis/Character";
import { BaseTable, SelectColumnFilter, textColumnFilter } from "../components/BaseTable";
import ErrorBoundary from "../components/ErrorBoundary";
import { SelectFilter } from "../components/SelectFilter";
import React, { useState } from "react";
import { Button, Glyphicon, Label, Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const AccountList = () => {
  const navigate = useNavigate();
  const [filter_inactive, setFilterInactives] = useState(false);
  const { isLoading, isFetching, error, data } = useQuery(
    ["account-list"],
    () => loadAccountList(),
    {
      initialData: [],
      refetchOnWindowFocus: false,
    },
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Main",
        accessor: "main",
        Cell: (props) =>
          props.value ? (
            <>
              <Button
                className="flex-container flex-wide"
                bsStyle="success"
                id={props.value.character_id}
                //href={"/audit/r_legacy/" + props.value.character_id + "/"}
                onClick={(e) => {
                  navigate(`/audit/r_legacy/${props.value.character_id}/`);
                }}
              >
                <span>{props.value.character_name}</span>
                <Glyphicon style={{ marginLeft: "15px" }} glyph="new-window" />
              </Button>
            </>
          ) : (
            <></>
          ),
      },
      {
        Header: "Corporation",
        accessor: "main.corporation_name",
        Filter: SelectColumnFilter,
        filter: "text",
        Cell: (props) => (props.value ? <span className="no-wrap">{props.value}</span> : <></>),
      },
      {
        Header: "Alliance",
        accessor: "main.alliance_name",
        Filter: SelectColumnFilter,
        filter: "text",
        Cell: (props) => (props.value ? <span className="no-wrap">{props.value}</span> : <></>),
      },
      {
        Header: "Characters",
        accessor: "characters",
        maxWidth: "50%",
        minWidth: "50%",
        disableSortBy: true,
        Cell: (props) =>
          props.value ? (
            <div className="flex-container text-center">
              {props.value.map((char) => {
                return (
                  <Label className="padded-label" bsStyle={char.active ? "primary" : "danger"}>
                    {char.character.character_name}
                  </Label>
                );
              })}
            </div>
          ) : (
            <></>
          ),
        Filter: textColumnFilter,
        filter: (rows, ids, filterValue) => {
          return rows.filter((row) => {
            return ids.some((id) => {
              if (!filterValue) {
                return true;
              } else {
                let rowValue = row.values[id].reduce((p, c) => {
                  return p + "  " + c.character.character_name;
                }, "");
                return rowValue
                  ? rowValue.toLowerCase().includes(filterValue.toLowerCase())
                  : false;
              }
            });
          });
        },
      },
    ],
    [navigate],
  );

  const filterOptions = [
    {
      value: false,
      label: "Show All",
    },
    {
      value: true,
      label: "Show Inactive Only",
    },
  ];

  let tableData = data;

  if (!isLoading && filter_inactive) {
    tableData = tableData.filter(
      (acct) => !acct.characters.reduce((result, char) => result && char.active, true),
    );
  }

  return (
    <ErrorBoundary>
      <Panel.Body>
        <SelectFilter
          setFilter={setFilterInactives}
          options={filterOptions}
          labelText="Filter Missing Characters:"
        />
        <BaseTable data={tableData} {...{ isLoading, isFetching, columns, error }} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default AccountList;
