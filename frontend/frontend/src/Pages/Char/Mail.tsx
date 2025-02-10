import ErrorBoundary from "../../Components/Helpers/ErrorBoundary";
import CharMailModal from "../../Components/Mail/MailModal";
import BaseTable from "../../Components/Tables/BaseTable/BaseTable";
import { loadMail } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterMail = () => {
  let { characterID } = useParams();
  const [showModal, setModal] = useState(false);
  const [modalData, setData] = useState(null);

  const { isFetching, data } = useQuery(
    ["mail", characterID],
    () => loadMail(Number(characterID)),
    {
      initialData: [],
      refetchOnWindowFocus: false,
    }
  );

  const columns1 = React.useMemo(
    () => [
      {
        Header: "Character",
        accessor: "character",
      },
      {
        Header: "From",
        accessor: "from",
      },
      {
        Header: "Labels",
        accessor: "labels",
        Cell: (props: any) => (
          <p>
            {props.value.map((name: any) => (
              <Badge style={{ marginLeft: "5px" }}>{name}</Badge>
            ))}
          </p>
        ),
      },
      {
        Header: "To",
        accessor: "recipients",
        Cell: (props: any) =>
          props.value.length > 2 ? (
            <p>
              <Badge bg="warning">+ {props.value.length} Recipients</Badge>
            </p>
          ) : (
            <p>
              {props.value.map((name: any) => (
                <Badge style={{ marginLeft: "5px" }} bg="info">
                  {name}
                </Badge>
              ))}
            </p>
          ),
      },
      {
        Header: "Date",
        accessor: "timestamp",
        Cell: (props: any) => <div>{new Date(props.value).toLocaleString()}</div>,
      },
      {
        Header: "subject",
        accessor: "subject",
      },
      {
        Header: "Details",
        Cell: (props: any) => (
          <>
            {" "}
            <Button
              onClick={() => {
                setData(props.row.original);
                setModal(true);
              }}
            >
              Show Detail
            </Button>
          </>
        ),
      },
    ],
    [setModal, setData]
  );
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("character", {
      header: "Character",
    }),
    columnHelper.accessor("from", {
      header: "From",
    }),
    columnHelper.accessor("labels", {
      header: "Labels",
      cell: (cell) => (
        <p>
          {cell.getValue().map((name: any) => (
            <Badge style={{ marginLeft: "5px" }}>{name}</Badge>
          ))}
        </p>
      ),
    }),
    columnHelper.accessor("recipients", {
      header: "To",
      cell: (cell) =>
        cell.getValue().length > 2 ? (
          <p>
            <Badge bg="warning">+ {cell.getValue().length} Recipients</Badge>
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
      header: "Date",
      cell: (cell) => <div>{new Date(cell.getValue()).toLocaleString()}</div>,
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
    }),
    columnHelper.accessor("subject", {
      header: "Details",
      cell: (cell) => (
        <>
          {" "}
          <Button
            onClick={() => {
              setData(cell.row.original);
              setModal(true);
            }}
          >
            Show Detail
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
