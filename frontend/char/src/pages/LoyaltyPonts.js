import { loadLoyaltyPoints } from "../apis/Character";
import { BaseTable, SelectColumnFilter, textColumnFilter } from "../components/BaseTable";
import ErrorBoundary from "../components/ErrorBoundary";
import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharLoyaltyPoints = () => {
  let { characterID } = useParams();

  const { isLoading, isFetching, error, data } = useQuery(
    ["contacts", characterID],
    () => loadLoyaltyPoints(characterID),
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
        filter: "text",
      },
      {
        Header: "Corporation",
        accessor: "corporation.name",
        Filter: textColumnFilter,
        filter: "text",
      },
      {
        Header: "Amount",
        accessor: "amount",
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

export default CharLoyaltyPoints;
