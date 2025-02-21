import { CharacterPortrait, CorporationLogo } from "../../Components/EveImages/EveImages";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterList } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const AccountList = () => {
  const { t } = useTranslation();

  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["contacts", characterID],
    queryFn: () => getCharacterList(),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["AccountStatus"]>();

  const columns = [
    columnHelper.accessor("main.character_name", {
      header: t("Character"),
      cell: (cell) => (
        <div className="text-nowrap">
          <CharacterPortrait size={32} character_id={cell.row.original.main.character_id} />{" "}
          {cell.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("main.corporation_name", {
      header: t("Main Corporation"),
      cell: (cell) => (
        <div className="text-nowrap">
          <CorporationLogo size={32} corporation_id={cell.row.original.main.corporation_id} />{" "}
          {cell.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("characters", {
      header: t("Characters"),
      cell: (props) =>
        props.getValue() ? (
          <div className="d-flex flex-wrap text-center justify-content-evenly">
            {props?.getValue()?.map((char) => {
              return (
                <span
                  className={`badge mx-1 my-1 text-body padded-label aa-callout-sm aa-callout aa-callout-${
                    char.active ? "success" : "danger"
                  }`}
                >
                  {char.character.character_name}
                </span>
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
            className="btn btn-primary"
            to={{
              pathname: `/audit/r/${cell.getValue().character_id}/`,
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
