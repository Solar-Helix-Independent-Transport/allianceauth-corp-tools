import BaseTable from "../Components/Tables/BaseTable/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

interface AsyncTableProps<TData> {
  apiParams: unknown[];
  apiQueryKey: string;
  apiEndpoint: (params: unknown[]) => Promise<TData[]>;
  columnDefinition: ColumnDef<TData, unknown>[];
}

const AsyncTable = <TData,>({
  apiQueryKey,
  apiParams,
  apiEndpoint,
  columnDefinition,
}: AsyncTableProps<TData>) => {
  const { data, isFetching } = useQuery({
    queryKey: [apiQueryKey, ...apiParams],
    queryFn: () => apiEndpoint(apiParams),
    refetchOnWindowFocus: false,
    initialData: [],
  });

  return <BaseTable data={data} columns={columnDefinition} {...{ isFetching }} />;
};

export default AsyncTable;
