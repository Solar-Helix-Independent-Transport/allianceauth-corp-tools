import BaseTable from "./BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "react-query";

const AsyncTableWrapper = ({
  queryFn,
  queryKey,
  columns,
}: {
  queryFn: any;
  queryKey: any;
  columns: ColumnDef<any, any>[];
}) => {
  const { data, isFetching } = useQuery({
    queryKey: queryFn,
    queryFn: queryKey,
    refetchOnWindowFocus: false,
  });

  return <BaseTable {...{ isFetching, columns, data }} />;
};

export default AsyncTableWrapper;
