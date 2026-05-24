import { useTranslation } from "react-i18next";
import {
  IconStatusDiv,
  statusProps,
  COMPACT_NUM_FORMAT,
} from "../../Components/Cards/IconStatusCard";
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
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const fmtISKPlus = (v: any) => `+${Number(v).toLocaleString("en-US", COMPACT_NUM_FORMAT)} ISK`;
const fmtISK = (v: any) => `${Number(v).toLocaleString("en-US", COMPACT_NUM_FORMAT)} ISK`;
const fmtM3 = (v: any) => `${Number(v).toLocaleString("en-US", COMPACT_NUM_FORMAT)} m3`;

const ActivitiesPVE = ({ data, isLoading }: any) => {
  const { t } = useTranslation();
  return (
    <Card className="m-2">
      <Card.Header className="text-center">
        <Card.Title>{t("PvE")}</Card.Title>
      </Card.Header>
      <div className="d-flex flex-wrap justify-content-center">
        <IconStatusDiv
          iconSrc={Sansha}
          {...statusProps(data?.incursion, isLoading, "secondary", fmtISKPlus)}
          toolTipText={t("Total Isk earned in Incursions in the last 30 Days")}
        />
        <IconStatusDiv
          iconSrc={Triglavian}
          {...statusProps(data?.pochven, isLoading, "secondary", fmtISKPlus)}
          toolTipText={t("Total Isk earned in Pochven in the last 30 Days")}
        />
        <IconStatusDiv
          iconSrc={NPC}
          {...statusProps(data?.ratting, isLoading, "secondary", fmtISKPlus)}
          toolTipText={t("Total Isk earned Ratting in the last 30 Days")}
        />
        <IconStatusDiv
          iconSrc={Missions}
          {...statusProps(data?.mission, isLoading, "secondary", fmtISKPlus)}
          toolTipText={t("Total Isk earned running missions in the last 30 Days")}
        />
      </div>
    </Card>
  );
};

const ActivitiesEco = ({ data, isLoading }: any) => {
  const { t } = useTranslation();
  return (
    <Card className="m-2">
      <Card.Header className="text-center">
        <Card.Title>{t("Economic")}</Card.Title>
      </Card.Header>
      <div className="d-flex flex-wrap justify-content-center">
        <IconStatusDiv
          iconSrc={Market}
          {...statusProps(data?.market, isLoading, "secondary", fmtISK)}
          toolTipText={t("Market activity (Net ISK) in the last 30 Days")}
        />
        <IconStatusDiv
          iconSrc={Industry}
          {...statusProps(data?.industry, isLoading)}
          toolTipText={t(
            "Count of Industry activities such as manufacturing or reactions in the last 30 Days",
          )}
        />
        <IconStatusDiv
          iconSrc={Planet}
          {...statusProps(data?.pi, isLoading, "secondary", fmtISK)}
          toolTipText={t("Planetary import/export seen in the last 30 Days")}
        />
      </div>
    </Card>
  );
};

const ActivitiesMining = ({ data, isLoading }: any) => {
  const { t } = useTranslation();
  return (
    <Card className="m-2">
      <Card.Header className="text-center">
        <Card.Title>{t("Mining")}</Card.Title>
      </Card.Header>
      <div className="d-flex flex-wrap justify-content-center">
        <IconStatusDiv
          iconSrc={Ice}
          {...statusProps(data?.mining_ice, isLoading, "secondary", fmtM3)}
          toolTipText={t("Total m3 of Ice mined in the last 30 Days")}
        />
        <IconStatusDiv
          iconSrc={Asteroid}
          {...statusProps(data?.mining_ore, isLoading, "secondary", fmtM3)}
          toolTipText={t("Total m3 of standard ore mined in the last 30 Days")}
        />
        <IconStatusDiv
          iconSrc={Moons}
          {...statusProps(data?.mining_moon, isLoading, "secondary", fmtM3)}
          toolTipText={t("Total m3 of moon ore mined in the last 30 Days")}
        />
        <IconStatusDiv
          iconSrc={Gas}
          {...statusProps(data?.mining_gas, isLoading, "secondary", fmtM3)}
          toolTipText={t("Total m3 of gas anomalies mined in the last 30 Days")}
        />
      </div>
    </Card>
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
