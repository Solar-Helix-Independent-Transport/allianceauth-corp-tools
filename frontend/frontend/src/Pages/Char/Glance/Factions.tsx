import { IconStatusCard, IconStatusDiv } from "../../../Components/Cards/IconStatusCard";
import { loadGlanceFactionData } from "../../../api/character";
import Amarr from "../../../assets/amarr_128.png";
import Cal from "../../../assets/caldari_128.png";
import FW from "../../../assets/fw_64.png";
import Gal from "../../../assets/gallente_128.png";
import Min from "../../../assets/minmatar128.png";
import styles from "../CharacterAtAGlance.module.css";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const GlancesFactions = () => {
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "faction", characterID],
    queryFn: () => loadGlanceFactionData(characterID),
    refetchOnWindowFocus: false,
  });
  console.log(isLoading, data);
  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center`}>Affiliations</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">Detected Militia</Card.Header>
          <div className="d-flex">
            <IconStatusCard
              iconSrc={Amarr}
              cardVariant={data?.factions.amarr ? "success" : undefined}
            />
            <IconStatusCard
              iconSrc={Gal}
              cardVariant={data?.factions.gallente ? "success" : undefined}
            />
            <IconStatusCard
              iconSrc={Min}
              cardVariant={data?.factions.minmatar ? "success" : undefined}
            />
            <IconStatusCard
              iconSrc={Cal}
              cardVariant={data?.factions.caldari ? "success" : undefined}
            />
            <IconStatusCard
              cardVariant={data?.factions.angel ? "success" : undefined}
              iconSrc={"https://images.evetech.net/corporations/500011/logo?size=128"}
            />
            <IconStatusCard
              cardVariant={data?.factions.guristas ? "success" : undefined}
              iconSrc={"https://images.evetech.net/corporations/500010/logo?size=128"}
            />
          </div>
        </Card>
        <Card className="m-2">
          <Card.Header className="text-center">Loyalty Points</Card.Header>

          <div className="d-flex h-100 align-items-center">
            <IconStatusDiv
              iconSrc={FW}
              text={data?.lp?.total.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                notation: "compact",
                compactDisplay: "short",
              })}
              textVariant="info"
            />
            {data?.lp?.top_five.map((lp_data: any) => {
              return (
                <IconStatusDiv
                  iconSrc={`https://images.evetech.net/corporations/${lp_data.corp_id}/logo?size=128`}
                  text={lp_data.lp.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    notation: "compact",
                    compactDisplay: "short",
                  })}
                  textVariant="muted"
                />
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
};
