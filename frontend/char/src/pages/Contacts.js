import React from "react";

import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadContacts } from "../apis/Character";
import {
  BaseTable,
  SelectColumnFilter,
  textColumnFilter,
} from "../components/BaseTable";

const CharContacts = ({ character_id }) => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["contacts", character_id],
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
        Filter: SelectColumnFilter,
        filter: "text",
      },
      {
        Header: "Contact",
        accessor: "contact.name",
        Filter: textColumnFilter,
        filter: "text",
      },
      {
        Header: "Type",
        accessor: "contact.cat",
        Filter: SelectColumnFilter,
        filter: "text",
      },
      {
        Header: "Standing",
        accessor: "standing",
      },
    ],
    []
  );

  return (
    <Panel.Body>
      <BaseTable {...{ isLoading, isFetching, data, columns, error }} />
    </Panel.Body>
  );
};

export default CharContacts;
