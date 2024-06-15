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
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>Activity</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <div className="d-flex">
            <IconStatusCard
              iconSrc={Sansha}
              cardVariant={data?.incursion ? "success" : undefined}
              text={
                data?.incursion &&
                `+Ƶ${data?.incursion?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })}`
              }
            />
            <IconStatusCard
              iconSrc={Triglavian}
              cardVariant={data?.pochven ? "success" : undefined}
              text={
                data?.pochven &&
                `+Ƶ${data?.pochven?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })}`
              }
            />
            <IconStatusCard
              iconSrc={NPC}
              cardVariant={data?.ratting ? "success" : undefined}
              text={
                data?.ratting &&
                `+Ƶ${data?.ratting?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })}`
              }
            />
            <IconStatusCard
              iconSrc={Missions}
              cardVariant={data?.mission ? "success" : undefined}
              text={
                data?.mission &&
                `+Ƶ${data?.mission?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })}`
              }
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
            <IconStatusCard
              iconSrc={Ice}
              cardVariant={data?.mining_ice ? "success" : undefined}
              text={
                data?.mining_ice &&
                `${data?.mining_ice?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })} m3`
              }
            />
            <IconStatusCard
              iconSrc={Asteroid}
              cardVariant={data?.mining_ore ? "success" : undefined}
              text={
                data?.mining_ore &&
                `${data?.mining_ore?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })} m3`
              }
            />
            <IconStatusCard
              iconSrc={Moons}
              cardVariant={data?.mining_moon ? "success" : undefined}
              text={
                data?.mining_moon &&
                `${data?.mining_moon?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })} m3`
              }
            />
            <IconStatusCard
              iconSrc={Gas}
              cardVariant={data?.mining_gas ? "success" : undefined}
              text={
                data?.mining_gas &&
                `${data?.mining_gas?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  notation: "compact",
                  compactDisplay: "short",
                })} m3`
              }
            />
            <IconStatusCard iconSrc={Planet} cardVariant={data?.pi ? "success" : undefined} />
          </div>
        </Card>
      </div>
    </>
  );
};
