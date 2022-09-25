import { ErrorLoader } from "../components/ErrorLoader";
import "./BaseTable.css";
import { Bars } from "@agney/react-loading";
import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  ButtonGroup,
  ButtonToolbar,
  Glyphicon,
  MenuItem,
  SplitButton,
  Table,
} from "react-bootstrap";
import Select from "react-select";
import { useExpanded, useFilters, usePagination, useSortBy, useTable } from "react-table";

export function SubRows({ row, rowProps, visibleColumns, data, error, isLoading }) {
  if (isLoading) {
    return (
      <tr>
        <td />
        <td colSpan={visibleColumns.length - 1}>Loading...</td>
      </tr>
    );
  }
  if (error) {
    return (
      <tr>
        <td />
        <td colSpan={visibleColumns.length - 1}>Unable to Fetch from API!</td>
      </tr>
    );
  }

  if (data.length === 0) {
    return (
      <tr>
        <td />
        <td colSpan={visibleColumns.length - 1}>Empty!</td>
      </tr>
    );
  }

  // error handling here :)

  return (
    <>
      {data.map((x, i) => {
        return (
          <tr {...rowProps} key={`${rowProps.key}-expanded-${i}`}>
            {row.cells.map((cell) => {
              return (
                <td {...cell.getCellProps()}>
                  {cell.render(cell.column.SubCell ? "SubCell" : "Cell", {
                    value: cell.column.accessor && cell.column.accessor(x, i),
                    row: { ...row, original: x },
                  })}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

export const colourStyles = {
  option: (styles) => {
    return {
      ...styles,
      color: "black",
    };
  },
};

function MyTooltip({ message }) {
  return <Tooltip id="character_tooltip">{message}</Tooltip>;
}

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  return <></>;
}

export function textColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
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
export function SelectColumnFilter({ column: { setFilter, filterValue, preFilteredRows, id } }) {
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

function strToKey(keyString, ob) {
  return keyString.split(".").reduce(function (p, prop) {
    return p[prop];
  }, ob);
}

export const BaseTable = ({
  isLoading,
  isFetching,
  data,
  error,
  columns,
  asyncExpandFunction,
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
              if (row.hasOwnProperty("originalSubRows")) {
                rowValue += row.originalSubRows.reduce((p, r) => {
                  return (p += " " + strToKey(id, r));
                }, "");
              }
              return rowValue ? rowValue.toLowerCase().includes(filterValue.toLowerCase()) : false;
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
    visibleColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageSize: 20,
        sortBy: [],
      },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  if (isLoading)
    return (
      <div className="col-xs-12 text-center">
        <Bars className="spinner-size" />
      </div>
    );

  if (error) return <ErrorLoader />;

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
            const rowProps = getRowProps(row);
            return (
              <>
                <tr {...row.getRowProps(rowProps)}>
                  {row.cells.map((cell) => {
                    return (
                      <td style={{ verticalAlign: "middle" }} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded && asyncExpandFunction({ row, rowProps, visibleColumns })}
              </>
            );
          })}
        </tbody>
      </Table>
      <div className="pagination pull-right">
        <ButtonToolbar>
          <ButtonGroup>
            <Button bsStyle="success" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              <Glyphicon glyph="step-backward" />
            </Button>{" "}
            <Button bsStyle="success" onClick={() => previousPage()} disabled={!canPreviousPage}>
              <Glyphicon glyph="triangle-left" />
            </Button>{" "}
            <Button bsStyle="success" onClick={() => nextPage()} disabled={!canNextPage}>
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
              id="pageSizeDropdown"
              bsStyle="success"
              title={pageSize}
              onSelect={(e) => {
                setPageSize(Number(e));
              }}
            >
              {[20, 50, 100, 1000000].map((pageSize) => (
                <MenuItem id={pageSize} key={pageSize} eventKey={pageSize} value={pageSize}>
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
                {pageOptions.length > 0 ? (
                  <>
                    Page{" "}
                    <strong>
                      {pageIndex + 1} of {pageOptions.length}
                    </strong>
                  </>
                ) : (
                  <>
                    Page <strong>- of -</strong>
                  </>
                )}
              </>
            }
          </Button>{" "}
          {isFetching ? (
            <OverlayTrigger placement="bottom" overlay={MyTooltip({ message: "Refreshing Data" })}>
              <Button bsStyle="info">
                <Glyphicon className="glyphicon-refresh-animate" glyph="refresh" />
              </Button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={MyTooltip({
                message: "Data Loaded: " + new Date().toLocaleString(),
              })}
            >
              <Button bsStyle="info">
                <Glyphicon glyph="ok" />
              </Button>
            </OverlayTrigger>
          )}
        </ButtonGroup>
      </div>
    </>
  );
};
