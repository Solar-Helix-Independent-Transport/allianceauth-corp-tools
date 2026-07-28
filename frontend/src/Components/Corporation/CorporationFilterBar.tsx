import { useTranslation } from "react-i18next";
import LabeledSelect from "../Helpers/LabeledSelect";
import CorpSelect from "./CorporationSelect";

const CorporationFilterBar = ({ label }: { label?: string }) => {
  const { t } = useTranslation();

  return (
    <LabeledSelect label={label ?? t("Corporation Filter")}>
      <CorpSelect />
    </LabeledSelect>
  );
};

export default CorporationFilterBar;
