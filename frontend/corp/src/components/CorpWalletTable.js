import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import ErrorBoundary from "../components/ErrorBoundary";
import { loadWallet } from "../apis/Corporation";
import { BaseTable, SelectColumnFilter, textColumnFilter } from "./BaseTable";

const CorpWalletTable = ({ corporation_id, refTypes = "", page = 1 }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["wallet", corporation_id, refTypes, page],
    () => loadWallet(corporation_id, refTypes, page),
    {
      initialData: [],
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        Cell: (props) => <div> {new Date(props.value).toLocaleString()} </div>,
      },
      {
        Header: "Type",
        accessor: "ref_type",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "First Party",
        accessor: "first_party.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Second Party",
        accessor: "second_party.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (props) => <div> {props.value.toLocaleString()} </div>,
      },
      {
        Header: "Ballance",
        accessor: "balance",
        Cell: (props) => <div> {props.value.toLocaleString()} </div>,
      },
      {
        Header: "Reason",
        accessor: "reason",
        Filter: textColumnFilter,
        filter: "text",
      },
    ],
    []
  );

  return (
    <ErrorBoundary>
      <Panel.Body>
        <BaseTable {...{ isLoading, isFetching, data, columns, error }} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CorpWalletTable;
