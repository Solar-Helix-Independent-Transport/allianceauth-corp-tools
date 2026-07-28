import { useTranslation } from "react-i18next";
import CorpSelect from "./CorporationSelect";

const CorporationFilterBar = ({ label }: { label?: string }) => {
  const { t } = useTranslation();

  return (
    <div className="m-3 d-flex align-items-center my-1">
      <h6 className="me-1">{label ?? t("Corporation Filter")}</h6>
      <div className="flex-grow-1">
        <CorpSelect />
      </div>
    </div>
  );
};

export default CorporationFilterBar;
