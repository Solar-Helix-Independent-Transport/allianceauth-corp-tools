import { loadAssetContents, loadAssetList } from "../apis/Character";
import { BaseTable, SelectColumnFilter, SubRows, textColumnFilter } from "../components/BaseTable";
import ErrorBoundary from "./ErrorBoundary";
import React from "react";
import { Glyphicon, Panel } from "react-bootstrap";
import { useQuery } from "react-query";

function SubRowAsync({ row, rowProps, visibleColumns }) {
  const { isLoading, error, data } = useQuery(
    ["lazy-load", row.original.id],
    () => loadAssetContents(row.original.character.character_id, row.original.id),
    { refetchOnWindowFocus: false }
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

const CharAssetTable = ({ character_id, location_id = 0 }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["assetList", character_id, location_id],
    () => loadAssetList(character_id, location_id),
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
        SubCell: () => null, // No expander on an expanded row
      },
      {
        Header: "Character",
        accessor: "character.character_name",
        Filter: SelectColumnFilter,
        filter: "includes",
        SubCell: () => " - ",
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

export default CharAssetTable;
