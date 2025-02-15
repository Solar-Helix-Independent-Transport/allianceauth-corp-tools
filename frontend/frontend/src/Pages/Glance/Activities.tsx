import { useTranslation } from "react-i18next";
import { IconStatusCard } from "../../Components/Cards/IconStatusCard";
import { loadGlanceActivityData } from "../../api/character";
import { loadCorpGlanceActivityData } from "../../api/corporation";
import Asteroid from "../../assets/asteroid_64.png";
import Gas from "../../assets/gas_64.png";
import Ice from "../../assets/ice_64.png";
import Sansha from "../../assets/incursion_2_64.png";
import Industry from "../../assets/industry_128.png";
import Market from "../../assets/market_128.png";
import Missions from "../../assets/missions_2_128.png";
import Moons from "../../assets/moonAsteroid_JackpotR32.png";
import NPC from "../../assets/npcbattleship_32.png";
import Planet from "../../assets/planet_128.png";
import Triglavian from "../../assets/triglavian_128.png";
import styles from "./AtAGlance.module.css";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const Activities = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>Activity</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("PvE")}</Card.Title>
          </Card.Header>
          <div className="d-flex flex-wrap justify-content-center">
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
              toolTipText={t("Total Isk earned in Incursions in the last 30 Days")}
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
              toolTipText={t("Total Isk earned in Pochven in the last 30 Days")}
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
              toolTipText={t("Total Isk earned Ratting in the last 30 Days")}
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
              toolTipText={t("Total Isk earned running missions in the last 30 Days")}
            />
          </div>
        </Card>
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Economic")}</Card.Title>
          </Card.Header>
          <div className="d-flex flex-wrap justify-content-center">
            <IconStatusCard iconSrc={Market} cardVariant={data?.market ? "success" : undefined} />
            <IconStatusCard
              iconSrc={Industry}
              cardVariant={data?.industry ? "success" : undefined}
              toolTipText={t("Industry activities such as manufacturing or reactions")}
            />
          </div>
        </Card>
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Mining")}</Card.Title>
          </Card.Header>
          <div className="d-flex flex-wrap justify-content-center">
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
              toolTipText={t("Total m3 of Ice mined in the last 30 Days")}
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
              toolTipText={t("Total m3 of standard ore mined in the last 30 Days")}
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
              toolTipText={t("Total m3 of moon ore mined in the last 30 Days")}
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
              toolTipText={t("Total m3 of gas anomalies mined in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={Planet}
              cardVariant={data?.pi ? "success" : undefined}
              toolTipText={t("Planetary import/export seen in the last 30 Days")}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export const CharacterGlancesActivities = () => {
  const { characterID } = useParams();

  const { data } = useQuery({
    queryKey: ["glances", "activities", characterID],
    queryFn: () => loadGlanceActivityData(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });

  return <Activities data={data} />;
};

export const CorporationGlancesActivities = () => {
  const { data } = useQuery({
    queryKey: ["glances", "corp", "activities", 0],
    queryFn: () => loadCorpGlanceActivityData(0),
    refetchOnWindowFocus: false,
  });

  return <Activities data={data} />;
};
