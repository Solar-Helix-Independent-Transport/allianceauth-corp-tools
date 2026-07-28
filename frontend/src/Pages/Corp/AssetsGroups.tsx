import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AssetGroups } from "../../Components/AssetGroups";
import CorporationAssetLocationSelect from "../../Components/Corporation/CorpAssetLocationSelect";
import { CorpLoader, PanelLoader } from "../../Components/Loaders/loaders";
import CorporationFilterBar from "../../Components/Corporation/CorporationFilterBar";
import { useCorporationId } from "../../Components/Corporation/useCorporationId";
import { loadAssetGroups } from "../../api/corporation";
import LabeledSelect from "../../Components/Helpers/LabeledSelect";

const CorporationAssetGroups = () => {
  const { t } = useTranslation();

  const corporationID = useCorporationId();
  const [locationID, setLocation] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["assetGroups", corporationID, locationID],
    queryFn: () => loadAssetGroups(Number(corporationID), Number(locationID)),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <CorporationFilterBar />
      <LabeledSelect label={t("Location Filter")}>
        <CorporationAssetLocationSelect
          corporationID={corporationID ? Number(corporationID) : 0}
          {...{ setLocation }}
        />
      </LabeledSelect>
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
