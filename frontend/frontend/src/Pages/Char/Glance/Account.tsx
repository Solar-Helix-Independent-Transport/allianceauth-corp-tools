import { IconStatusCard } from "../../../Components/Cards/IconStatusCard";
import { loadCharacterStatus } from "../../../api/character";
// import Asteroid from "../../../assets/asteroid_64.png";
// import NPC from "../../../assets/npcbattleship_32.png";
import Isk from "../../../assets/isk_128.png";
import Omega from "../../../assets/omega_128.png";
import Skills from "../../../assets/skillInjector_64.png";
import Unknowns from "../../../assets/unknown_64.png";
import styles from "../CharacterAtAGlance.module.css";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const GlancesAccount = () => {
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "activities", characterID],
    queryFn: () => loadCharacterStatus(characterID),
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
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>Account at a Glance</h3>
      <div className="d-flex">
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
        />

        <IconStatusCard
          iconSrc={Omega}
          text={total_chars?.toLocaleString()}
          isLoading={isLoading}
        />

        <IconStatusCard
          cardVariant={bad_chars > 0 ? "danger" : "success"}
          iconSrc={Unknowns}
          textVariant={bad_chars > 0 ? "danger" : "success"}
          text={bad_chars?.toLocaleString()}
          isLoading={isLoading}
        />

        {/* <IconStatusCard iconSrc={NPC} textVariant={"info"} text={"Ƶ1.5b"} isLoading={isLoading} />
        <IconStatusCard
          iconSrc={Asteroid}
          textVariant={"info"}
          text={"15M m3"}
          isLoading={isLoading}
        /> */}
      </div>
    </>
  );
};
