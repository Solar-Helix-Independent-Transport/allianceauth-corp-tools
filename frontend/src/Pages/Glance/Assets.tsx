import { useTranslation } from "react-i18next";
import { IconStatusDiv, statusProps } from "../../Components/Cards/IconStatusCard";
import { loadGlanceAssetData } from "../../api/character";
import { loadCorpGlanceAssetData } from "../../api/corporation";
import Battlecruiser from "../../assets/battleCruiser_32.png";
import Battleship from "../../assets/battleship_32.png";
import Carrier from "../../assets/carrier_32.png";
import Cruiser from "../../assets/cruiser_32.png";
import Destroyer from "../../assets/destroyer_32.png";
import Dreadnought from "../../assets/dreadnought_32.png";
import Extractor from "../../assets/extractor_64.png";
import Fax from "../../assets/forceAuxiliary_32.png";
import Frieghter from "../../assets/freighter_32.png";
import Frigate from "../../assets/frigate_32.png";
import IndustrialCommand from "../../assets/industrialCommand_32.png";
import Industrial from "../../assets/industrial_32.png";
import MiningBarge from "../../assets/miningBarge_32.png";
import Injector from "../../assets/skillInjector_64.png";
import Supercarrier from "../../assets/superCarrier_32.png";
import Titan from "../../assets/titan_32.png";
import styles from "./AtAGlance.module.css";
import Card from "react-bootstrap/Card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const Assets = ({ data, isLoading }: any) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-wrap justify-content-center">
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("Subcapital")}</Card.Title>
        </Card.Header>
        <div className="d-flex align-items-center flex-wrap justify-content-center">
          <IconStatusDiv
            iconSrc={Frigate}
            {...statusProps(data?.frigate, isLoading)}
            toolTipText={t("Count of Frigate hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Destroyer}
            {...statusProps(data?.destroyer, isLoading)}
            toolTipText={t("Count of Destroyer hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Cruiser}
            {...statusProps(data?.cruiser, isLoading)}
            toolTipText={t("Count of Cruiser hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Battlecruiser}
            {...statusProps(data?.battlecruiser, isLoading)}
            toolTipText={t("Count of battlecruisers hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Battleship}
            {...statusProps(data?.battleship, isLoading)}
            toolTipText={t("Count of battleship hulls owned")}
          />
        </div>
      </Card>
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("Capital")}</Card.Title>
        </Card.Header>
        <div className="d-flex align-items-center flex-wrap justify-content-center">
          <IconStatusDiv
            iconSrc={Carrier}
            {...statusProps(data?.carrier, isLoading)}
            toolTipText={t("Count of Carrier hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Fax}
            {...statusProps(data?.fax, isLoading)}
            toolTipText={t("Count of Fax hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Dreadnought}
            {...statusProps(data?.dread, isLoading)}
            toolTipText={t("Count of Dread hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Supercarrier}
            {...statusProps(data?.supercarrier, isLoading)}
            toolTipText={t("Count of Super Carrier hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Titan}
            {...statusProps(data?.titan, isLoading)}
            toolTipText={t("Count of Titan hulls owned")}
          />
        </div>
      </Card>
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("Industrial")}</Card.Title>
        </Card.Header>
        <div className="d-flex align-items-center flex-wrap justify-content-center">
          <IconStatusDiv
            iconSrc={MiningBarge}
            {...statusProps(data?.mining, isLoading)}
            toolTipText={t("Count of Subcap Industry hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Industrial}
            {...statusProps(data?.hauler, isLoading)}
            toolTipText={t("Count of Subcap Hauler hulls owned")}
          />
          <IconStatusDiv
            iconSrc={IndustrialCommand}
            {...statusProps(data?.indy_command, isLoading)}
            toolTipText={t("Count of Subcap Industrial Command hulls owned")}
          />
          <IconStatusDiv
            iconSrc={Frieghter}
            {...statusProps(data?.capital_indy, isLoading)}
            toolTipText={t("Count of Capital Industrial hulls owned")}
          />
        </div>
      </Card>
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("Notable")}</Card.Title>
        </Card.Header>
        <div className="d-flex align-items-center">
          <IconStatusDiv
            iconSrc={Injector}
            {...statusProps(data?.injector, isLoading)}
            toolTipText={t("Count of Skill Injectors owned")}
          />
          <IconStatusDiv
            iconSrc={Extractor}
            {...statusProps(data?.extractor, isLoading)}
            toolTipText={t("Count of Skill Extractors owned")}
          />
          {!!data?.merc_den && (
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/types/85230/icon?size=32"}
              {...statusProps(data?.merc_den, isLoading)}
              toolTipText={t("Count of Mercenary Dens currently deployed in space")}
            />
          )}
        </div>
      </Card>
      <Card className="m-2">
        <Card.Header className="text-center">
          <Card.Title>{t("Structures")}</Card.Title>
        </Card.Header>
        <div className="d-flex align-items-center">
          <IconStatusDiv
            iconSrc={"https://images.evetech.net/types/35834/icon?size=32"}
            {...statusProps(data?.citadel, isLoading)}
            toolTipText={t("Count of Citadel hulls owned")}
          />
          <IconStatusDiv
            iconSrc={"https://images.evetech.net/types/35827/icon?size=32"}
            {...statusProps(data?.eng_comp, isLoading)}
            toolTipText={t("Count of Engineering Complex hulls owned")}
          />
          <IconStatusDiv
            iconSrc={"https://images.evetech.net/types/81826/icon?size=32"}
            {...statusProps(data?.refinary, isLoading)}
            toolTipText={t("Count of Refinery hulls owned")}
          />
          <IconStatusDiv
            iconSrc={"https://images.evetech.net/types/35841/icon?size=32"}
            {...statusProps(data?.flex, isLoading)}
            toolTipText={t("Count of Flex Structure hulls owned")}
          />
          {!!data?.merc_den_grp && (
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/types/85230/icon?size=32"}
              {...statusProps(data?.merc_den_grp, isLoading)}
              toolTipText={t("Count of Mercenary Den hulls owned")}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export const CharacterGlancesAssets = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "assets", characterID],
    queryFn: () => loadGlanceAssetData(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Character Assets")}</h3>
      <Assets {...{ data, isLoading }} />
    </>
  );
};

export const CorporationGlancesAssets = ({ corporationID = 0 }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corp", "assets", corporationID],
    queryFn: () => loadCorpGlanceAssetData(corporationID),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Character Assets")}</h3>
      <Assets data={data?.character} {...{ isLoading }} />
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Corporate Assets")}</h3>
      <Assets data={data?.corporate} {...{ isLoading }} />
    </>
  );
};
