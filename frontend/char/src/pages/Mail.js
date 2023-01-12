import { loadMail } from "../apis/Character";
import { BaseTable, SelectColumnFilter, textColumnFilter } from "../components/BaseTable";
import CharContractModal from "../components/CharContractModal";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Button, Panel } from "react-bootstrap";
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
        Header: "Date",
        accessor: "date_issued",
        Cell: (props) => <div> {new Date(props.value).toLocaleString()} </div>,
      },
      {
        Header: "subject",
        accessor: "subject",
        Filter: textColumnFilter,
        filter: "includes",
      },
      {
        Header: "From",
        accessor: "from",
        Filter: textColumnFilter,
        filter: "includes",
      },
      {
        Header: "To",
        accessor: "recipients",
        Filter: textColumnFilter,
        filter: "text",
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
        <CharContractModal data={modalData} shown={showModal} setShown={setModal} />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default CharContracts;
