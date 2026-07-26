import { useTranslation } from "react-i18next";
import { useQueryState } from "nuqs";
import ActivityMap from "../../Components/ActivityMap/ActivityMap";
import CorpSelect from "../../Components/Corporation/CorporationSelect";
import { CORPORATION_ACTIVITY_MAP_DATA_SOURCES } from "../../Components/Corporation/ActivityMap/dataSources";
import { CorpLoader } from "../../Components/Loaders/loaders";

const CorporationActivityMap = () => {
  const { t } = useTranslation();
  const [cidStr] = useQueryState("cid");
  const corporationID = Number(cidStr) || 0;

  return (
    <>
      <div className="m-3 d-flex align-items-center my-1">
        <h6 className="me-1">{t("Corporation Filter")}</h6>
        <div className="flex-grow-1">
          <CorpSelect />
        </div>
      </div>
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
