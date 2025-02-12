import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterList } from "../../api/character";
import { Row, createColumnHelper } from "@tanstack/react-table";
import { Badge, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

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
      filterFn: (row, _, filterValue) => {
        if (!filterValue) {
          return true;
        } else {
          let rowValue = row.original?.characters?.reduce((p: any, c: any) => {
            return p + "  " + c.character.character_name;
          }, "");
          return rowValue ? rowValue.toLowerCase().includes(filterValue.toLowerCase()) : false;
        }
      },
    }),
    columnHelper.accessor("main", {
      header: "",
      enableColumnFilter: false,
      enableSorting: false,
      cell: (cell) =>
        cell.getValue() ? (
          <Link
            className="btn btn-info"
            to={{
              pathname: `audit/r_beta/${cell.getValue().character_id}/`,
            }}
          >
            <i className="fas fa-external-link" aria-hidden="true"></i>
          </Link>
        ) : (
          <></>
        ),
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default AccountList;
