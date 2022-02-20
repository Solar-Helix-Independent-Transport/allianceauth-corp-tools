import React from "react";
import { Panel, Label } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadAccountList } from "../apis/Character";
import {
  BaseTable,
  textColumnFilter,
  SelectColumnFilter,
} from "../components/BaseTable";

const AccountList = () => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["account-list"],
    () => loadAccountList(),
    {
      initialData: [],
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Main",
        accessor: "main.character_name",
      },
      {
        Header: "Corporation",
        accessor: "main.corporation_name",
        Filter: SelectColumnFilter,
        filter: "text",
      },
      {
        Header: "Alliance",
        accessor: "main.alliance_name",
        Filter: SelectColumnFilter,
        filter: "text",
      },
      {
        Header: "Characters",
        accessor: "characters",
        disableSortBy: true,
        Cell: (props) =>
          props.value ? (
            <div className="text-center">
              {props.value.map((char) => {
                return (
                  <Label
                    className="padded-label"
                    bsStyle={char.active ? "primary" : "danger"}
                  >
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
    []
  );

  return (
    <Panel.Body>
      <BaseTable {...{ isLoading, isFetching, data, columns, error }} />
    </Panel.Body>
  );
};

export default AccountList;
