import React from "react";
import {
  ButtonToolbar,
  ButtonGroup,
  Glyphicon,
  MenuItem,
  SplitButton,
  Table,
} from "react-bootstrap";

import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { PanelLoader } from "../components/PanelLoader";
import { Button } from "react-bootstrap";
import { useTable, usePagination } from "react-table";
import { loadContacts } from "../apis/Character";

const CharContacts = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(
    ["wallet", character_id],
    () => loadContacts(character_id),
    {
      initialData: [],
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Character",
        accessor: "character.character_name",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Type",
        accessor: "ref_type",
      },
      {
        Header: "First Party",
        accessor: "first_party.name",
      },
      {
        Header: "Second Party",
        accessor: "second_party.name",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Ballance",
        accessor: "balance",
      },
      {
        Header: "Reason",
        accessor: "reason",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 1, pageSize: 25 } },
    usePagination
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <div></div>;

  return (
    <Panel.Body className="flex-container">
      <Table striped>
        <thead {...getTableProps()}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="pagination">
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              <Glyphicon glyph="step-backward" />
            </Button>{" "}
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              <Glyphicon glyph="triangle-left" />
            </Button>{" "}
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              <Glyphicon glyph="triangle-right" />
            </Button>{" "}
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <Glyphicon glyph="step-forward" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button>{"Page Size:"}</Button>{" "}
            <SplitButton
              title={pageSize}
              onSelect={(e) => {
                console.log(e);
                setPageSize(Number(e));
              }}
            >
              {[25, 50, 100, 1000].map((pageSize) => (
                <MenuItem eventKey={pageSize} value={pageSize}>
                  Show {pageSize}
                </MenuItem>
              ))}
            </SplitButton>
          </ButtonGroup>
          <ButtonGroup>
            <Button>
              {
                <>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>
                </>
              }
            </Button>{" "}
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    </Panel.Body>
  );
};

export default CharContacts;
