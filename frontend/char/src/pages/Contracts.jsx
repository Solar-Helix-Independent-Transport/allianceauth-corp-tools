import { loadContracts } from "../apis/Character";
import { BaseTable, SelectColumnFilter, textColumnFilter } from "../components/BaseTable";
import CharContractModal from "../components/CharContractModal";
import ErrorBoundary from "../components/ErrorBoundary";
import React, { useState } from "react";
import { Button, Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

function StrToFields({ strValue, text, force = false }) {
  //console.log("StrIntToFields", strValue, text);
  let intValue = parseInt(strValue);
  return intValue !== 0 || force ? (
    <p>
      {text}: ${intValue.toLocaleString()}
    </p>
  ) : (
    <></>
  );
}

const CharContracts = () => {
  let { characterID } = useParams();
  const [showModal, setModal] = useState(false);
  const [modalData, setData] = useState(null);

  const { isLoading, isFetching, error, data } = useQuery(
    ["contracts", characterID],
    () => loadContracts(characterID),
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
        Header: "Type",
        accessor: "contract_type",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "From",
        accessor: "issuer",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "To",
        accessor: "assignee",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: (props) => (
          <>
            <StrToFields text={"Price"} strValue={props.row.original?.price} force={true} />
            <StrToFields text={"Buyout"} strValue={props.row.original?.buyout} />
            <StrToFields text={"Collateral"} strValue={props.row.original?.collateral} />
            <StrToFields text={"Reward"} strValue={props.row.original?.reward} />
          </>
        ),
      },
      {
        Header: "Tittle",
        Filter: textColumnFilter,
        accessor: "title",
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
