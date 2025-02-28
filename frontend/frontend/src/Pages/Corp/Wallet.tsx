import { useTranslation } from "react-i18next";
import { useState } from "react";
import CorpSelect from "../../Components/Corporation/CorporationSelect";
import RefTypeSelect from "../../Components/Corporation/RefTypeSelect";
import CorporationWalletTable from "../../Components/Corporation/WalletTable";
import { CorpLoader } from "../../Components/Loaders/loaders";
import { Card } from "react-bootstrap";

const CorporationWallets = () => {
  const { t } = useTranslation();

  const [corporationID, setCorporation] = useState<number>(0);
  const [refTypes, setRefs] = useState("");

  const RefsToState = (entry: any) => {
    let values = entry.map((o: any) => {
      return o.value;
    });
    setRefs(values.sort().join(","));
  };

  return (
    <>
      <Card>
        <div className="m-3 d-flex align-items-center my-1">
          <h6 className="me-1">{t("Corporation Filter")}</h6>
          <div className="flex-grow-1">
            <CorpSelect {...{ setCorporation }} />
          </div>
        </div>
        <Card.Body className="text-center">This where the division balances will go</Card.Body>
      </Card>
      <div className="m-3 d-flex align-items-center my-1">
        <h6 className="me-1">{t("Ref Type Filter")}</h6>
        <div className="flex-grow-1">
          <RefTypeSelect setFilter={RefsToState} />
        </div>
      </div>
      {corporationID && refTypes !== "" ? (
        <CorporationWalletTable {...{ corporationID, refTypes }} />
      ) : (
        <CorpLoader />
      )}
    </>
  );
};

export default CorporationWallets;
