import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { AssetGroups } from "../../Components/AssetGroups";
import CorporationAssetLocationSelect from "../../Components/Corporation/CorpAssetLocationSelect";
import { CorpLoader, PanelLoader } from "../../Components/Loaders/loaders";
import CorpSelect from "../../Components/Corporation/CorporationSelect";
import { loadAssetGroups } from "../../api/corporation";

const CorporationAssetGroups = () => {
  const { t } = useTranslation();

  const [corporationID, setCorporation] = useState<number>(0);
  const [locationID, setLocation] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["assetGroups", corporationID, locationID],
    queryFn: () => loadAssetGroups(Number(corporationID), Number(locationID)),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="m-3 d-flex align-items-center">
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
        <AssetGroups {...{ data }} />
      ) : (
        <CorpLoader title={t("Select Corporation")} />
      )}
    </>
  );
};

export default CorporationAssetGroups;
