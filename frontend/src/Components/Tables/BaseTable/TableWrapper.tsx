import BaseTable from "../../Tables/BaseTable/BaseTable";
import { ColumnDef } from "@tanstack/react-table";

const TableWrapper = <TData,>({
  data,
  isFetching,
  columns,
}: {
  data?: TData[];
  isFetching: boolean;
  columns: ColumnDef<TData, unknown>[];
}) => {
  return <BaseTable {...{ isFetching, columns, data }} />;
};

export default TableWrapper;
