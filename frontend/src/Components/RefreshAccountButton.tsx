import { postAccountRefresh } from "../api/character";
import styles from "./RefreshAccountButton.module.css";
import Button from "react-bootstrap/Button";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export const RefreshCharButton = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  // A POST with side effects - a mutation, so it isn't cached or retried
  // like a query, and runs once per click.
  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => postAccountRefresh(characterID ? Number(characterID) : 0),
  });

  return (
    <Button
      variant={isError ? "danger" : "success"}
      title={isError ? t("Refresh failed, click to try again") : undefined}
      disabled={isPending}
      onClick={() => mutate()}
    >
      <i className={`fa-solid fa-refresh ${isPending ? styles.menuRefreshSpin : ""}`}></i>
    </Button>
  );
};
