import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { loadStatus } from "../../api/corporation";
import { CorporationLogo } from "../../Components/EveImages/EveImages";
import ReactTimeAgo from "react-time-ago";

const CorporationStatus = () => {
  const { t } = useTranslation();

  const { data, isFetching } = useQuery({
    queryKey: ["corp-status"],
    queryFn: () => loadStatus(),
    refetchOnWindowFocus: false,
  });

  const columnHelper = createColumnHelper<any>();

  let columns = [
    columnHelper.accessor("corporation.corporation_name", {
      header: t("Corporation"),
      cell: (cell) => (
        <>
          <CorporationLogo
            corporation_id={cell.row.original.corporation.corporation_id}
            size={32}
          ></CorporationLogo>
          <span className="ms-2">{cell.row.original.corporation.corporation_name}</span>
        </>
      ),
    }),
  ];

  const dataColumns = data?.headers?.map((ob: any) => {
    return columnHelper.accessor("corps.corporation", {
      id: `${ob}`,
      header: ob,
      enableColumnFilter: false,
      enableSorting: true,
      cell: (cell) => {
        return cell.row.original.last_updates[ob].update ? (
          <>
            <ReactTimeAgo date={Date.parse(cell.row.original.last_updates[ob].update)} />
          </>
        ) : (
          <span className="text-warning">{"Never"}</span>
        );
      },
    });
  });

  if (dataColumns) {
    columns = columns.concat(dataColumns);
  }

  return (
    <>
      <TableWrapper data={data?.corps} {...{ isFetching, columns }} />
    </>
  );
};

export default CorporationStatus;
