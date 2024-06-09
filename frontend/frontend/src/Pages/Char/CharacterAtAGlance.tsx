import { IconStatusCard } from "../../Components/Cards/IconStatusCard";
import { CharacterAllegiancePortrait } from "../../Components/EveImages/EveImages";
import Asteroid from "../../assets/asteroid_64.png";
import Isk from "../../assets/isk_128.png";
import NPC from "../../assets/npcbattleship_32.png";
import Omega from "../../assets/omega_128.png";
import Unknowns from "../../assets/unknown_64.png";
import styles from "./CharacterAtAGlance.module.css";
import { GlancesActivities } from "./Glance/Activities";
import { GlancesAssets } from "./Glance/Assets";
import { GlancesFactions } from "./Glance/Factions";
import { useParams } from "react-router-dom";

const CharacterAtAGlance = () => {
  const { characterID } = useParams();
  return (
    <div className="d-flex flex-column align-items-center">
      <CharacterAllegiancePortrait
        character={{
          character_id: characterID,
          corporation_id: 1,
          alliance_id: 1,
        }}
        size={256}
        rounded_images={true}
      />
      <GlancesAssets />
      <GlancesActivities />
      <GlancesFactions />

      <h3 className={`${styles.strikeOut} w-100 text-center`}>Account at a Glance</h3>
      <div className="d-flex">
        <IconStatusCard
          cardVariant={"success"}
          iconSrc={Isk}
          textVariant={"success"}
          text={"+36b"}
        />
        <IconStatusCard cardVariant={"info"} iconSrc={Omega} textVariant={"info"} text={"5"} />
        <IconStatusCard
          cardVariant={"danger"}
          iconSrc={Unknowns}
          textVariant={"danger"}
          text={"5"}
        />
        <IconStatusCard iconSrc={NPC} textVariant={"info"} text={"Ƶ1.5b"} />
        <IconStatusCard iconSrc={Asteroid} textVariant={"info"} text={"15M m3"} />
      </div>
      {/* <h3 className={`${styles.strikeOut} mt-4 w-100 text-center`}>Character Status</h3> */}
    </div>
  );
};

export default CharacterAtAGlance;
