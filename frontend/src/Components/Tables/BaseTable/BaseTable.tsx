import { Fragment } from "react";
import tableStyles from "./BaseTable.module.css";
import Filter from "./BaseTableFilter";
import {
  ColumnDef,
  Header,
  HeaderGroup,
  InitialTableState,
  Table as ReactTable,
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
import { stringify } from "csv-stringify/browser/esm/sync";
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
import { useLocation } from "react-router-dom";

function MyTooltip(message: string) {
  return (
    <Tooltip id="character_tooltip" style={{ position: "fixed" }}>
      {message}
    </Tooltip>
  );
}

const isNumber = (cell: any) => typeof cell.getValue() === "number";

const exportToCSV = (table: ReactTable<any>, exportFileName: string) => {
  const { rows } = table.getFilteredRowModel();

  const headerRows = table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) =>
    headerGroup.headers.map((header: Header<any, any>) => {
      if (typeof header.column.columnDef.header === "function") {
        return (header.column.columnDef as any).accessorKey;
      }
      return header.column.columnDef.header;
    }),
  );

  const csvData = rows.map((row: any) => row.getVisibleCells().map((cell: any) => cell.getValue()));

  const csv = stringify([...headerRows, ...csvData]);
  const blob = new Blob([csv], { type: "text/csv;charset=utf8;" });

  const link = document.createElement("a");
  link.download = exportFileName;
  link.href = URL.createObjectURL(blob);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export interface BaseTableProps {
  isFetching?: boolean;
  debugTable?: boolean;
  striped?: boolean;
  hover?: boolean;
  data?: any;
  columns: ColumnDef<any, any>[];
  initialState?: InitialTableState;
  exportFileName?: string;
}

const BaseTable = ({
  isFetching = false,
  debugTable = false,
  data = [],
  columns,
  striped = false,
  hover = false,
  initialState = undefined,
  exportFileName = undefined,
}: BaseTableProps) => {
  const location = useLocation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable,
    initialState: {
      pagination: { pageSize: 15 },
      ...initialState,
    },
  });

  const { rows } = table.getRowModel();
  const fileName =
    exportFileName !== undefined ? exportFileName : `ExportedData_${location.pathname}`;
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <>
      <Table {...{ striped, hover }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
            <Fragment key={headerGroup.id}>
              <tr>
                {headerGroup.headers.map((header: Header<any, any>) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "d-flex align-items-center cursor-pointer select-none"
                            : "d-flex align-items-center"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.column.getCanSort() && (
                          <div>
                            {{
                              asc: <i className="fas fa-sort-down fa-fw"></i>,
                              desc: <i className="fas fa-sort-up fa-fw"></i>,
                            }[header.column.getIsSorted() as string] ?? (
                              <i className="fas fa-sort fa-fw"></i>
                            )}
                          </div>
                        )}
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
              <tr>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.column.getCanFilter() ? (
                      <Filter column={header.column} table={table} />
                    ) : null}
                  </th>
                ))}
              </tr>
            </Fragment>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    verticalAlign: "middle",
                    textAlign: isNumber(cell) ? "right" : "left",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <ButtonGroup style={{ zIndex: 0 }}>
          <Button active variant="info">
            {table.getState().pagination.pageIndex + 1} of {pageCount}
          </Button>
          {isFetching ? (
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={MyTooltip("Refreshing Data")}
            >
              <Button variant="info">
                <i className={`${tableStyles.refreshAnimate} fas fa-sync`}></i>
              </Button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={MyTooltip("Data Loaded: " + new Date().toLocaleString())}
            >
              <Button variant="info">
                <i className="far fa-check-circle"></i>
              </Button>
            </OverlayTrigger>
          )}
          <Button active variant="primary" onClick={() => exportToCSV(table, fileName)}>
            Export Table to CSV
          </Button>
        </ButtonGroup>

        <ButtonToolbar>
          <ButtonGroup style={{ zIndex: 0 }}>
            <Button
              variant="success"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fas fa-angle-double-left"></i>
            </Button>
            <Button
              variant="success"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="fas fa-caret-left"></i>
            </Button>
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

          <ButtonGroup style={{ zIndex: 0 }} className="ms-1">
            <Button active variant="success">
              Page Size:
            </Button>
            <SplitButton
              id="pageSizeDropdown"
              variant="success"
              title={
                table.getState().pagination.pageSize === 1000000
                  ? "All"
                  : table.getState().pagination.pageSize
              }
            >
              {[15, 30, 60, 100, 1000000].map((_pageSize) => (
                <Dropdown.Item
                  id={`${_pageSize}`}
                  key={_pageSize}
                  eventKey={_pageSize}
                  onClick={(eventKey: any) => {
                    table.setPageSize(Number(eventKey.target.id));
                  }}
                >
                  {_pageSize === 1000000 ? "Show All" : `Show ${_pageSize}`}
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
};

export default BaseTable;
