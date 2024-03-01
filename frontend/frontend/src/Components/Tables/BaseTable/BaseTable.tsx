import tableStyles from "./BaseTable.module.css";
import Filter from "./BaseTableFilter";
import {
  ColumnDef,
  Header,
  HeaderGroup,
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
  Dropdown,
  OverlayTrigger,
  SplitButton,
  Table,
  Tooltip,
} from "react-bootstrap";

function MyTooltip(message: string) {
  return <Tooltip id="character_tooltip">{message}</Tooltip>;
}

function strToKey(keyString: string, ob: object) {
  return keyString.split(".").reduce(function (p: any, prop: any) {
    return p[prop];
  }, ob);
}

type tableInitialState = SortingTableState & VisibilityTableState & PaginationInitialTableState;

export interface BaseTableProps extends Partial<HTMLElement> {
  isLoading?: boolean;
  isFetching?: boolean;
  debugTable?: boolean;
  striped?: boolean;
  data?: any;
  error?: boolean;
  hover?: boolean;
  columns: ColumnDef<any, any>[];
  asyncExpandFunction?: any;
  initialState?: tableInitialState;
}

interface _BaseTableProps extends BaseTableProps {
  table: ReactTable<any>;
}

const BaseTable = ({
  isLoading = false,
  isFetching = false,
  debugTable = false,
  data = [],
  error = false,
  columns,
  asyncExpandFunction = undefined,
  striped = false,
  hover = false,
  initialState = undefined,
}: BaseTableProps) => {
  const table = useReactTable({
    data,
    columns,
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
    state: initialState,
  });

  return (
    <_baseTable
      {...{
        table,
        data,
        columns,
        isFetching,
        debugTable,
        initialState,
        striped,
        hover,
      }}
    />
  );
};

function _baseTable({
  table,
  isFetching = false,
  striped = false,
  hover = false,
  debugTable = false,
}: _BaseTableProps) {
  const { rows } = table.getRowModel();
  return (
    <>
      <Table {...{ striped, hover }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
            <>
              <tr key={`name-${headerGroup.id}`}>
                {headerGroup.headers.map((header: Header<any, any>) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "d-flex align-items-center cursor-pointer select-none"
                              : "d-flex align-items-center",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {header.column.getCanSort() ? (
                            <div>
                              {{
                                asc: <i className="fas fa-sort-down fa-fw"></i>,
                                desc: <i className="fas fa-sort-up fa-fw"></i>,
                              }[header.column.getIsSorted() as string] ?? (
                                <i className="fas fa-sort fa-fw"></i>
                              )}
                            </div>
                          ) : null}
                          <div>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
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
                      {header.column.getCanFilter() && rows.length >= 0 ? (
                        <Filter column={header.column} table={table} />
                      ) : (
                        <></>
                      )}
                    </th>
                  );
                })}
              </tr>
            </>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} style={{ verticalAlign: "middle" }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between">
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
                <i className={tableStyles.refreshAnimate + " fas fa-sync"}></i>
              </Button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              trigger="focus"
              overlay={MyTooltip("Data Loaded: " + new Date().toLocaleString())}
            >
              <Button variant="info">
                <i className="far fa-check-circle"></i>
              </Button>
            </OverlayTrigger>
          )}
        </ButtonGroup>

        <ButtonToolbar>
          <ButtonGroup>
            <Button
              variant="success"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fas fa-angle-double-left"></i>
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
              <i className="fas fa-angle-double-right"></i>
            </Button>
          </ButtonGroup>

          <ButtonGroup className="ms-1">
            <Button active variant="success">
              {"Page Size:"}
            </Button>{" "}
            <SplitButton
              id="pageSizeDropdown"
              variant="success"
              title={table.getState().pagination.pageSize}
            >
              {[10, 50, 100, 1000000].map((_pageSize) => (
                <Dropdown.Item
                  id={_pageSize}
                  key={_pageSize}
                  eventKey={_pageSize}
                  value={_pageSize}
                  onSelect={(eventKey: any, event: Object) => {
                    table.setPageSize(Number(eventKey));
                  }}
                >
                  Show {_pageSize}
                </Dropdown.Item>
              ))}
            </SplitButton>
          </ButtonGroup>
        </ButtonToolbar>
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
// export all the base table modules

export default BaseTable; // Export the table
