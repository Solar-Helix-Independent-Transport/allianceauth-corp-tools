import { useTranslation } from "react-i18next";
import { useState } from "react";
import RefTypeSelect from "../../Components/Corporation/RefTypeSelect";
import CorporationWalletTable from "../../Components/Corporation/WalletTable";
import { CorpLoader } from "../../Components/Loaders/loaders";
import CorpDivisions from "../../Components/Corporation/Divisions";
import CorporationFilterBar from "../../Components/Corporation/CorporationFilterBar";
import { useCorporationId } from "../../Components/Corporation/useCorporationId";
import LabeledSelect from "../../Components/Helpers/LabeledSelect";

const CorporationWallets = () => {
  const { t } = useTranslation();
  const corporationID = useCorporationId();
  const [refTypes, setRefs] = useState("");
  return (
    <>
      <CorporationFilterBar />
      <LabeledSelect label={t("Ref Type Filter")}>
        <RefTypeSelect setFilter={setRefs} />
      </LabeledSelect>
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
