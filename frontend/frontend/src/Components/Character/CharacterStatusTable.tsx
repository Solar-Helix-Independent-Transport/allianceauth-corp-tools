import { CollapseBlock } from "../Helpers/CollapseBlock";
import BaseTable from "../Tables/BaseTable/BaseTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, Table } from "react-bootstrap";
import TimeAgo from "react-timeago";

type Character = {
  character_name: string;
  corporation_name: string;
  alliance_name: string;
};
type CharacterType = {
  character: Character;
  isk: number;
  sp: number;
  active: boolean;
  last_updates: Array<any>;
};

const CharacterStatusTable = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  const columnHelper = createColumnHelper<CharacterType>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("character.corporation_name", {
      header: "Corporation",
    }),
    columnHelper.accessor("character.alliance_name", {
      header: "Alliance",
    }),
    columnHelper.accessor("isk", {
      header: "Isk",
      cell: (cell) => {
        return cell.getValue().toLocaleString();
      },
    }),
    columnHelper.accessor("sp", {
      header: "SP",
      cell: (cell) => {
        return cell.getValue().toLocaleString();
      },
    }),
    columnHelper.accessor("active", {
      header: "Active",
      cell: (cell) => {
        const isActive = cell.getValue();
        return (
          <div className="text-center">
            <Button variant={isActive ? "success" : "warning"}>
              {isActive ? (
                <i className="fa-solid fa-check"></i>
              ) : (
                <i className="fa-solid fa-xmark"></i>
              )}
            </Button>
          </div>
        );
      },
    }),
    columnHelper.accessor("last_updates", {
      header: "Updates",
      cell: (cell) => {
        return (
          <CollapseBlock
            id={`dropdown-status-${cell.row.original.character.character_name}`}
            heading={"Update Status"}
          >
            <>
              <Table striped style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>Update</th>
                    <th className="text-end">Last Run</th>
                  </tr>
                </thead>
              </Table>
              <div>
                <Table striped>
                  <tbody>
                    {Object.keys(cell.getValue()).map((h) => {
                      const CelArray = cell.getValue();
                      return (
                        <tr key={h}>
                          <td>{h}</td>
                          <td className="text-end">
                            {CelArray ? (
                              CelArray[h] ? (
                                <TimeAgo date={CelArray[h]} />
                              ) : (
                                "Never"
                              )
                            ) : (
                              "Never"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </>
          </CollapseBlock>
        );
      },
    }),
  ];

  return <BaseTable data={data?.characters} {...{ isFetching, columns }} />;
};

export default CharacterStatusTable;
