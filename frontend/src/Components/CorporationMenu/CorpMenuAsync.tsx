import CorpMenu from "./CorpMenu";
import axios from "axios";
import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";

const menuRoot = document.getElementById("nav-left");

const CorpMenuAsync = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["CorpMenu"],
    queryFn: async () => {
      const api = await axios.get(`/audit/api/corp/menu`);
      return api.data;
    },
    refetchOnWindowFocus: false,
  });
  if (!menuRoot) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CorpMenu error={error ? true : false} {...{ isLoading, data }} />,
    menuRoot,
  );
};

export { CorpMenuAsync };
