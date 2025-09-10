import tableStyles from "./BaseTable.module.css";
import Filter from "./BaseTableFilter";
import {
  Cell,
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

const isNumber = (cell: Cell<any, unknown>) => {
  const value: any = cell.getValue();
  return typeof value === "number";
};

const exportToCSV = (table: ReactTable<any>, exportFileName: string) => {
  const { rows } = table.getCoreRowModel();

  const headerRows = table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => {
    return headerGroup.headers.map((header: Header<any, any> | any) => {
      if (typeof header.column.columnDef.header === "function") {
        return header.column.columnDef.accessorKey;
      }
      return header.column.columnDef.header;
    });
  });

  const csvData = rows.map((row: any) => {
    return row.getVisibleCells().map((cell: any) => {
      return cell.getValue();
    });
  });
  console.log(headerRows);
  console.log(csvData);
  const csv = stringify([...headerRows, ...csvData]);
  const fileType = "csv";
  const blob = new Blob([csv], {
    type: `text/${fileType};charset=utf8;`,
  });

  // spoof a download
  const link = document.createElement("a");
  link.download = exportFileName;
  link.href = URL.createObjectURL(blob);

  // Ensure the link isn't visible to the user or cause layout shifts.
  link.setAttribute("visibility", "hidden");

  // Add to document body, click and remove it.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// function strToKey(keyString: string, ob: object) {
//   return keyString.split(".").reduce(function (p: any, prop: any) {
//     return p[prop];
//   }, ob);
// }

type tableInitialState = SortingTableState | VisibilityTableState | PaginationInitialTableState;

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
  exportFileName?: string;
}

interface _BaseTableProps extends BaseTableProps {
  table: ReactTable<any>;
}

const BaseTable = ({
  // isLoading = false,
  isFetching = false,
  debugTable = false,
  data = [],
  // error = false,
  columns,
  // asyncExpandFunction = undefined,
  striped = false,
  hover = false,
  initialState = undefined,
  exportFileName = undefined,
}: BaseTableProps) => {
  let initState: tableInitialState = {
    pagination: {
      pageSize: 15, //custom default page size
    },
  };
  if (initialState !== undefined) {
    initState = initialState;
  }
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
    // state: initialState,
    initialState: initState,
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
        exportFileName,
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
  exportFileName = undefined,
}: _BaseTableProps) {
  const { rows } = table.getRowModel();
  const location = useLocation();
  const fileName =
    typeof exportFileName !== "undefined" ? exportFileName : `ExportedData_${location.pathname}`;
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

                          {flexRender(header.column.columnDef.header, header.getContext())}
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
                    <td
                      key={cell.id}
                      style={{
                        verticalAlign: "middle",
                        textAlign: isNumber(cell) ? "right" : "left",
                      }}
                    >
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
        <ButtonGroup style={{ zIndex: 0 }}>
          <Button active variant="info">
            {
              <>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </>
            }
          </Button>
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
          <Button active variant="primary" onClick={() => exportToCSV(table, fileName as string)}>
            Export Table to CSV
          </Button>{" "}
        </ButtonGroup>

        <ButtonToolbar>
          <ButtonGroup style={{ zIndex: 0 }}>
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

          <ButtonGroup style={{ zIndex: 0 }} className="ms-1">
            <Button active variant="success">
              {"Page Size:"}
            </Button>{" "}
            <SplitButton
              id="pageSizeDropdown"
              variant="success"
              title={table.getState().pagination.pageSize}
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
