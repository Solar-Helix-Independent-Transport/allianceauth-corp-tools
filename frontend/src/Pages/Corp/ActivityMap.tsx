import { useTranslation } from "react-i18next";
import ActivityMap from "../../Components/ActivityMap/ActivityMap";
import CorporationFilterBar from "../../Components/Corporation/CorporationFilterBar";
import { useCorporationId } from "../../Components/Corporation/useCorporationId";
import { CORPORATION_ACTIVITY_MAP_DATA_SOURCES } from "../../Components/Corporation/ActivityMap/dataSources";
import { CorpLoader } from "../../Components/Loaders/loaders";

const CorporationActivityMap = () => {
  const { t } = useTranslation();
  const corporationID = useCorporationId();

  return (
    <>
      <CorporationFilterBar />
      {corporationID > 0 ? (
        <ActivityMap
          id={corporationID}
          dataSources={CORPORATION_ACTIVITY_MAP_DATA_SOURCES}
          queryKeyPrefix="corporationActivityMap"
        />
      ) : (
        <CorpLoader title={t("Select Corporation")} />
      )}
    </>
  );
};

export default CorporationActivityMap;
