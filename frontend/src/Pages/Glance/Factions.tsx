import { useTranslation } from "react-i18next";
import { IconStatusDiv } from "../../Components/Cards/IconStatusCard";
import { loadGlanceFactionData } from "../../api/character";
import { loadCorpGlanceFactionData } from "../../api/corporation";
import Amarr from "../../assets/amarr_128.png";
import Cal from "../../assets/caldari_128.png";
import FW from "../../assets/fw_64.png";
import Gal from "../../assets/gallente_128.png";
import Min from "../../assets/minmatar128.png";
import styles from "./AtAGlance.module.css";
import Card from "react-bootstrap/Card";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const Factions = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <h3 className={`${styles.strikeOut} w-100 text-center mt-3`}>{t("Affiliations")}</h3>
      <div className="d-flex flex-wrap justify-content-center">
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Detected Militia")}</Card.Title>
          </Card.Header>
          <div className="d-flex flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={Amarr}
              cardVariant={data?.factions?.amarr ? "success" : undefined}
              textVariant={data?.factions?.amarr ? "success" : "muted"}
              text={data?.factions?.amarr ? data?.factions?.amarr : "-"}
              toolTipText={t("Number of detected alts in Amarr Militia")}
            />
            <IconStatusDiv
              iconSrc={Gal}
              cardVariant={data?.factions?.gallente ? "success" : undefined}
              textVariant={data?.factions?.gallente ? "success" : "muted"}
              text={data?.factions?.gallente ? data?.factions?.gallente : "-"}
              toolTipText={t("Number of detected alts in Gallente Militia")}
            />
            <IconStatusDiv
              iconSrc={Min}
              cardVariant={data?.factions?.minmatar ? "success" : undefined}
              textVariant={data?.factions?.minmatar ? "success" : "muted"}
              text={data?.factions?.minmatar ? data?.factions?.minmatar : "-"}
              toolTipText={t("Number of detected alts in Minmatar Militia")}
            />

            <IconStatusDiv
              iconSrc={Cal}
              cardVariant={data?.factions?.caldari ? "success" : undefined}
              textVariant={data?.factions?.caldari ? "success" : "muted"}
              text={data?.factions?.caldari ? data?.factions?.caldari : "-"}
              toolTipText={t("Number of detected alts in Caldari Militia")}
            />
            <IconStatusDiv
              cardVariant={data?.factions?.angel ? "success" : undefined}
              textVariant={data?.factions?.angel ? "success" : "muted"}
              iconSrc={"https://images.evetech.net/corporations/500011/logo?size=128"}
              text={data?.factions?.angel ? data?.factions?.angel : "-"}
              toolTipText={t("Number of detected alts in Angel Cartel Militia")}
            />
            <IconStatusDiv
              cardVariant={data?.factions?.guristas ? "success" : undefined}
              textVariant={data?.factions?.guristas ? "success" : "muted"}
              iconSrc={"https://images.evetech.net/corporations/500010/logo?size=128"}
              text={data?.factions?.guristas ? data?.factions?.guristas : "-"}
              toolTipText={t("Number of detected alts in Guristas Militia")}
            />
          </div>
        </Card>
        {data?.lp?.evermark?.length > 0 && (
          <Card className="m-2">
            <Card.Header className="text-center">
              <Card.Title>{t("Evermarks")}</Card.Title>
            </Card.Header>
            <div className="d-flex h-100 align-items-center flex-wrap justify-content-center">
              {data?.lp?.evermark?.map((lp_data: any) => {
                return (
                  <IconStatusDiv
                    iconSrc={`https://images.evetech.net/corporations/${lp_data.corp_id}/logo?size=128`}
                    text={
                      lp_data?.lp
                        ? lp_data?.lp?.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            notation: "compact",
                            compactDisplay: "short",
                          })
                        : "?"
                    }
                    textVariant="muted"
                    toolTipText={lp_data.corp_name}
                  />
                );
              })}
            </div>
          </Card>
        )}
        <Card className="m-2">
          <Card.Header className="text-center">
            <Card.Title>{t("Loyalty Points")}</Card.Title>
          </Card.Header>

          <div className="d-flex h-100 align-items-center flex-wrap justify-content-center">
            <IconStatusDiv
              iconSrc={FW}
              text={
                data?.lp?.total
                  ? data?.lp?.total?.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      notation: "compact",
                      compactDisplay: "short",
                    })
                  : "0"
              }
              textVariant={data?.lp?.total ? "success" : undefined}
              cardVariant={data?.lp?.total ? "success" : undefined}
              toolTipText={t("Total LP")}
            />
            {data?.lp?.top_five?.map((lp_data: any) => {
              return (
                <IconStatusDiv
                  iconSrc={`https://images.evetech.net/corporations/${lp_data.corp_id}/logo?size=128`}
                  text={
                    lp_data?.lp
                      ? lp_data?.lp?.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          notation: "compact",
                          compactDisplay: "short",
                        })
                      : "?"
                  }
                  textVariant="muted"
                  toolTipText={lp_data.corp_name}
                />
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
};

export const CharacterGlancesFactions = () => {
  const { characterID } = useParams();

  const { data } = useQuery({
    queryKey: ["glances", "faction", characterID],
    queryFn: () => loadGlanceFactionData(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });
  return <Factions {...{ data }} />;
};

export const CorporationGlancesFactions = ({ corporationID = 0 }) => {
  const { data } = useQuery({
    queryKey: ["glances", "corp", "faction", corporationID],
    queryFn: () => loadCorpGlanceFactionData(corporationID),
    refetchOnWindowFocus: false,
  });
  return <Factions {...{ data }} />;
};
