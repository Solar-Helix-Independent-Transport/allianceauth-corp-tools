import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadNotifications } from "../apis/Character";
import { CtTable, SelectColumnFilter } from "../components/CtTable";

const CharNotifications = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(
    ["notifications", character_id],
    () => loadNotifications(character_id),
    {
      initialData: [],
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Character",
        accessor: "character.character_name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Date",
        accessor: "timestamp",
        Cell: (props) => <div> {new Date(props.value).toLocaleString()} </div>,
      },
      {
        Header: "Type",
        accessor: "notification_type",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Text",
        accessor: "notification_text",
      },
    ],
    []
  );

  return (
    <Panel.Body>
      <CtTable {...{ isLoading, data, columns, error }} />
    </Panel.Body>
  );
};

export default CharNotifications;
