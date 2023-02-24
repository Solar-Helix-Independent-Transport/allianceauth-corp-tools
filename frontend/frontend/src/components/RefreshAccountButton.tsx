import { postAccountRefresh } from "../api/character";
import styles from "./RefreshAccountButton.module.css";
import React from "react";
import Button from "react-bootstrap/Button";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const RefreshCharButton = () => {
  let { characterID } = useParams();

  const { data, isLoading, status, refetch, isFetching } = useQuery(
    "my_key",
    () => {
      return postAccountRefresh(characterID);
    },
    {
      refetchOnWindowFocus: false,
      enabled: false, // disable this query from automatically running
    }
  );
  async function refreshChar() {
    return await refetch();
  }

  console.log(data, isLoading, status, isFetching);
  return (
    <Button className="btn-success" onClick={refreshChar}>
      <i className={`fa-solid fa-refresh ${isFetching && styles.menuRefreshSpin}`}></i>
    </Button>
  );
};
