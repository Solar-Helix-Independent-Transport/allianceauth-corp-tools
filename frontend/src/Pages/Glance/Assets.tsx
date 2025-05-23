import { useTranslation } from "react-i18next";
import { IconStatusDiv } from "../../Components/Cards/IconStatusCard";
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
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const Assets = ({ data, isLoading }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Subcapital")}</Card.Title>
          </Card.Header>
          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={Frigate}
              textVariant={data?.frigate ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.frigate ? "success" : isLoading ? undefined : "warning"}
              text={data?.frigate ? data?.frigate : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Frigate hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Destroyer}
              textVariant={data?.destroyer ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.destroyer ? "success" : isLoading ? undefined : "warning"}
              text={data?.destroyer ? data?.destroyer : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Destroyer hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Cruiser}
              textVariant={data?.cruiser ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.cruiser ? "success" : isLoading ? undefined : "warning"}
              text={data?.cruiser ? data?.cruiser : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Cruiser hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Battlecruiser}
              textVariant={data?.battlecruiser ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.battlecruiser ? "success" : isLoading ? undefined : "warning"}
              text={data?.battlecruiser ? data?.battlecruiser : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of battlecruisers hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Battleship}
              textVariant={data?.battleship ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.battleship ? "success" : isLoading ? undefined : "warning"}
              text={data?.battleship ? data?.battleship : "-"}
              isLoading={isLoading}
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
              textVariant={data?.carrier ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.carrier ? "success" : isLoading ? undefined : "warning"}
              text={data?.carrier ? data?.carrier : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Carrier hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Fax}
              textVariant={data?.fax ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.fax ? "success" : isLoading ? undefined : "warning"}
              text={data?.fax ? data?.fax : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Fax hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Dreadnought}
              textVariant={data?.dread ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.dread ? "success" : isLoading ? undefined : "warning"}
              text={data?.dread ? data?.dread : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Dread hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Supercarrier}
              textVariant={data?.supercarrier ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.supercarrier ? "success" : isLoading ? undefined : "warning"}
              text={data?.supercarrier ? data?.supercarrier : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Super Carrier hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Titan}
              textVariant={data?.titan ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.titan ? "success" : isLoading ? undefined : "warning"}
              text={data?.titan ? data?.titan : "-"}
              isLoading={isLoading}
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
              textVariant={data?.mining ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.mining ? "success" : isLoading ? undefined : "warning"}
              text={data?.mining ? data?.mining : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Subcap Industry hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Industrial}
              textVariant={data?.hauler ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.hauler ? "success" : isLoading ? undefined : "warning"}
              text={data?.hauler ? data?.hauler : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Subcap Hauler hulls owned")}
            />
            <IconStatusDiv
              iconSrc={IndustrialCommand}
              textVariant={data?.indy_command ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.indy_command ? "success" : isLoading ? undefined : "warning"}
              text={data?.indy_command ? data?.indy_command : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Subcap Industrial Command hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Frieghter}
              textVariant={data?.capital_indy ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.capital_indy ? "success" : isLoading ? undefined : "warning"}
              text={data?.capital_indy ? data?.capital_indy : "-"}
              isLoading={isLoading}
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
              textVariant={data?.injector ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.injector ? "success" : isLoading ? undefined : "warning"}
              text={data?.injector ? data?.injector : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Skill Injectors owned")}
            />
            <IconStatusDiv
              iconSrc={Extractor}
              textVariant={data?.extractor ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.extractor ? "success" : isLoading ? undefined : "warning"}
              text={data?.extractor ? data?.extractor : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Skill Extractors owned")}
            />
            {data?.merc_den ? (
              <IconStatusDiv
                iconSrc={"https://images.evetech.net/types/85230/icon?size=32"}
                textVariant={data?.merc_den ? "success" : isLoading ? undefined : "warning"}
                cardVariant={data?.merc_den ? "success" : isLoading ? undefined : "warning"}
                text={data?.merc_den ? data?.merc_den : "-"}
                isLoading={isLoading}
                toolTipText={t("Count of Mercenary Dens currently deployed in space")}
              />
            ) : (
              <></>
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
              textVariant={data?.citadel ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.citadel ? "success" : isLoading ? undefined : "warning"}
              text={data?.citadel ? data?.citadel : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Citadel hulls owned")}
            />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/types/35827/icon?size=32"}
              textVariant={data?.eng_comp ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.eng_comp ? "success" : isLoading ? undefined : "warning"}
              text={data?.eng_comp ? data?.eng_comp : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Engineering Complex hulls owned")}
            />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/types/81826/icon?size=32"}
              textVariant={data?.refinary ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.refinary ? "success" : isLoading ? undefined : "warning"}
              text={data?.refinary ? data?.refinary : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Refinery hulls owned")}
            />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/types/35841/icon?size=32"}
              textVariant={data?.flex ? "success" : isLoading ? undefined : "warning"}
              cardVariant={data?.flex ? "success" : isLoading ? undefined : "warning"}
              text={data?.flex ? data?.flex : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Flex Structure hulls owned")}
            />
            {data?.merc_den_grp ? (
              <IconStatusDiv
                iconSrc={"https://images.evetech.net/types/85230/icon?size=32"}
                textVariant={data?.merc_den ? "success" : isLoading ? undefined : "warning"}
                cardVariant={data?.merc_den ? "success" : isLoading ? undefined : "warning"}
                text={data?.merc_den ? data?.merc_den : "-"}
                isLoading={isLoading}
                toolTipText={t("Count of Mercenary Den hulls owned")}
              />
            ) : (
              <></>
            )}
          </div>
        </Card>
      </div>
    </>
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
