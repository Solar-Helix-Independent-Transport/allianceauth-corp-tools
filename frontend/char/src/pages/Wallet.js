import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadWallet } from "../apis/Character";
import { BaseTable, SelectColumnFilter } from "../components/BaseTable";

const CharWallet = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(
    ["wallet", character_id],
    () => loadWallet(character_id),
    {
      initialData: [],
    }
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
      },
    ],
    []
  );

  return (
    <Panel.Body>
      <BaseTable {...{ isLoading, data, columns, error }} />
    </Panel.Body>
  );
};

export default CharWallet;
