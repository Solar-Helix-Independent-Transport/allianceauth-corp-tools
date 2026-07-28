import { useTranslation } from "react-i18next";
import { CorporationGlancesActivities } from "../Glance/Activities";
import { CorporationGlancesAssets } from "../Glance/Assets";
import { CorporationGlancesInfo } from "../Glance/Corporation";
import { CorporationGlancesFactions } from "../Glance/Factions";
import CorporationFilterBar from "../../Components/Corporation/CorporationFilterBar";
import { useCorporationId } from "../../Components/Corporation/useCorporationId";
import { CorpLoader } from "../../Components/Loaders/loaders";

const CorporationAtAGlance = () => {
  const { t } = useTranslation();

  const corporationID = useCorporationId();

  return (
    <>
      <CorporationFilterBar label={t("Corporation Selection")} />
      <div className="d-flex flex-column align-items-center w-100">
        {corporationID > 0 ? (
          <>
            <CorporationGlancesInfo {...{ corporationID }} />
            <CorporationGlancesActivities {...{ corporationID }} />
            <CorporationGlancesAssets {...{ corporationID }} />
            <CorporationGlancesFactions {...{ corporationID }} />
          </>
        ) : (
          <CorpLoader title={t("Select Corporation")} />
        )}
      </div>
    </>
  );
};

export default CorporationAtAGlance;
