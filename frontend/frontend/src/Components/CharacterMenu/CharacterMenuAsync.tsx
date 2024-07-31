import CharMenu from "./CharMenu";
import axios from "axios";
import ReactDOM from "react-dom";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const menuRoot = document.getElementById("nav-left");

const CharMenuAsync = () => {
  const { characterID } = useParams();
  const { isLoading, error, data } = useQuery({
    queryKey: ["Menu"],
    queryFn: async () => {
      const api = await axios.get(`/audit/api/account/menu`);
      return api.data;
    },
    refetchOnWindowFocus: false,
  });
  if (!menuRoot) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CharMenu
      error={error ? true : false}
      characterID={String(characterID)}
      {...{ isLoading, data }}
    />,
    menuRoot
  );
};

export { CharMenuAsync };
