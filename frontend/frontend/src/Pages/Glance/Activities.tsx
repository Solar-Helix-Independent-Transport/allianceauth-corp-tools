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

const Activities = ({ data, isLoading }: any) => {
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
              textVariant={data?.incursion ? "success" : undefined}
              cardVariant={data?.incursion ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.incursion
                  ? `+Ƶ${data?.incursion?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })}`
                  : "-"
              }
              toolTipText={t("Total Isk earned in Incursions in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={Triglavian}
              textVariant={data?.pochven ? "success" : undefined}
              cardVariant={data?.pochven ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.pochven
                  ? `+Ƶ${data?.pochven?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })}`
                  : "-"
              }
              toolTipText={t("Total Isk earned in Pochven in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={NPC}
              textVariant={data?.ratting ? "success" : undefined}
              cardVariant={data?.ratting ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.ratting
                  ? `+Ƶ${data?.ratting?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })}`
                  : "-"
              }
              toolTipText={t("Total Isk earned Ratting in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={Missions}
              textVariant={data?.mission ? "success" : undefined}
              cardVariant={data?.mission ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.mission
                  ? `+Ƶ${data?.mission?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })}`
                  : "-"
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
            <IconStatusCard
              isLoading={isLoading}
              iconSrc={Market}
              cardVariant={data?.market ? "success" : undefined}
              toolTipText={t("Market activity (Net ISK) in the last 30 Days")}
              text={
                data?.mining_ice
                  ? `${data?.market?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })} ISK`
                  : "-"
              }
            />
            <IconStatusCard
              iconSrc={Industry}
              isLoading={isLoading}
              cardVariant={data?.industry ? "success" : undefined}
              textVariant={data?.industry ? "success" : "muted"}
              text={data?.industry ? data?.industry : "-"}
              toolTipText={t(
                "Count of Industry activities such as manufacturing or reactions in the last 30 Days",
              )}
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
              textVariant={data?.mining_ice ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.mining_ice
                  ? `${data?.mining_ice?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })} m3`
                  : "-"
              }
              toolTipText={t("Total m3 of Ice mined in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={Asteroid}
              textVariant={data?.mining_ore ? "success" : undefined}
              cardVariant={data?.mining_ore ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.mining_ore
                  ? `${data?.mining_ore?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })} m3`
                  : "-"
              }
              toolTipText={t("Total m3 of standard ore mined in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={Moons}
              textVariant={data?.mining_moon ? "success" : undefined}
              cardVariant={data?.mining_moon ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.mining_moon
                  ? `${data?.mining_moon?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })} m3`
                  : "-"
              }
              toolTipText={t("Total m3 of moon ore mined in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={Gas}
              textVariant={data?.mining_gas ? "success" : undefined}
              cardVariant={data?.mining_gas ? "success" : undefined}
              isLoading={isLoading}
              text={
                data?.mining_gas
                  ? `${data?.mining_gas?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })} m3`
                  : "-"
              }
              toolTipText={t("Total m3 of gas anomalies mined in the last 30 Days")}
            />
            <IconStatusCard
              iconSrc={Planet}
              isLoading={isLoading}
              cardVariant={data?.pi ? "success" : undefined}
              text={
                data?.mining_gas
                  ? `${data?.pi?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })} Isk`
                  : "-"
              }
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

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "activities", characterID],
    queryFn: () => loadGlanceActivityData(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });

  return <Activities {...{ data, isLoading }} />;
};

export const CorporationGlancesActivities = ({ corporationID = 0 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corp", "activities", corporationID],
    queryFn: () => loadCorpGlanceActivityData(corporationID),
    refetchOnWindowFocus: false,
  });

  return <Activities {...{ data, isLoading }} />;
};
