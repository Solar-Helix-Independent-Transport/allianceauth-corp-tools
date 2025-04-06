import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { loadAllPocos } from "../../api/corporation";
import { CorporationLogo } from "../../Components/EveImages/EveImages";

const CorporationPocos = () => {
  const { t } = useTranslation();

  const { data, isFetching } = useQuery({
    queryKey: ["pocos"],
    queryFn: () => loadAllPocos(),
    refetchOnWindowFocus: false,
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("location.region", {
      header: t("Region"),
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/map/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("location.constellation", {
      header: t("Constellation"),
      cell: (cell) => (
        <a
          href={`https://evemaps.dotlan.net/map/${cell.row.original.location.region.replace(" ", "_")}/${cell.getValue().replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("location.name", {
      header: t("Plannet"),
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
    columnHelper.accessor("allow_access_with_standings", {
      header: t("Standings Access"),
    }),
    columnHelper.accessor("allow_alliance_access", {
      header: t("Alliance Access"),
    }),
    columnHelper.accessor("alliance_tax_rate", {
      header: () => <span className="ms-auto">{t("Alliance")}</span>,
    }),
    columnHelper.accessor("corporation_tax_rate", {
      header: () => <span className="ms-auto">{t("Corporations")}</span>,
    }),
    columnHelper.accessor("terrible_standing_tax_rate", {
      header: () => <span className="ms-auto">{t("Terrible")}</span>,
    }),
    columnHelper.accessor("bad_standing_tax_rate", {
      header: () => <span className="ms-auto">{t("Bad")}</span>,
    }),
    columnHelper.accessor("neutral_standing_tax_rate", {
      header: () => <span className="ms-auto">{t("Nuetral")}</span>,
    }),
    columnHelper.accessor("good_standing_tax_rate", {
      header: () => <span className="ms-auto">{t("Good")}</span>,
    }),
    columnHelper.accessor("excellent_standing_tax_rate", {
      header: () => <span className="ms-auto">{t("Excelent")}</span>,
    }),
    columnHelper.accessor("reinforce_exit_start", {
      header: () => <span className="ms-auto">{t("Ref Exit Start")}</span>,
    }),
    columnHelper.accessor("reinforce_exit_end", {
      header: () => <span className="ms-auto">{t("Ref Exit End")}</span>,
    }),
  ];

  return (
    <>
      <TableWrapper {...{ isFetching, data, columns }} />
    </>
  );
};

export default CorporationPocos;
