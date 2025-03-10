import { postAccountRefresh } from "../api/character";
import styles from "./RefreshAccountButton.module.css";
import Button from "react-bootstrap/Button";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const RefreshCharButton = () => {
  const { characterID } = useParams();

  const { refetch, isFetching } = useQuery(
    "my_key",
    () => {
      return postAccountRefresh(characterID ? Number(characterID) : 0);
    },
    {
      refetchOnWindowFocus: false,
      enabled: false, // disable this query from automatically running
    },
  );
  async function refreshChar() {
    return await refetch();
  }

  return (
    <Button className="btn-success" onClick={refreshChar}>
      <i className={`fa-solid fa-refresh ${isFetching && styles.menuRefreshSpin}`}></i>
    </Button>
  );
};
