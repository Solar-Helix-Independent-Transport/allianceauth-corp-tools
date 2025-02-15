import { useTranslation } from "react-i18next";
import { IconStatusCard } from "../../Components/Cards/IconStatusCard";
import { loadCharacterStatus } from "../../api/character";
// import Asteroid from "../../../assets/asteroid_64.png";
// import NPC from "../../../assets/npcbattleship_32.png";
import Isk from "../../assets/isk_128.png";
import Omega from "../../assets/omega_128.png";
import Skills from "../../assets/skillInjector_64.png";
import Unknowns from "../../assets/unknown_64.png";
import styles from "./AtAGlance.module.css";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const CharacterGlancesAccount = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "account", characterID],
    queryFn: () => loadCharacterStatus(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });

  const isk = data?.characters?.reduce((p: number, c: any) => {
    try {
      return p + c.isk;
    } catch (err) {
      return p;
    }
  }, 0);

  const sp = data?.characters?.reduce((p: number, c: any) => {
    try {
      return p + c.sp;
    } catch (err) {
      return p;
    }
  }, 0);

  const bad_chars = data?.characters?.filter((char: any) => !char.active).length;

  const total_chars = data?.characters?.length;

  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Account at a Glance")}</h3>

      <div className="d-flex flex-wrap justify-content-center">
        <IconStatusCard
          cardVariant={isk < 1000000 ? "warning" : undefined}
          iconSrc={Isk}
          textVariant={isk < 1000000 ? "warning" : undefined}
          text={`Ƶ${isk?.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            notation: "compact",
            compactDisplay: "short",
          })}`}
          isLoading={isLoading}
          toolTipText={t("Total Liquid Isk across all characters")}
        />

        <IconStatusCard
          cardVariant={sp < 1000000 ? "warning" : undefined}
          iconSrc={Skills}
          textVariant={sp < 1000000 ? "warning" : undefined}
          text={`${sp?.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            notation: "compact",
            compactDisplay: "short",
          })} SP`}
          isLoading={isLoading}
          toolTipText={t("Total SP across all characters")}
        />

        <IconStatusCard
          iconSrc={Omega}
          text={total_chars?.toLocaleString()}
          isLoading={isLoading}
          toolTipText={t("Count of all known alts")}
        />

        <IconStatusCard
          cardVariant={bad_chars > 0 ? "danger" : "success"}
          iconSrc={Unknowns}
          textVariant={bad_chars > 0 ? "danger" : "success"}
          text={bad_chars?.toLocaleString()}
          isLoading={isLoading}
          toolTipText={t("Count of all known alts not loading into audit")}
        />
      </div>
    </>
  );
};
