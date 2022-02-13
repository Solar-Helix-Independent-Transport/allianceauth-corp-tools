import React from "react";
import { Button } from "react-bootstrap";
import { useTable, useFilters, usePagination, useSortBy } from "react-table";
import Select from "react-select";
import { Bars } from "@agney/react-loading";
import {
  ButtonToolbar,
  ButtonGroup,
  Glyphicon,
  MenuItem,
  SplitButton,
  Table,
} from "react-bootstrap";
import "./BaseTable.css";

export const colourStyles = {
  option: (styles) => {
    return {
      ...styles,
      color: "black",
    };
  },
};

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  return <></>;
}

export function textColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      className="form-control"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
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
    if (!preFilteredRows) {
      return [];
    }
    preFilteredRows.forEach((row) => {
      if (row.values[id] !== null) {
        if (typeof row.values[id] === "object") {
          options.add(row.values[id]["name"]);
        } else {
          options.add(row.values[id]);
        }
      }
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
      styles={colourStyles}
      options={[{ id: -1, value: "", label: "All" }].concat(
        options.map((o, i) => {
          return { id: i, value: o, label: o };
        })
      )}
    />
  );
}

const defaultPropGetter = () => ({});

export const BaseTable = ({
  isLoading,
  data,
  error,
  columns,
  getRowProps = defaultPropGetter,
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, ids, filterValue) => {
        return rows.filter((row) => {
          return ids.some((id) => {
            if (!filterValue) {
              return true;
            } else {
              let rowValue = row.values[id];
              if (typeof rowValue === "object") {
                rowValue = rowValue.name;
              }
              return rowValue
                ? rowValue.toLowerCase().includes(filterValue.toLowerCase())
                : false;
            }
          });
        });
      },
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
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageSize: 25 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  if (isLoading)
    return (
      <div className="col-xs-12 text-center">
        <Bars className="spinner-size" />
      </div>
    );

  if (error) return <div></div>;

  return (
    <>
      <Table striped>
        <thead {...getTableProps()}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span className="pull-right">
                    {column.canSort ? (
                      column.isSorted ? (
                        column.isSortedDesc ? (
                          <Glyphicon glyph="sort-by-attributes-alt" />
                        ) : (
                          <Glyphicon glyph="sort-by-attributes" />
                        )
                      ) : (
                        <Glyphicon glyph="sort" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
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
              <tr {...row.getRowProps(getRowProps(row))}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      style={{ verticalAlign: "middle" }}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
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
        </ButtonToolbar>
      </div>
      <div className="pagination pull-left">
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
      </div>
    </>
  );
};
