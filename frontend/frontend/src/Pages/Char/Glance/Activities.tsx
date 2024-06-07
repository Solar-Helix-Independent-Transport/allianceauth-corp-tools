import { IconStatusCard } from "../../../Components/Cards/IconStatusCard";
import { loadGlanceActivityData } from "../../../api/character";
import Asteroid from "../../../assets/asteroid_64.png";
import Gas from "../../../assets/gas_64.png";
import Ice from "../../../assets/ice_64.png";
import Sansha from "../../../assets/incursion_2_64.png";
import Industry from "../../../assets/industry_128.png";
import Market from "../../../assets/market_128.png";
import Missions from "../../../assets/missions_2_128.png";
import Moons from "../../../assets/moonAsteroid_JackpotR32.png";
import NPC from "../../../assets/npcbattleship_32.png";
import Planet from "../../../assets/planet_128.png";
import Triglavian from "../../../assets/triglavian_128.png";
import styles from "../CharacterAtAGlance.module.css";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const GlancesActivities = () => {
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "activities", characterID],
    queryFn: () => loadGlanceActivityData(characterID),
    refetchOnWindowFocus: false,
  });
  console.log(isLoading, data);
  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center`}>Activity</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <div className="d-flex">
            <IconStatusCard
              iconSrc={Sansha}
              cardVariant={data?.incursion ? "success" : undefined}
            />
            <IconStatusCard
              iconSrc={Triglavian}
              cardVariant={data?.pochven ? "success" : undefined}
            />
            <IconStatusCard iconSrc={NPC} cardVariant={data?.ratting ? "success" : undefined} />
            <IconStatusCard
              iconSrc={Missions}
              cardVariant={data?.mission ? "success" : undefined}
            />
          </div>
        </Card>
        <Card className="m-2">
          <div className="d-flex">
            <IconStatusCard iconSrc={Market} cardVariant={data?.market ? "success" : undefined} />
            <IconStatusCard
              iconSrc={Industry}
              cardVariant={data?.industry ? "success" : undefined}
            />
          </div>
        </Card>
        <Card className="m-2">
          <div className="d-flex">
            <IconStatusCard iconSrc={Ice} cardVariant={data?.mining_ice ? "success" : undefined} />
            <IconStatusCard
              iconSrc={Asteroid}
              cardVariant={data?.mining_ore ? "success" : undefined}
            />
            <IconStatusCard
              iconSrc={Moons}
              cardVariant={data?.mining_moon ? "success" : undefined}
            />
            <IconStatusCard iconSrc={Gas} cardVariant={data?.mining_gas ? "success" : undefined} />
            <IconStatusCard iconSrc={Planet} cardVariant={data?.pi ? "success" : undefined} />
          </div>
        </Card>
      </div>
    </>
  );
};
