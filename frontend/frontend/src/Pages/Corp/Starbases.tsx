import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { LoadAllStarbases } from "../../api/corporation";
import { CorporationLogo } from "../../Components/EveImages/EveImages";
import { TimeTill } from "../../Components/Helpers/TimeTill";

const CorporationStarbases = () => {
  const { t } = useTranslation();

  const { data, isFetching } = useQuery({
    queryKey: ["pocos"],
    queryFn: () => LoadAllStarbases(),
    refetchOnWindowFocus: false,
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("region.name", {
      header: t("Region"),
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/map/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("constellation.name", {
      header: t("Constellation"),
      cell: (cell) => (
        <a
          href={`https://evemaps.dotlan.net/map/${cell.row.original.region.name.replace(
            " ",
            "_",
          )}/${cell.getValue().replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("system.name", {
      header: t("System"),
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/map/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("moon.name", {
      header: t("Moon"),
    }),
    columnHelper.accessor("name", {
      header: t("Name"),
    }),
    columnHelper.accessor("owner.corporation_name", {
      header: t("Owner"),
      cell: (cell) => (
        <>
          <CorporationLogo
            corporation_id={cell.row.original.owner.corporation_id}
            size={32}
          ></CorporationLogo>
          <span className="ms-2">{cell.row.original.owner.corporation_name}</span>
        </>
      ),
    }),
    columnHelper.accessor("state", {
      header: t("State"),
      cell: (cell) => {
        return (
          <div className="d-flex flex-column">
            <span>{cell.getValue()}</span>
            {cell.getValue() == "online" && (
              <>
                <TimeTill date={cell.row.original.onlined_since} />
              </>
            )}
          </div>
        );
      },
    }),
  ];

  return (
    <>
      <TableWrapper {...{ isFetching, data, columns }} />
    </>
  );
};

export default CorporationStarbases;
