import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadWallet } from "../apis/Character";
import {
  BaseTable,
  SelectColumnFilter,
  textColumnFilter,
} from "../components/BaseTable";
import ErrorBoundary from "../components/ErrorBoundary";

const CharWallet = ({ character_id }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["wallet", character_id],
    () => loadWallet(character_id),
    {
      initialData: { items: [], count: 0 },
      refetchOnWindowFocus: false,
    },
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Character",
        accessor: "character.character_name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
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
    [],
  );

  return (
    <ErrorBoundary>
      <Panel.Body>
        <BaseTable
          data={data["items"]}
          {...{ isLoading, isFetching, columns, error }}
        />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharWallet;
