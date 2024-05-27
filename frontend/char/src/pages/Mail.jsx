import { loadMail } from "../apis/Character";
import { BaseTable, SelectColumnFilter, textColumnFilter } from "../components/BaseTable";
import CharMailModal from "../components/CharMailModal";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Button, Label, Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharMail = () => {
  let { characterID } = useParams();
  const [showModal, setModal] = useState(false);
  const [modalData, setData] = useState(null);

  const { isLoading, isFetching, error, data } = useQuery(
    ["mail", characterID],
    () => loadMail(characterID),
    {
      initialData: [],
      refetchOnWindowFocus: false,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Character",
        accessor: "character",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "From",
        accessor: "from",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Labels",
        accessor: "labels",
        Cell: (props) => (
          <p>
            {props.value.map((name) => (
              <Label style={{ marginLeft: "5px" }}>{name}</Label>
            ))}
          </p>
        ),
      },
      {
        Header: "To",
        accessor: "recipients",
        Cell: (props) =>
          props.value.length > 2 ? (
            <p>
              <Label bsStyle="warning">+ {props.value.length} Recipients</Label>
            </p>
          ) : (
            <p>
              {props.value.map((name) => (
                <Label style={{ marginLeft: "5px" }} bsStyle="info">
                  {name}
                </Label>
              ))}
            </p>
          ),
      },
      {
        Header: "Date",
        accessor: "timestamp",
        Cell: (props) => <div>{new Date(props.value).toLocaleString()}</div>,
      },
      {
        Header: "subject",
        accessor: "subject",
        Filter: textColumnFilter,
        filter: "includes",
      },
      {
        Header: "Details",
        Filter: textColumnFilter,
        Cell: (props) => (
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

  return (
    <ErrorBoundary>
      <Panel.Body>
        <BaseTable {...{ isLoading, isFetching, data, columns, error }} />
        <CharMailModal msg_data={modalData} shown={showModal} setShown={setModal} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharMail;
