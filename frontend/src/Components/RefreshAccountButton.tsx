import { postAccountRefresh } from "../api/character";
import styles from "./RefreshAccountButton.module.css";
import Button from "react-bootstrap/Button";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const RefreshCharButton = () => {
  const { characterID } = useParams();

  const { refetch, isFetching } = useQuery({
    queryKey: ["my_key"],
    queryFn: () => {
      return postAccountRefresh(characterID ? Number(characterID) : 0);
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });
  async function refreshChar() {
    return await refetch();
  }

  return (
    <Button className="btn-success" onClick={refreshChar}>
      <i className={`fa-solid fa-refresh ${isFetching && styles.menuRefreshSpin}`}></i>
    </Button>
  );
};
