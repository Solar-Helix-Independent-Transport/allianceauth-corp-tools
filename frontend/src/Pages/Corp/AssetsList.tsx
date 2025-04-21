import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useQuery } from "react-query";
import CorporationAssetLocationSelect from "../../Components/Corporation/CorpAssetLocationSelect";
import CorpSelect from "../../Components/Corporation/CorporationSelect";
import { loadAssetList } from "../../api/corporation";
import { CorpLoader, PanelLoader } from "../../Components/Loaders/loaders";
import CorporationAssetModal from "../../Components/Modals/CorporationAssetContents";
import { SecurityStatusBadge } from "../../Components/SecurityStatusBadge";

const CorporationAssets = () => {
  const { t } = useTranslation();

  const [corporationID, setCorporation] = useState<number>(0);
  const [locationID, setLocation] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["corpassetList", corporationID, locationID],
    queryFn: () => loadAssetList(Number(corporationID), locationID, true),
    refetchOnWindowFocus: false,
    initialData: { characters: [], main: undefined, headers: [] },
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("item.name", {
      header: t("Item Type"),
    }),
    columnHelper.accessor("item.cat", {
      header: t("Category"),
    }),
    columnHelper.accessor("expand", {
      header: t("Show Contents"),
      cell: (cell) => cell.getValue() && <CorporationAssetModal item={cell.row.original} />,
    }),
    columnHelper.accessor("quantity", {
      header: t("Quantity"),
      cell: (cell) => `${cell.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor("location.name", {
      header: t("Location"),
      cell: (cell) => (
        <div className="d-flex flex-row align-items-center">
          <SecurityStatusBadge
            securityStatus={cell.row?.original?.location?.solar_system?.security_status}
          />
          {cell.getValue()}{" "}
        </div>
      ),
    }),
  ];

  return (
    <>
      <div className="m-3 d-flex align-items-center my-1">
        <h6 className="me-1">{t("Corporation Filter")}</h6>
        <div className="flex-grow-1">
          <CorpSelect {...{ setCorporation }} />
        </div>
      </div>
      <div className="m-3 d-flex align-items-center">
        <h6 className="me-1">{t("Location Filter")}</h6>
        <div className="flex-grow-1">
          <CorporationAssetLocationSelect
            corporationID={corporationID ? Number(corporationID) : 0}
            {...{ setLocation }}
          />
        </div>
      </div>
      {isFetching ? (
        <PanelLoader title={t("Data Loading")} message={t("Please Wait")} />
      ) : corporationID > 0 ? (
        <TableWrapper {...{ isFetching, data, columns }} />
      ) : (
        <CorpLoader title={t("Select Corporation")} />
      )}
    </>
  );
};

export default CorporationAssets;
