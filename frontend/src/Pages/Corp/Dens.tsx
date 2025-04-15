import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { loadDens } from "../../api/corporation";
import { CorporationLogo } from "../../Components/EveImages/EveImages";
import BaseTable from "../../Components/Tables/BaseTable/BaseTable";

const Dens = () => {
  const { t } = useTranslation();

  const { data, isFetching } = useQuery({
    queryKey: ["dens"],
    queryFn: () => loadDens(),
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
          href={`https://evemaps.dotlan.net/map/${cell.row.original.region?.name.replace(
            " ",
            "_",
          )}/${cell.getValue().replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("location.name", {
      header: t("System"),
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/map/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("name", {
      header: t("Name"),
    }),
    columnHelper.accessor("character.corporation_name", {
      header: t("Owner Corp"),
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
    columnHelper.accessor("character.character_name", {
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
  ];
  return (
    <>
      <BaseTable {...{ isFetching, data, columns }} />
    </>
  );
};

export default Dens;
