import CharMenu from "./CharMenu";
import { getCharacterMenu } from "../../api/character";
import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";

const menuRoot = document.getElementById("nav-left");

const CharMenuAsync = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["Menu"],
    queryFn: getCharacterMenu,
    throwOnError: false, // handled below
  });
  if (!menuRoot) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CharMenu error={error ? true : false} isLoading={isLoading} data={data ?? []} />,
    menuRoot,
  );
};

export { CharMenuAsync };
