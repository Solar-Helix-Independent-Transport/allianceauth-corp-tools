import { useTranslation } from "react-i18next";
import LabeledSelect from "../Helpers/LabeledSelect";
import CorpSelect from "./CorporationSelect";

const CorporationFilterBar = ({
  label,
  includeAllOption,
}: {
  label?: string;
  includeAllOption?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <LabeledSelect label={label ?? t("Corporation Filter")}>
      <CorpSelect includeAllOption={includeAllOption} />
    </LabeledSelect>
  );
};

export default CorporationFilterBar;
