import { BaseTable, textColumnFilter } from "../components/BaseTable";
import ErrorBoundary from "../components/ErrorBoundary";
import React from "react";

function CharContractModalTable({ data, header = "" }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Type",
        accessor: "type_name",
        Filter: textColumnFilter,
        filter: "includes",
      },
      {
        Header: "QTY",
        accessor: "quantity",
      },
    ],
    []
  );

  return (
    <ErrorBoundary>
      {data.length > 0 && (
        <>
          <hr />
          <h4>{header}</h4>
          <BaseTable {...{ data, columns }} />
        </>
      )}
    </ErrorBoundary>
  );
}

export default CharContractModalTable;
