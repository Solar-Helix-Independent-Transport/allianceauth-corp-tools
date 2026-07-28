import StructuresTable from "../../Components/Corporation/Structures";
import { loadAllStructures } from "../../api/corporation";
import { useQuery } from "@tanstack/react-query";

const Structures = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["structures"],
    queryFn: () => loadAllStructures(),
    refetchOnWindowFocus: false,
    initialData: [],
  });

  return (
    <>
      <StructuresTable {...{ data, isFetching }} />
    </>
  );
};

export default Structures;
