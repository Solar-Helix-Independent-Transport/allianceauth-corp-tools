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
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>Assets</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Subcapital")}</Card.Title>
          </Card.Header>
          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={Frigate}
              textVariant={data?.frigate ? "info" : "warning"}
              text={data?.frigate ? data?.frigate : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Frigate hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Destroyer}
              textVariant={data?.destroyer ? "info" : "warning"}
              text={data?.destroyer ? data?.destroyer : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Destroyer hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Cruiser}
              textVariant={data?.cruiser ? "info" : "warning"}
              text={data?.cruiser ? data?.cruiser : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Cruiser hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Battlecruiser}
              textVariant={data?.battlecruiser ? "info" : "warning"}
              text={data?.battlecruiser ? data?.battlecruiser : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of battlecruisers hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Battleship}
              textVariant={data?.battleship ? "info" : "warning"}
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
              textVariant={data?.carrier ? "info" : "warning"}
              text={data?.carrier ? data?.carrier : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Carrier hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Fax}
              textVariant={data?.fax ? "info" : "warning"}
              text={data?.fax ? data?.fax : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Fax hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Dreadnought}
              textVariant={data?.dread ? "info" : "warning"}
              text={data?.dread ? data?.dread : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Dread hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Supercarrier}
              textVariant={data?.supercarrier ? "info" : "warning"}
              text={data?.supercarrier ? data?.supercarrier : "-"}
              toolTipText={t("Count of Super Carrier hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Titan}
              textVariant={data?.titan ? "info" : "warning"}
              text={data?.titan ? data?.titan : "-"}
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
              textVariant={data?.mining ? "info" : "warning"}
              text={data?.mining ? data?.mining : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Subcap Industry hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Industrial}
              textVariant={data?.hauler ? "info" : "warning"}
              text={data?.hauler ? data?.hauler : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Subcap Hauler hulls owned")}
            />
            <IconStatusDiv
              iconSrc={IndustrialCommand}
              textVariant={data?.indy_command ? "info" : "warning"}
              text={data?.indy_command ? data?.indy_command : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Subcap Industrial Command hulls owned")}
            />
            <IconStatusDiv
              iconSrc={Frieghter}
              textVariant={data?.capital_indy ? "info" : "warning"}
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
              textVariant={data?.injector ? "info" : "warning"}
              text={data?.injector ? data?.injector : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Skill Injectors owned")}
            />
            <IconStatusDiv
              iconSrc={Extractor}
              textVariant={data?.extractor ? "info" : "warning"}
              text={data?.extractor ? data?.extractor : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Skill Extractors owned")}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export const CharacterGlancesAssets = () => {
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "assets", characterID],
    queryFn: () => loadGlanceAssetData(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });
  console.log(data, isLoading);
  return <Assets {...{ data, isLoading }} />;
};

export const CorporationGlancesAssets = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corp", "assets", 0],
    queryFn: () => loadCorpGlanceAssetData(0),
    refetchOnWindowFocus: false,
  });

  return <Assets {...{ data, isLoading }} />;
};
