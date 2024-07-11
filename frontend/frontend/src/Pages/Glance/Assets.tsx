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
  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>Assets</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">Subcapital</Card.Header>

          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={Frigate}
              textVariant={data?.frigate ? "info" : "warning"}
              text={data?.frigate ? data?.frigate : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Destroyer}
              textVariant={data?.destroyer ? "info" : "warning"}
              text={data?.destroyer ? data?.destroyer : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Cruiser}
              textVariant={data?.cruiser ? "info" : "warning"}
              text={data?.cruiser ? data?.cruiser : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Battlecruiser}
              textVariant={data?.battlecruiser ? "info" : "warning"}
              text={data?.battlecruiser ? data?.battlecruiser : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Battleship}
              textVariant={data?.battleship ? "info" : "warning"}
              text={data?.battleship ? data?.battleship : "-"}
              isLoading={isLoading}
            />
          </div>
        </Card>
        <Card className="m-2">
          <Card.Header className="text-center">Capital</Card.Header>

          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={Carrier}
              textVariant={data?.carrier ? "info" : "warning"}
              text={data?.carrier ? data?.carrier : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Fax}
              textVariant={data?.fax ? "info" : "warning"}
              text={data?.fax ? data?.fax : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Dreadnought}
              textVariant={data?.dread ? "info" : "warning"}
              text={data?.dread ? data?.dread : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Supercarrier}
              textVariant={data?.supercarrier ? "info" : "warning"}
              text={data?.supercarrier ? data?.supercarrier : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Titan}
              textVariant={data?.titan ? "info" : "warning"}
              text={data?.titan ? data?.titan : "-"}
              isLoading={isLoading}
            />
          </div>
        </Card>
        <Card className="m-2">
          <Card.Header className="text-center">Industrial</Card.Header>

          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={MiningBarge}
              textVariant={data?.mining ? "info" : "warning"}
              text={data?.mining ? data?.mining : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Industrial}
              textVariant={data?.hauler ? "info" : "warning"}
              text={data?.hauler ? data?.hauler : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={IndustrialCommand}
              textVariant={data?.indy_command ? "info" : "warning"}
              text={data?.indy_command ? data?.indy_command : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Frieghter}
              textVariant={data?.capital_indy ? "info" : "warning"}
              text={data?.capital_indy ? data?.capital_indy : "-"}
              isLoading={isLoading}
            />
          </div>
        </Card>
        <Card className="m-2">
          <Card.Header className="text-center">Notable</Card.Header>

          <div className="d-flex align-items-center">
            <IconStatusDiv
              iconSrc={Injector}
              textVariant={data?.injector ? "info" : "warning"}
              text={data?.injector ? data?.injector : "-"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Extractor}
              textVariant={data?.extractor ? "info" : "warning"}
              text={data?.extractor ? data?.extractor : "-"}
              isLoading={isLoading}
            />
          </div>
        </Card>
        {/* <Card className="m-2">
          <div className="d-flex align-items-center">
            <img src={Blueprint} height={32} width={32} className="m-2" />
            <IconStatusDiv iconSrc={Titan} textVariant="info" text={"1"} isLoading={isLoading} />
            <IconStatusDiv
              iconSrc={Supercarrier}
              textVariant="info"
              text={"2"}
              isLoading={isLoading}
            />
            <IconStatusDiv
              iconSrc={Dreadnought}
              textVariant="info"
              text={"4"}
              isLoading={isLoading}
            />
          </div>
        </Card> */}
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
