import { useTranslation } from "react-i18next";
import { LoadAgregatedMining } from "../../api/corporation";
import { useQuery } from "react-query";
import LedgerGraph from "../../Components/Graphs/LedgerGraph";
import { PanelLoader } from "../../Components/Loaders/loaders";
import { useState } from "react";
import CorpSelect from "../../Components/Corporation/CorporationSelect";

const CorporationMiningLedger = () => {
  const { t } = useTranslation();
  const [corporationID, setCorporation] = useState<number>(0);

  const { data } = useQuery({
    queryKey: ["mining-ledger-corp", corporationID],
    queryFn: () => LoadAgregatedMining(Number(corporationID)),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="m-3 d-flex align-items-center my-1">
        <h6 className="me-1">{t("Corporation Filter")}</h6>
        <div className="flex-grow-1">
          <CorpSelect {...{ setCorporation }} />
        </div>
      </div>

      {data ? <LedgerGraph {...{ data }} /> : <PanelLoader />}
    </>
  );
};

export default CorporationMiningLedger;
