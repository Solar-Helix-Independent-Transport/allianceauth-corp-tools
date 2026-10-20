import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import tableStyles from "./BaseTable.module.css";
import Filter from "./BaseTableFilter";
import {
  Cell,
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
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useLocation } from "react-router";
import { csvSafe } from "./csvSafe";

function MyTooltip(message: string) {
  return (
    <Tooltip id="character_tooltip" style={{ position: "fixed" }}>
      {message}
    </Tooltip>
  );
}

const isNumber = <TData,>(cell: Cell<TData, unknown>) => typeof cell.getValue() === "number";

const exportToCSV = <TData,>(table: ReactTable<TData>, exportFileName: string) => {
  const { rows } = table.getFilteredRowModel();

  const headerRows = table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) =>
    headerGroup.headers.map((header: Header<TData, unknown>) => {
      const label = header.column.columnDef.header;
      // A rendered (function) header has no text to export - fall back to the
      // column id, which is the accessorKey or the column's explicit id.
      return csvSafe(typeof label === "string" ? label : header.column.id);
    }),
  );

  const csvData = rows.map((row) => row.getVisibleCells().map((cell) => csvSafe(cell.getValue())));

  const csv = stringify([...headerRows, ...csvData]);
  const blob = new Blob([csv], { type: "text/csv;charset=utf8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = exportFileName;
  link.href = url;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Give the browser a moment to start the download before freeing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export interface BaseTableProps<TData> {
  isFetching?: boolean;
  debugTable?: boolean;
  striped?: boolean;
  hover?: boolean;
  data?: TData[];
  columns: ColumnDef<TData, unknown>[];
  initialState?: InitialTableState;
  exportFileName?: string;
}

const BaseTable = <TData,>({
  isFetching = false,
  debugTable = false,
  data = [],
  columns,
  striped = false,
  hover = false,
  initialState = undefined,
  exportFileName = undefined,
}: BaseTableProps<TData>) => {
  const location = useLocation();
  const { t } = useTranslation();

  // When the last fetch finished - not when this last re-rendered. Tables
  // that never fetch (isFetching always false) don't show a time.
  const [loadedAt, setLoadedAt] = useState<Date | undefined>(undefined);
  const wasFetching = useRef(isFetching);
  useEffect(() => {
    if (wasFetching.current && !isFetching) setLoadedAt(new Date());
    wasFetching.current = isFetching;
  }, [isFetching]);

  // TanStack Table's useReactTable() returns functions the compiler can't
  // safely memoize; this is inherent to the library, not fixable here.
  // eslint-disable-next-line react-hooks/incompatible-library
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
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
            <Fragment key={headerGroup.id}>
              <tr>
                {headerGroup.headers.map((header: Header<TData, unknown>) => (
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
              overlay={MyTooltip(t("Refreshing Data"))}
            >
              <Button variant="info">
                <i className={`${tableStyles.refreshAnimate} fas fa-sync`}></i>
              </Button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              trigger={["hover", "focus"]}
              overlay={MyTooltip(
                loadedAt
                  ? t("Data Loaded: {{date}}", { date: loadedAt.toLocaleString() })
                  : t("Data Loaded"),
              )}
            >
              <Button variant="info">
                <i className="far fa-check-circle"></i>
              </Button>
            </OverlayTrigger>
          )}
          <Button active variant="primary" onClick={() => exportToCSV(table, fileName)}>
            {t("Export Table to CSV")}
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

          <div className="d-flex align-items-center ms-2">
            <Form.Label className="m-0 me-2 text-nowrap">{t("Page Size:")}</Form.Label>
            <Form.Select
              style={{ width: "auto" }}
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[15, 30, 60, 100, 1000000].map((_pageSize) => (
                <option key={_pageSize} value={_pageSize}>
                  {_pageSize === 1000000
                    ? t("Show All")
                    : t("Show {{pageSize}}", { pageSize: _pageSize })}
                </option>
              ))}
            </Form.Select>
          </div>
        </ButtonToolbar>
      </div>

      {debugTable && (
        <div className="col-xs-12">
          <div>{t("{{count}} Rows", { count: table.getRowModel().rows.length })}</div>
          <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default BaseTable;
