import { useTranslation } from "react-i18next";
import { IconStatusDiv } from "../../Components/Cards/IconStatusCard";
import { loadGlanceActivityData } from "../../api/character";
import {
  loadCorpGlanceActivityDataEco,
  loadCorpGlanceActivityDataMining,
  loadCorpGlanceActivityDataPVE,
} from "../../api/corporation";
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

const ActivitiesPVE = ({ data, isLoading }: any) => {
  const { t } = useTranslation();
  return (
    <>
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("PvE")}</Card.Title>
        </Card.Header>
        <div className="d-flex flex-wrap justify-content-center">
          <IconStatusDiv
            iconSrc={Sansha}
            textVariant={data?.incursion ? "success" : undefined}
            cardVariant={data?.incursion ? "success" : undefined}
            isLoading={isLoading}
            text={
              data?.incursion
                ? `+${data?.incursion?.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    notation: "compact",
                    compactDisplay: "short",
                  })} ISK`
                : "-"
            }
            toolTipText={t("Total Isk earned in Incursions in the last 30 Days")}
          />
          <IconStatusDiv
            iconSrc={Triglavian}
            textVariant={data?.pochven ? "success" : undefined}
            cardVariant={data?.pochven ? "success" : undefined}
            isLoading={isLoading}
            text={
              data?.pochven
                ? `+${data?.pochven?.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    notation: "compact",
                    compactDisplay: "short",
                  })} ISK`
                : "-"
            }
            toolTipText={t("Total Isk earned in Pochven in the last 30 Days")}
          />
          <IconStatusDiv
            iconSrc={NPC}
            textVariant={data?.ratting ? "success" : undefined}
            cardVariant={data?.ratting ? "success" : undefined}
            isLoading={isLoading}
            text={
              data?.ratting
                ? `+${data?.ratting?.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    notation: "compact",
                    compactDisplay: "short",
                  })} ISK`
                : "-"
            }
            toolTipText={t("Total Isk earned Ratting in the last 30 Days")}
          />
          <IconStatusDiv
            iconSrc={Missions}
            textVariant={data?.mission ? "success" : undefined}
            cardVariant={data?.mission ? "success" : undefined}
            isLoading={isLoading}
            text={
              data?.mission
                ? `+${data?.mission?.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    notation: "compact",
                    compactDisplay: "short",
                  })} ISK`
                : "-"
            }
            toolTipText={t("Total Isk earned running missions in the last 30 Days")}
          />
        </div>
      </Card>
    </>
  );
};

const ActivitiesEco = ({ data, isLoading }: any) => {
  const { t } = useTranslation();
  return (
    <>
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("Economic")}</Card.Title>
        </Card.Header>
        <div className="d-flex flex-wrap justify-content-center">
          <IconStatusDiv
            isLoading={isLoading}
            iconSrc={Market}
            cardVariant={data?.market ? "success" : undefined}
            textVariant={data?.market > 0 ? "success" : "muted"}
            toolTipText={t("Market activity (Net ISK) in the last 30 Days")}
            text={
              data?.market
                ? `${Number(data?.market).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    notation: "compact",
                    compactDisplay: "short",
                  })} ISK`
                : "-"
            }
          />
          <IconStatusDiv
            iconSrc={Industry}
            isLoading={isLoading}
            cardVariant={data?.industry ? "success" : undefined}
            textVariant={data?.industry ? "success" : "muted"}
            text={data?.industry ? data?.industry : "-"}
            toolTipText={t(
              "Count of Industry activities such as manufacturing or reactions in the last 30 Days",
            )}
          />
          <IconStatusDiv
            iconSrc={Planet}
            isLoading={isLoading}
            cardVariant={data?.pi ? "success" : undefined}
            textVariant={data?.pi != 0 ? "success" : "muted"}
            text={
              data?.pi
                ? `${Number(data?.pi).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    notation: "compact",
                    compactDisplay: "short",
                  })} ISK`
                : "-"
            }
            toolTipText={t("Planetary import/export seen in the last 30 Days")}
          />
        </div>
      </Card>
    </>
  );
};

const ActivitiesMining = ({ data, isLoading }: any) => {
  const { t } = useTranslation();
  return (
    <>
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("Mining")}</Card.Title>
        </Card.Header>
        <div className="d-flex flex-wrap justify-content-center">
          <IconStatusDiv
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
          <IconStatusDiv
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
          <IconStatusDiv
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
          <IconStatusDiv
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
        </div>
      </Card>
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

  const { t } = useTranslation();
  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Character Activity")}</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <ActivitiesPVE {...{ data, isLoading }} />
        <ActivitiesEco {...{ data, isLoading }} />
        <ActivitiesMining {...{ data, isLoading }} />
      </div>
    </>
  );
};

export const CorporationGlancesActivitiesPVE = ({ corporationID = 0 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corp", "pve", corporationID],
    queryFn: () => loadCorpGlanceActivityDataPVE(corporationID),
    refetchOnWindowFocus: false,
  });

  return <ActivitiesPVE {...{ data, isLoading }} />;
};

export const CorporationGlancesActivitiesEco = ({ corporationID = 0 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corp", "eco", corporationID],
    queryFn: () => loadCorpGlanceActivityDataEco(corporationID),
    refetchOnWindowFocus: false,
  });

  return <ActivitiesEco {...{ data, isLoading }} />;
};

export const CorporationGlancesActivitiesMining = ({ corporationID = 0 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corp", "ore", corporationID],
    queryFn: () => loadCorpGlanceActivityDataMining(corporationID),
    refetchOnWindowFocus: false,
  });

  return <ActivitiesMining {...{ data, isLoading }} />;
};

export const CorporationGlancesActivities = ({ corporationID = 0 }) => {
  const { t } = useTranslation();
  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Character Activity")}</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <CorporationGlancesActivitiesPVE {...{ corporationID }} />
        <CorporationGlancesActivitiesEco {...{ corporationID }} />
        <CorporationGlancesActivitiesMining {...{ corporationID }} />
      </div>
    </>
  );
};
