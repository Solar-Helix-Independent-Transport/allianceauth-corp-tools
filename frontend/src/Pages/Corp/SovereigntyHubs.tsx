import SovereigntyHubsTable from "../../Components/Corporation/SovereigntyHubs";
import { loadSovHubs } from "../../api/corporation";
import { useQuery } from "@tanstack/react-query";

const SovereigntyHubs = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["sovhubs"],
    queryFn: () => loadSovHubs(),
    refetchOnWindowFocus: false,
    initialData: [],
  });

  return (
    <>
      <SovereigntyHubsTable {...{ data, isFetching }} />
    </>
  );
};

export default SovereigntyHubs;
