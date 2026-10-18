import { useQuery } from "@tanstack/react-query";
import { loadSovHubMap } from "../../api/corporation";
import SovereigntyMap from "../../Components/Corporation/SovereigntyMap/SovereigntyMap";

const CorporationSovereigntyMap = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["sovhubmap"],
    queryFn: () => loadSovHubMap(),
    initialData: null,
  });

  return <SovereigntyMap data={data} isFetching={isFetching} />;
};

export default CorporationSovereigntyMap;
