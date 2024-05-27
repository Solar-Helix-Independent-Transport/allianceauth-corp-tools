import { loadMarket } from "../apis/Character";
import { BaseTable, SelectColumnFilter } from "../components/BaseTable";
import ErrorBoundary from "../components/ErrorBoundary";
import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharMarket = () => {
  let { characterID } = useParams();
  const { isLoading, isFetching, error, data } = useQuery(
    ["market", characterID],
    () => loadMarket(characterID),
    {
      initialData: [],
      refetchOnWindowFocus: false,
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
        accessor: "item.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Location",
        accessor: "location.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: (props) => <div> {props.value.toLocaleString()} </div>,
      },
      {
        Header: "Volume",
        accessor: "volume_remain",
        Cell: (props) => (
          <>
            {props.value}/{props.cell.row.original.volume_total}
          </>
        ),
      },
    ],
    []
  );
  let active = [];
  let expired = [];
  if (data.active) {
    active = data.active;
    expired = data.expired;
  }
  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container-vert-fill">
        <div>
          <h4 className="text-center">
            Active Orders
            <br />
            {data.active ? (
              <span className="small">Remaining: ${data.total_active.toLocaleString()}</span>
            ) : (
              <></>
            )}
          </h4>
          <BaseTable data={active} {...{ isLoading, isFetching, columns, error }} />
        </div>
        <hr />
        <div>
          <h4 className="text-center">
            Expired Orders
            <br />
            {data.active ? (
              <span className="small">Total: ${data.total_expired.toLocaleString()}</span>
            ) : (
              <></>
            )}
          </h4>
          <BaseTable data={expired} {...{ isLoading, isFetching, columns, error }} />
        </div>
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharMarket;
