import { CollapseBlock } from "../Helpers/CollapseBlock";
import { BaseTable, PanelLoader } from "@pvyparts/allianceauth-components";
import React from "react";
import { Table } from "react-bootstrap";

const CharacterStatusTable = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  const columns = React.useMemo(() => {
    let cols = [
      {
        header: "Character",
        accessorKey: "character.character_name",
      },
      {
        header: "Corporation",
        accessorKey: "character.corporation_name",
      },
      {
        header: "Alliance",
        accessorKey: "character.alliance_name",
      },
      {
        header: "Isk",
        accessorKey: "isk",
      },
      {
        header: "SP",
        accessorKey: "sp",
      },
      {
        header: "Updates",
        accessorKey: "last_updates",
        cell: (row: any) => (
          <>
            <CollapseBlock heading={`Update Status`}>
              <div>
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th>Update</th>
                      <th className="text-end">Last Run</th>
                    </tr>
                  </thead>
                </Table>
                <div style={{ width: "400px" }}>
                  <Table striped>
                    <tbody>
                      {/* {row.getValue().map((h: any) => {
                        return (
                          <tr key={h}>
                            <td>{h}</td>
                            <td className="text-end">
                              {row.row.original.last_updates
                                ? row.row.original.last_updates[h]
                                  ? `${Date.parse(row.row.original.last_updates[h])}`
                                  : "Never"
                                : "Never"}
                            </td>
                          </tr>
                        );
                      })}*/}
                    </tbody>
                  </Table>
                </div>
              </div>
            </CollapseBlock>
          </>
        ),
      },
    ];
    return cols;
  }, []);
  if (!data) {
    return <PanelLoader message="Loading Please Wait!" />;
  }
  return <BaseTable data={data?.characters} {...{ isFetching, columns }} />;
};

export default CharacterStatusTable;
