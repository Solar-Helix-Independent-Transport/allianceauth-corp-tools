import { useTranslation } from "react-i18next";
import { IconStatusDiv } from "../../Components/Cards/IconStatusCard";
import { loadGlanceRattingData } from "../../api/character";
import Battleship from "../../assets/battleship_32.png";
import Cruiser from "../../assets/cruiser_32.png";
import Dreadnought from "../../assets/dreadnought_32.png";
import Frigate from "../../assets/frigate_32.png";
import Supercarrier from "../../assets/superCarrier_32.png";
import Titan from "../../assets/titan_32.png";
import styles from "./AtAGlance.module.css";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const Ratting = ({ data, isLoading }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Ratting")}</Card.Title>
          </Card.Header>
          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={Battleship}
              textVariant={data?.subcap ? "success" : isLoading ? undefined : "secondary"}
              cardVariant={data?.subcap ? "success" : isLoading ? undefined : "secondary"}
              text={data?.subcap ? data?.subcap : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Subcap bounties earnt")}
            />
            <IconStatusDiv
              iconSrc={Dreadnought}
              textVariant={data?.capital ? "success" : isLoading ? undefined : "secondary"}
              cardVariant={data?.capital ? "success" : isLoading ? undefined : "secondary"}
              text={data?.capital ? data?.capital : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Capital bounties earnt")}
            />
            <IconStatusDiv
              iconSrc={Supercarrier}
              textVariant={data?.supers ? "success" : isLoading ? undefined : "secondary"}
              cardVariant={data?.supers ? "success" : isLoading ? undefined : "secondary"}
              text={data?.supers ? data?.supers : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Super Carrier bounties earnt")}
            />
            <IconStatusDiv
              iconSrc={Titan}
              textVariant={data?.titans ? "success" : isLoading ? undefined : "secondary"}
              cardVariant={data?.titans ? "success" : isLoading ? undefined : "secondary"}
              text={data?.titans ? data?.titans : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Titan bounties earnt")}
            />
          </div>
        </Card>
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Officers")}</Card.Title>
          </Card.Header>
          <div className="d-flex align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={Battleship}
              textVariant={data?.officer ? "success" : isLoading ? undefined : "secondary"}
              cardVariant={data?.officer ? "success" : isLoading ? undefined : "secondary"}
              text={data?.officer ? data?.officer : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Officer bounties earnt")}
            />
            <IconStatusDiv
              iconSrc={Cruiser}
              textVariant={data?.officer_cruiser ? "success" : isLoading ? undefined : "secondary"}
              cardVariant={data?.officer_cruiser ? "success" : isLoading ? undefined : "secondary"}
              text={data?.officer_cruiser ? data?.officer_cruiser : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Officer Cruiser bounties earnt")}
            />
            <IconStatusDiv
              iconSrc={Frigate}
              textVariant={data?.officer_frigate ? "success" : isLoading ? undefined : "secondary"}
              cardVariant={data?.officer_frigate ? "success" : isLoading ? undefined : "secondary"}
              text={data?.officer_frigate ? data?.officer_frigate : "-"}
              isLoading={isLoading}
              toolTipText={t("Count of Officer Frigate bounties earnt")}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export const CharacterGlancesRatting = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "ratting", characterID],
    queryFn: () => loadGlanceRattingData(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Ratting Activity")}</h3>
      <Ratting {...{ data, isLoading }} />
    </>
  );
};
