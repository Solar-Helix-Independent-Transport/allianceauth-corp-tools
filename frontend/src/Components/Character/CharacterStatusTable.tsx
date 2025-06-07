import { components } from "../../api/CtApi";
import BaseTable from "../Tables/BaseTable/BaseTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TimeAgo from "react-timeago";

const CharacterStatusTable = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  const { t } = useTranslation();

  const columnHelper = createColumnHelper<components["schemas"]["CharacterStatus"]>();

  let columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("character.corporation_name", {
      header: t("Corporation"),
    }),
    columnHelper.accessor("character.alliance_name", {
      header: t("Alliance"),
    }),
    columnHelper.accessor("last_login", {
      header: t("Last Login"),
      cell: (cell) => {
        let date = cell.getValue();
        return date ? <TimeAgo date={date} /> : t("Never");
      },
    }),
    columnHelper.accessor("last_logoff", {
      header: t("Last Logoff"),
      cell: (cell) => {
        let date = cell.getValue();
        return date ? <TimeAgo date={date} /> : t("Never");
      },
    }),
    columnHelper.accessor("total_logins", {
      header: t("Total Logins"),
    }),
    columnHelper.accessor("isk", {
      header: t("Isk"),
      cell: (cell) => {
        return cell.getValue()?.toLocaleString();
      },
    }),
    columnHelper.accessor("sp", {
      header: t("SP"),
      cell: (cell) => {
        return cell.getValue()?.toLocaleString();
      },
    }),
    columnHelper.accessor("active", {
      header: t("Active"),
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
  if (data?.characters[0]?.last_updates) {
    Object.keys(data?.characters[0]?.last_updates)?.map((h: string) => {
      columns.push(
        columnHelper.accessor(`last_updates.${h}`, {
          header: h,
          cell: (cell) => {
            return cell.getValue() ? <TimeAgo date={cell.getValue()} /> : t("Never");
          },
        }) as any,
      );
    });
  }

  return <BaseTable data={data?.characters} {...{ isFetching, columns }} />;
};

export default CharacterStatusTable;
