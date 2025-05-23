import { useTranslation } from "react-i18next";
import { useState } from "react";
import CorpSelect from "../../Components/Corporation/CorporationSelect";
import RefTypeSelect from "../../Components/Corporation/RefTypeSelect";
import CorporationWalletTable from "../../Components/Corporation/WalletTable";
import { CorpLoader } from "../../Components/Loaders/loaders";
import CorpDivisions from "../../Components/Corporation/Divisions";

const CorporationWallets = () => {
  const { t } = useTranslation();
  const [corporationID, setCorporation] = useState<number>(0);
  const [refTypes, setRefs] = useState("");
  return (
    <>
      <div className="m-3 d-flex align-items-center my-1">
        <h6 className="me-1">{t("Corporation Filter")}</h6>
        <div className="flex-grow-1">
          <CorpSelect {...{ setCorporation }} />
        </div>
      </div>
      <div className="m-3 d-flex align-items-center my-1">
        <h6 className="me-1">{t("Ref Type Filter")}</h6>
        <div className="flex-grow-1">
          <RefTypeSelect setFilter={setRefs} preFill={refTypes} />
        </div>
      </div>
      <div className="d-flex flex-column align-items-center my-1">
        <h5>{t("Division Balances")}</h5>
        <CorpDivisions corporationID={corporationID} />
      </div>
      {corporationID ? (
        refTypes == "" ? (
          <CorpLoader title={t("Select Ref Types")} />
        ) : (
          <CorporationWalletTable {...{ corporationID, refTypes }} />
        )
      ) : (
        <CorpLoader />
      )}
    </>
  );
};

export default CorporationWallets;
