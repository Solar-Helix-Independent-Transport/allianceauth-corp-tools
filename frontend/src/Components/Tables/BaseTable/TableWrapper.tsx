import BaseTable, { BaseTableProps } from "../../Tables/BaseTable/BaseTable";
import { ColumnDef } from "@tanstack/react-table";

const TableWrapper = <TData,>({
  data,
  isFetching,
  columns,
  initialState,
}: {
  data?: TData[];
  isFetching: boolean;
  columns: ColumnDef<TData, unknown>[];
  initialState?: BaseTableProps<TData>["initialState"];
}) => {
  return <BaseTable {...{ isFetching, columns, data, initialState }} />;
};

export default TableWrapper;
