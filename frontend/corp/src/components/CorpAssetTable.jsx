import { loadAssetContents, loadAssetList } from "../apis/Corporation";
import { BaseTable, SelectColumnFilter, SubRows, textColumnFilter } from "../components/BaseTable";
import ErrorBoundary from "./ErrorBoundary";
import { CorpLoader } from "./NoCorp";
import React from "react";
import { Glyphicon, Panel } from "react-bootstrap";
import { useQuery } from "react-query";

function SubRowAsync({ row, rowProps, visibleColumns }) {
  const { isLoading, error, data } = useQuery(["lazy-load", row.original.id], () =>
    loadAssetContents(row.original.id)
  );

  if (!isLoading) {
    row.originalSubRows = data;
  }

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      data={data}
      error={error}
      isLoading={isLoading}
    />
  );
}

const CorpAssetTable = ({ corporation_id, new_type, location_id = 0 }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["assetList", corporation_id, location_id, new_type],
    () => loadAssetList(corporation_id, location_id, new_type),
    { initialData: [] }
  );
  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRowAsync row={row} rowProps={rowProps} visibleColumns={visibleColumns} />
    ),
    []
  );

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) =>
          row.original.expand ? (
            <span {...row.getToggleRowExpandedProps()}>
              {row.isExpanded ? <Glyphicon glyph="minus-sign" /> : <Glyphicon glyph="plus-sign" />}
            </span>
          ) : (
            <></>
          ),
        // We can override the cell renderer with a SubCell to be used with an expanded row
        SubCell: (cellProps) => <div className="text-center">|</div>,
      },
      {
        Header: "Type",
        accessor: "item.name",
        Filter: textColumnFilter,
        filter: "text",
      },
      {
        Header: "Category",
        accessor: "item.cat",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Location",
        accessor: "location.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
    []
  );

  if (corporation_id === 0) return <CorpLoader />;

  return (
    <ErrorBoundary>
      <Panel.Body>
        <BaseTable
          asyncExpandFunction={renderRowSubComponent}
          {...{ isLoading, isFetching, data, columns, error }}
        />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CorpAssetTable;
