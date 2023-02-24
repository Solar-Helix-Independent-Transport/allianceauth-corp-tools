import { ErrorLoader, PanelLoader } from "../loaders/loaders";
import tableStyles from "./BaseTable.module.css";
import { fuzzyFilter } from "./baseTableFilters";
import { colourStyles } from "./baseTableStyles";
import {
  Column,
  ColumnDef,
  PaginationInitialTableState,
  Table as ReactTable,
  SortingTableState,
  VisibilityTableState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  OverlayTrigger,
  Popover,
  SplitButton,
  Table,
  Tooltip,
} from "react-bootstrap";
import ReactSelect from "react-select";

function MyTooltip(message: string) {
  return <Tooltip id="character_tooltip">{message}</Tooltip>;
}

type tableInitialState = SortingTableState | VisibilityTableState | PaginationInitialTableState;

export interface BaseTableProps extends Partial<HTMLElement> {
  isLoading?: boolean;
  isFetching?: boolean;
  debugTable?: boolean;
  data: any;
  error?: boolean;
  columns: ColumnDef<unknown, any>[];
  asyncExpandFunction?: any;
  initialState?: tableInitialState;
}

const BaseTable = ({
  isLoading,
  isFetching,
  debugTable,
  data,
  error,
  columns,
  asyncExpandFunction,
  initialState,
}: BaseTableProps) => {
  if (isLoading)
    return (
      <>
        <PanelLoader title="Loading Data" message="Please Wait" />
      </>
    );

  if (error)
    return (
      <>
        <ErrorLoader title={"Error Loading from API"} message={"Try Again Later"} />
      </>
    );
  return (
    <BaseTableSpec
      {...{
        data,
        columns,
        isFetching,
        debugTable,
        initialState,
      }}
    />
  );
};

function BaseTableSpec({
  data,
  columns,
  isFetching,
  debugTable = false,
  initialState,
}: BaseTableProps) {
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    //
    debugTable: debugTable,
    initialState: initialState,
  });

  return (
    <>
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <>
              <tr key={`name-${headerGroup.id}`}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() ? (
                            <>
                              {{
                                asc: <i className="fas fa-sort-amount-up-alt pull-right"></i>,
                                desc: <i className="fas fa-sort-amount-down-alt pull-right"></i>,
                              }[header.column.getIsSorted() as string] ?? (
                                <i className="fas fa-sort fa-fw pull-right"></i>
                              )}
                            </>
                          ) : null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
              <tr key={`filter-${headerGroup.id}`}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : (
                        ""
                      )}
                    </th>
                  );
                })}
              </tr>
            </>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
              variant="success"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fas fa-step-backward"></i>
            </Button>{" "}
            <Button
              variant="success"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fas fa-caret-left"></i>
            </Button>{" "}
            <Button
              variant="success"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <i className="fas fa-caret-right"></i>
            </Button>
            <Button
              variant="success"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <i className="fas fa-step-forward"></i>
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button active variant="success">
              {"Page Size:"}
            </Button>
            <SplitButton
              id="pageSizeDropdown"
              variant="success"
              title={table.getState().pagination.pageSize}
            >
              {[10, 50, 100, 1000000].map((_pageSize) => (
                <li
                  id={String(_pageSize)}
                  key={_pageSize}
                  value={_pageSize}
                  onClick={() => {
                    table.setPageSize(Number(_pageSize));
                  }}
                >
                  Show {_pageSize}
                </li>
              ))}
            </SplitButton>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      <div className="pagination pull-left">
        <ButtonGroup>
          <Button active variant="info">
            {
              <>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </>
            }
          </Button>{" "}
          {isFetching ? (
            <OverlayTrigger
              placement="bottom"
              trigger="focus"
              overlay={MyTooltip("Refreshing Data")}
            >
              <Button variant="info">
                <i className={`fas fa-sync-alt fa-fw ${tableStyles.glyphiconRefreshAnimate}`} />
              </Button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              trigger="focus"
              overlay={MyTooltip("Data Loaded: " + new Date().toLocaleString())}
            >
              <Button variant="info">
                <i className="fas fa-check"></i>
              </Button>
            </OverlayTrigger>
          )}
        </ButtonGroup>
      </div>
      {debugTable && (
        <div className="col-xs-12">
          <div>{table.getRowModel().rows.length} Rows</div>
          <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
        </div>
      )}
    </>
  );
}

function Filter({ column, table }: { column: Column<any, any>; table: ReactTable<any> }) {
  const [input, setInput] = useState("");

  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [firstValue, column]
  );

  const selectOptions = sortedUniqueValues
    .slice(0, 50)
    .reduce((previousValue: Array<any>, currentValue: any) => {
      previousValue.push({ value: currentValue, label: currentValue });
      return previousValue;
    }, []);

  const columnFilterValue = column.getFilterValue();

  const popoverNumber = (
    <Popover id="popover-positioned-top">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="form-control"
      />
      <p className="text-center">to</p>
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="form-control"
      />
    </Popover>
  );

  return typeof firstValue === "number" ? (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popoverNumber}>
      <ButtonGroup style={{ display: "flex" }}>
        <Button className={tableStyles.filterBtn} variant="primary" size="sm">
          {`Range`}
        </Button>
        <Button className={tableStyles.filterToggle} variant="primary" size="sm">
          <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
          </svg>
        </Button>
      </ButtonGroup>
    </OverlayTrigger>
  ) : (
    <ReactSelect
      styles={colourStyles}
      isClearable={true}
      onChange={(value, action) => {
        setInput("");
        column.setFilterValue(value ? value.value : "");
      }}
      inputValue={input} // allows you continue where you left off
      onInputChange={(value, action) => {
        if (action.action === "input-change") {
          setInput(value);
          column.setFilterValue(value);
        }
      }}
      placeholder={`Search...`}
      className=""
      options={selectOptions}
    />
  );
}

// export all the base table modules

export { BaseTable }; // Export the table
