import BaseTable from "../Components/Tables/BaseTable/BaseTable";
import { useQuery } from "react-query";

interface AsyncTableProps {
  apiParams: Array<any>;
  apiQueryKey: string;
  apiEndpoint: (params: any) => Array<any>;
  columnDefinition: any;
}

const AsyncTable = ({ apiQueryKey, apiParams, apiEndpoint, columnDefinition }: AsyncTableProps) => {
  const { data, isFetching } = useQuery({
    queryKey: [apiQueryKey, ...apiParams],
    queryFn: () => apiEndpoint(apiParams),
    refetchOnWindowFocus: false,
    initialData: [],
  });

  return <BaseTable data={data} columns={columnDefinition} {...{ isFetching }} />;
};

export default AsyncTable;
