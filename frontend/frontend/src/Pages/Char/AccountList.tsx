import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterList } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const AccountList = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["contacts", characterID],
    queryFn: () => getCharacterList(),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["AccountStatus"]>();

  const columns = [
    columnHelper.accessor("main.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("main.corporation_name", {
      header: "Corporation",
    }),
    columnHelper.accessor("characters", {
      header: "Characters",
      cell: (props) =>
        props.getValue() ? (
          <div className="flex-container text-center">
            {props?.getValue()?.map((char) => {
              return (
                <Badge className="padded-label" bg={char.active ? "primary" : "danger"}>
                  {char.character.character_name}
                </Badge>
              );
            })}
          </div>
        ) : (
          <></>
        ),
      // filterFn: (row: Row<components["schemas"]["AccountStatus"]>, columnId, filterValue) => {
      //   if (!filterValue) {
      //     return true;
      //   } else {
      //     let rowValue = row.getValue()[id].reduce((p, c) => {
      //       return p + "  " + c.character.character_name;
      //     }, "");
      //     return rowValue
      //       ? rowValue.toLowerCase().includes(filterValue.toLowerCase())
      //       : false;
      //   }
      // },
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default AccountList;
