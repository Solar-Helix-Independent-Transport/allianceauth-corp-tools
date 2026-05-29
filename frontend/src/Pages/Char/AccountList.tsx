import { CharacterPortrait, CorporationLogo } from "../../Components/EveImages/EveImages";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterList } from "../../api/character";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const AccountList = () => {
  const { t } = useTranslation();

  const { data, isFetching } = useQuery({
    queryKey: ["list"],
    queryFn: () => getCharacterList(),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["AccountStatus"]>();

  const columns: ColumnDef<components["schemas"]["AccountStatus"], any>[] = [
    columnHelper.accessor("main.character_name", {
      header: t("Character"),
      cell: (cell) => (
        <div className="d-flex align-items-center text-nowrap gap-2">
          <CharacterPortrait size={32} character_id={cell.row.original.main.character_id} />
          <Link to={{ pathname: `/audit/r/${cell.row.original.main.character_id}/` }}>
            {cell.getValue()}
          </Link>
          {cell.row.original.orphan && (
            <span className="badge bg-warning text-dark ms-1">{t("Orphan")}</span>
          )}
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
    columnHelper.accessor((row) => row.characters?.filter((c) => c.active).length ?? 0, {
      id: "active_count",
      header: t("Active"),
      enableColumnFilter: false,
      cell: (cell) => {
        const active = cell.getValue<number>();
        const total = cell.row.original.characters?.length ?? 0;
        return (
          <span className={active < total ? "text-warning" : "text-success"}>
            {active} / {total}
          </span>
        );
      },
    }),
    columnHelper.accessor("characters", {
      header: t("Characters"),
      cell: (props) =>
        props.getValue() ? (
          <div className="d-flex flex-wrap text-center">
            {props.getValue()!.map((char: components["schemas"]["CharacterStatus"]) => (
              <span
                key={char.character.character_id}
                className={`badge mx-1 my-1 text-body padded-label aa-callout-sm aa-callout aa-callout-${
                  char.active ? "success" : "danger"
                }`}
              >
                {char.character.character_name}
              </span>
            ))}
          </div>
        ) : (
          <></>
        ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue) return true;
        const rowValue = row.original?.characters?.reduce(
          (p: string, c: components["schemas"]["CharacterStatus"]) =>
            p + "  " + c.character.character_name,
          "",
        );
        return rowValue ? rowValue.toLowerCase().includes(filterValue.toLowerCase()) : false;
      },
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default AccountList;
