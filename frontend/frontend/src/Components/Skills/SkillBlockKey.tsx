import { useTranslation } from "react-i18next";

export const SkillBlockKey = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column w-100">
      <h5 className="text-center">Key</h5>
      <div className="d-flex text-center justify-content-center">
        <div className="m-3">
          <p>{t("Trained Level")}</p>
          <i className="fas fa-circle"></i>
        </div>
        <div className="m-3">
          <p>{t("Omega Restricted")}</p>
          <i className="fas fa-circle" style={{ color: "grey" }}></i>
        </div>
        <div className="m-3">
          <p>{t("Missing Level")}</p>
          <i className="fas fa-circle" style={{ color: "orange" }}></i>
        </div>
      </div>
    </div>
  );
};
