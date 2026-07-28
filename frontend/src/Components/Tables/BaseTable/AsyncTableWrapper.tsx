import BaseTable from "./BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { QueryKey, useQuery } from "@tanstack/react-query";

const AsyncTableWrapper = <TData,>({
  queryFn,
  queryKey,
  columns,
}: {
  queryFn: () => Promise<TData[]>;
  queryKey: QueryKey;
  columns: ColumnDef<TData, unknown>[];
}) => {
  const { data, isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    refetchOnWindowFocus: false,
  });

  return <BaseTable {...{ isFetching, columns, data }} />;
};

export default AsyncTableWrapper;
