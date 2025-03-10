import { useTranslation } from "react-i18next";
import { IconStatusDiv } from "../../Components/Cards/IconStatusCard";
import { loadCorpGlanceStatusData } from "../../api/corporation";
import Isk from "../../assets/isk_128.png";
import Omega from "../../assets/omega_128.png";
import Unknowns from "../../assets/unknown_64.png";
import styles from "./AtAGlance.module.css";
import { useQuery } from "react-query";

export const CorporationGlancesInfo = ({ corporationID = 0 }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corporation", "status", corporationID],
    queryFn: () => loadCorpGlanceStatusData(corporationID),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Corporation Members")}</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <IconStatusDiv
          cardVariant={data?.characters?.liquid < 1000000 ? "warning" : undefined}
          iconSrc={Isk}
          textVariant={data?.characters?.liquid < 1000000 ? "warning" : undefined}
          text={`${data?.characters?.liquid?.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            notation: "compact",
            compactDisplay: "short",
          })} ISK`}
          isLoading={isLoading}
          toolTipText={t("Total Liquid Isk across all characters and alts in corporation")}
        />

        <IconStatusDiv
          iconSrc={Omega}
          text={data?.characters?.known_and_alts?.toLocaleString()}
          isLoading={isLoading}
          toolTipText={t("Count of all known Characters and Alts")}
        />

        <IconStatusDiv
          cardVariant={
            data?.characters?.known_in_corp < data?.characters?.in_corp ? "warning" : "success"
          }
          textVariant={
            data?.characters?.known_in_corp < data?.characters?.in_corp ? "warning" : "success"
          }
          iconSrc={Omega}
          text={`${data?.characters?.known_in_corp?.toLocaleString()}/${data?.characters?.in_corp?.toLocaleString()}`}
          isLoading={isLoading}
          toolTipText={t("Count of all known Characters in Corp")}
        />

        <IconStatusDiv
          cardVariant={data?.characters?.bad > 0 ? "danger" : "success"}
          iconSrc={Unknowns}
          textVariant={data?.characters?.bad > 0 ? "danger" : "success"}
          text={data?.characters?.bad?.toLocaleString()}
          isLoading={isLoading}
          toolTipText={t("Count of all known characters or alts not loading into audit")}
        />
      </div>
    </>
  );
};
