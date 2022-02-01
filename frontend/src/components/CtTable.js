import React from "react";
import { Button } from "react-bootstrap";
import { useTable, useFilters, usePagination } from "react-table";
import Select from "react-select";
import {
  ButtonToolbar,
  ButtonGroup,
  Glyphicon,
  MenuItem,
  SplitButton,
  Table,
} from "react-bootstrap";

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  return <></>;
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { setFilter, filterValue, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Select
      key={filterValue}
      title={filterValue}
      onChange={(e) => setFilter(e.value)}
      value={{ label: filterValue || "All" }}
      defaultValue={{ label: "All" }}
      options={[{ id: -1, value: "", label: "All" }].concat(
        options.map((o, i) => {
          return { id: i, value: o, label: o };
        })
      )}
    />
  );
}

export const CtTable = ({ isLoading, data, error, columns }) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, defaultColumn, initialState: { pageSize: 25 } },
    useFilters,
    usePagination
  );

  if (isLoading) return <></>;

  if (error) return <div></div>;

  return (
    <>
      <Table striped>
        <thead {...getTableProps()}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="pagination pull-right">
        <ButtonToolbar>
          <ButtonGroup>
            <Button
              bsStyle="success"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <Glyphicon glyph="step-backward" />
            </Button>{" "}
            <Button
              bsStyle="success"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <Glyphicon glyph="triangle-left" />
            </Button>{" "}
            <Button
              bsStyle="success"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <Glyphicon glyph="triangle-right" />
            </Button>{" "}
            <Button
              bsStyle="success"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <Glyphicon glyph="step-forward" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button active bsStyle="success">
              {"Page Size:"}
            </Button>{" "}
            <SplitButton
              bsStyle="success"
              title={pageSize}
              onSelect={(e) => {
                console.log(e);
                setPageSize(Number(e));
              }}
            >
              {[25, 50, 100, 1000].map((pageSize) => (
                <MenuItem eventKey={pageSize} value={pageSize}>
                  Show {pageSize}
                </MenuItem>
              ))}
            </SplitButton>
          </ButtonGroup>
          <ButtonGroup>
            <Button active bsStyle="info">
              {
                <>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>
                </>
              }
            </Button>{" "}
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    </>
  );
};
