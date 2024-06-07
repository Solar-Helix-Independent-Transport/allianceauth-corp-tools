import { IconStatusCard, IconStatusDiv } from "../../Components/Cards/IconStatusCard";
import { CharacterAllegiancePortrait } from "../../Components/EveImages/EveImages";
import Amarr from "../../assets/amarr_128.png";
import Asteroid from "../../assets/asteroid_64.png";
import Cal from "../../assets/caldari_128.png";
import FW from "../../assets/fw_64.png";
import Gal from "../../assets/gallente_128.png";
import Isk from "../../assets/isk_128.png";
import Min from "../../assets/minmatar128.png";
import NPC from "../../assets/npcbattleship_32.png";
import Omega from "../../assets/omega_128.png";
import Unknowns from "../../assets/unknown_64.png";
import styles from "./CharacterAtAGlance.module.css";
import { GlancesActivities } from "./Glance/Activities";
import { GlancesAssets } from "./Glance/Assets";
import { Card } from "react-bootstrap";
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

      <h3 className={`${styles.strikeOut} w-100 text-center`}>Affiliations</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">Detected Militia</Card.Header>
          <div className="d-flex">
            <IconStatusCard iconSrc={Amarr} />
            <IconStatusCard cardVariant={"warning"} iconSrc={Gal} />
            <IconStatusCard iconSrc={Min} />
            <IconStatusCard cardVariant={"warning"} iconSrc={Cal} />
            <IconStatusCard
              cardVariant={"warning"}
              iconSrc={"https://images.evetech.net/corporations/500011/logo?size=128"}
            />
            <IconStatusCard
              iconSrc={"https://images.evetech.net/corporations/500010/logo?size=128"}
            />
          </div>
        </Card>

        <Card className="m-2">
          <Card.Header className="text-center">Loyalty Points</Card.Header>

          <div className="d-flex h-100 align-items-center">
            <IconStatusDiv iconSrc={FW} text="4.6M" textVariant="info" />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/corporations/1000125/logo?size=128"}
              text="2.6M"
              textVariant="muted"
            />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/corporations/500010/logo?size=128"}
              text="1M"
              textVariant="muted"
            />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/corporations/500010/logo?size=128"}
              text="1M"
              textVariant="muted"
            />
          </div>
        </Card>
      </div>
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