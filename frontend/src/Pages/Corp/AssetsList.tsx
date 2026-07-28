import { useTranslation } from "react-i18next";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CorporationAssetLocationSelect from "../../Components/Corporation/CorpAssetLocationSelect";
import CorporationFilterBar from "../../Components/Corporation/CorporationFilterBar";
import { useCorporationId } from "../../Components/Corporation/useCorporationId";
import { loadAssetList } from "../../api/corporation";
import { CorpLoader, PanelLoader } from "../../Components/Loaders/loaders";
import CorporationAssetModal from "../../Components/Modals/CorporationAssetContents";
import { SecurityStatusBadge } from "../../Components/SecurityStatusBadge";
import { components } from "../../api/CtApi";

const CorporationAssets = () => {
  const { t } = useTranslation();

  const corporationID = useCorporationId();
  const [locationID, setLocation] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["corpassetList", corporationID, locationID],
    queryFn: () => loadAssetList(Number(corporationID), locationID, true),
    refetchOnWindowFocus: false,
    initialData: [] as components["schemas"]["AssetItem"][],
  });

  const columnHelper = createColumnHelper<components["schemas"]["AssetItem"]>();

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
      <CorporationFilterBar />
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
