import { useQuery } from "@tanstack/react-query";
import { loadPublicSovHubMap } from "../../api/corporation";
import SovereigntyMap from "../../Components/Corporation/SovereigntyMap/SovereigntyMap";

const DashSovereigntyMap = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["sovhubmap-public"],
    queryFn: () => loadPublicSovHubMap(),
    refetchOnWindowFocus: false,
    initialData: null,
  });

  return <SovereigntyMap data={data} isFetching={isFetching} upgradesOnly />;
};

export default DashSovereigntyMap;
