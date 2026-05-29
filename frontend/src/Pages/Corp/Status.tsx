import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { loadStatus } from "../../api/corporation";
import { CorporationLogo } from "../../Components/EveImages/EveImages";
import ReactTimeAgo from "react-time-ago";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
    return columnHelper.accessor((row) => row.last_updates?.[ob]?.update ?? null, {
      id: `${ob}`,
      header: ob,
      enableColumnFilter: false,
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue<string | null>(columnId);
        const b = rowB.getValue<string | null>(columnId);
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        return Date.parse(a) - Date.parse(b);
      },
      cell: (cell) => {
        const upd = cell.row.original.last_updates[ob];
        const stale = (dateStr: string | null) =>
          !dateStr || Date.now() - Date.parse(dateStr) > 86400000;
        const isStale = stale(upd.update) || stale(upd.change);
        return (
          <div className="d-flex align-items-center gap-2">
            <i
              className={`fa-solid ${isStale ? "fa-xmark text-danger" : "fa-check text-success"}`}
            />
            <div>
              <div>
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  overlay={<Tooltip style={{ position: "fixed" }}>Last polled from ESI</Tooltip>}
                >
                  <i className="fa-solid fa-arrows-rotate me-1 text-muted" />
                </OverlayTrigger>
                {upd.update ? (
                  <ReactTimeAgo date={Date.parse(upd.update)} />
                ) : (
                  <span className="text-warning">Never</span>
                )}
              </div>
              <div>
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  overlay={<Tooltip style={{ position: "fixed" }}>Last time data changed</Tooltip>}
                >
                  <i className="fa-solid fa-database me-1 text-muted" />
                </OverlayTrigger>
                {upd.change ? (
                  <ReactTimeAgo date={Date.parse(upd.change)} />
                ) : (
                  <span className="text-warning">Never</span>
                )}
              </div>
            </div>
          </div>
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
