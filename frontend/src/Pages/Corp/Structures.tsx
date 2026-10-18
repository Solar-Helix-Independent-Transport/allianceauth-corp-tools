import StructuresTable from "../../Components/Corporation/Structures";
import { loadAllStructures } from "../../api/corporation";
import { useQuery } from "@tanstack/react-query";

const Structures = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["structures"],
    queryFn: () => loadAllStructures(),
    initialData: [],
  });

  return (
    <>
      <StructuresTable {...{ data, isFetching }} />
    </>
  );
};

export default Structures;
