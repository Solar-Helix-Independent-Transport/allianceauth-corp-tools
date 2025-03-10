import ErrorBoundary from "../../Components/Helpers/ErrorBoundary";
import CharMailModal from "../../Components/Mail/MailModal";
import BaseTable from "../../Components/Tables/BaseTable/BaseTable";
import { loadMail } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterMail = () => {
  const { t } = useTranslation();
  let { characterID } = useParams();
  const [showModal, setModal] = useState(false);
  const [modalData, setData] = useState(null);

  const { isFetching, data } = useQuery(
    ["mail", characterID],
    () => loadMail(Number(characterID)),
    {
      initialData: [],
      refetchOnWindowFocus: false,
    },
  );

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("character", {
      header: t("Character"),
    }),
    columnHelper.accessor("from", {
      header: t("From"),
    }),
    columnHelper.accessor("labels", {
      header: t("Labels"),
      cell: (cell) => (
        <p>
          {cell.getValue().map((name: any) => (
            <Badge style={{ marginLeft: "5px" }}>{name}</Badge>
          ))}
        </p>
      ),
    }),
    columnHelper.accessor("recipients", {
      header: t("To"),
      cell: (cell) =>
        cell.getValue().length > 2 ? (
          <p>
            <Badge bg="warning">
              + {cell.getValue().length} {t("Recipients")}
            </Badge>
          </p>
        ) : (
          <p>
            {cell.getValue().map((name: any) => (
              <Badge style={{ marginLeft: "5px" }} bg="info">
                {name}
              </Badge>
            ))}
          </p>
        ),
    }),
    columnHelper.accessor("timestamp", {
      header: t("Date"),
      cell: (cell) => <div>{new Date(cell.getValue()).toLocaleString()}</div>,
    }),
    columnHelper.accessor("subject", {
      header: t("Subject"),
    }),
    columnHelper.accessor("subject", {
      header: t("Details"),
      cell: (cell) => (
        <>
          <Button
            onClick={() => {
              setData(cell.row.original);
              setModal(true);
            }}
          >
            {t("Show Detail")}
          </Button>
        </>
      ),
    }),
  ];

  return (
    <ErrorBoundary>
      <BaseTable {...{ isFetching, data, columns }} />
      <CharMailModal msg_data={modalData} shown={showModal} setShown={setModal} />
    </ErrorBoundary>
  );
};

export default CharacterMail;
