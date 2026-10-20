import CorpMenu from "./CorpMenu";
import { getCorporationMenu } from "../../api/corporation";
import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";

const menuRoot = document.getElementById("nav-left");

const CorpMenuAsync = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["CorpMenu"],
    queryFn: getCorporationMenu,
    throwOnError: false, // handled below
  });
  if (!menuRoot) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CorpMenu error={error ? true : false} isLoading={isLoading} data={data ?? []} />,
    menuRoot,
  );
};

export { CorpMenuAsync };
