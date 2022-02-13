import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadAssetList } from "../apis/Character";
import {
  BaseTable,
  SelectColumnFilter,
  textColumnFilter,
} from "../components/BaseTable";

const CharAssetTable = ({ character_id, location_id = 0 }) => {
  const { isLoading, error, data } = useQuery(
    ["assetList", character_id, location_id],
    () => loadAssetList(character_id, location_id)
  );
  console.log("WE ARE HERE");
  const columns = React.useMemo(
    () => [
      {
        Header: "Character",
        accessor: "character.character_name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Type",
        accessor: "item.name",
        Filter: textColumnFilter,
        filter: "includes",
      },
      {
        Header: "Category",
        accessor: "item.cat",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Location",
        accessor: "location.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
    []
  );

  return (
    <Panel.Body>
      {isLoading ? (
        <></>
      ) : (
        <BaseTable {...{ isLoading, data, columns, error }} />
      )}
    </Panel.Body>
  );
};

export default CharAssetTable;
