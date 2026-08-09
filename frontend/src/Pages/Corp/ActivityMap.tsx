import ActivityMap from "../../Components/ActivityMap/ActivityMap";
import CorporationFilterBar from "../../Components/Corporation/CorporationFilterBar";
import { useCorporationId } from "../../Components/Corporation/useCorporationId";
import { CORPORATION_ACTIVITY_MAP_DATA_SOURCES } from "../../Components/Corporation/ActivityMap/dataSources";

const CorporationActivityMap = () => {
  const corporationID = useCorporationId();

  return (
    <>
      <CorporationFilterBar includeAllOption />
      <ActivityMap
        id={corporationID}
        dataSources={CORPORATION_ACTIVITY_MAP_DATA_SOURCES}
        queryKeyPrefix="corporationActivityMap"
      />
    </>
  );
};

export default CorporationActivityMap;
