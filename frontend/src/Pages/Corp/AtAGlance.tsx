import { useTranslation } from "react-i18next";
import { CorporationGlancesActivities } from "../Glance/Activities";
import { CorporationGlancesAssets } from "../Glance/Assets";
import { CorporationGlancesInfo } from "../Glance/Corporation";
import { CorporationGlancesFactions } from "../Glance/Factions";
import { useQueryState } from "nuqs";
import CorpSelect from "../../Components/Corporation/CorporationSelect";
import { CorpLoader } from "../../Components/Loaders/loaders";

const CorporationAtAGlance = () => {
  const { t } = useTranslation();

  const [cidStr] = useQueryState("cid");
  const corporationID = Number(cidStr) || 0;

  return (
    <>
      <div className="m-3 d-flex align-items-center my-1">
        <h6 className="me-1">{t("Corporation Selection")}</h6>
        <div className="flex-grow-1">
          <CorpSelect />
        </div>
      </div>
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
