import { components } from "../../api/CtApi";
import { CollapseBlock } from "../Helpers/CollapseBlock";
import BaseTable from "../Tables/BaseTable/BaseTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, Table } from "react-bootstrap";
import TimeAgo from "react-timeago";

// const UpdateTableRows = ({ values }: { values: Record<string, never> | null | undefined }) => {
//   if (values) {
//     return Object.keys(values)?.map((h: string) => {
//       return (
//         <tr key={h}>
//           <td>{h}</td>
//           <td className="text-end">
//             {values ? values[h] ? <TimeAgo date={values[h]} /> : "Never" : "Never"}
//           </td>
//         </tr>
//       );
//     });
//   }
// };

const CharacterStatusTable = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  const columnHelper = createColumnHelper<components["schemas"]["CharacterStatus"]>();

  let columns = [
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
        return cell.getValue()?.toLocaleString();
      },
    }),
    columnHelper.accessor("sp", {
      header: "SP",
      cell: (cell) => {
        return cell.getValue()?.toLocaleString();
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
  ];
  console.log(data?.last_updates);
  if (data?.characters[0]?.last_updates) {
    Object.keys(data?.characters[0]?.last_updates)?.map((h: string) => {
      console.log(h);
      columns.push(
        // @ts-expect-error
        columnHelper.accessor(`last_updates.${h}`, {
          header: h,
          cell: (cell) => {
            return cell.getValue() ? <TimeAgo date={cell.getValue()} /> : "Never";
          },
        })
      );
    });
  }

  return <BaseTable data={data?.characters} {...{ isFetching, columns }} />;
};

export default CharacterStatusTable;
