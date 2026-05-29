import { useTranslation } from "react-i18next";
import {
  IconStatusDiv,
  statusProps,
  COMPACT_NUM_FORMAT,
} from "../../Components/Cards/IconStatusCard";
import { loadGlanceFactionData } from "../../api/character";
import { loadCorpGlanceFactionData } from "../../api/corporation";
import Amarr from "../../assets/amarr_128.png";
import Cal from "../../assets/caldari_128.png";
import FW from "../../assets/fw_64.png";
import Gal from "../../assets/gallente_128.png";
import Min from "../../assets/minmatar128.png";
import styles from "./AtAGlance.module.css";
import Card from "react-bootstrap/Card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const fmtLP = (v: any) => Number(v).toLocaleString("en-US", COMPACT_NUM_FORMAT);

export const Factions = ({ data, isLoading = false }: any) => {
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
              {...statusProps(data?.factions?.amarr, isLoading)}
              toolTipText={t("Number of detected alts in Amarr Militia")}
            />
            <IconStatusDiv
              iconSrc={Gal}
              {...statusProps(data?.factions?.gallente, isLoading)}
              toolTipText={t("Number of detected alts in Gallente Militia")}
            />
            <IconStatusDiv
              iconSrc={Min}
              {...statusProps(data?.factions?.minmatar, isLoading)}
              toolTipText={t("Number of detected alts in Minmatar Militia")}
            />
            <IconStatusDiv
              iconSrc={Cal}
              {...statusProps(data?.factions?.caldari, isLoading)}
              toolTipText={t("Number of detected alts in Caldari Militia")}
            />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/corporations/500011/logo?size=128"}
              {...statusProps(data?.factions?.angel, isLoading)}
              toolTipText={t("Number of detected alts in Angel Cartel Militia")}
            />
            <IconStatusDiv
              iconSrc={"https://images.evetech.net/corporations/500010/logo?size=128"}
              {...statusProps(data?.factions?.guristas, isLoading)}
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
              {data?.lp?.evermark?.map((lp_data: any) => (
                <IconStatusDiv
                  key={lp_data.corp_id}
                  iconSrc={`https://images.evetech.net/corporations/${lp_data.corp_id}/logo?size=128`}
                  {...statusProps(lp_data?.lp, isLoading, "secondary", fmtLP)}
                  toolTipText={lp_data.corp_name}
                />
              ))}
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
              {...statusProps(data?.lp?.total, isLoading, "secondary", fmtLP)}
              toolTipText={t("Total LP")}
            />
            {data?.lp?.top_five?.map((lp_data: any) => (
              <IconStatusDiv
                key={lp_data.corp_id}
                iconSrc={`https://images.evetech.net/corporations/${lp_data.corp_id}/logo?size=128`}
                {...statusProps(lp_data?.lp, isLoading, "secondary", fmtLP)}
                toolTipText={lp_data.corp_name}
              />
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export const CharacterGlancesFactions = () => {
  const { characterID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["glances", "faction", characterID],
    queryFn: () => loadGlanceFactionData(characterID ? Number(characterID) : 0),
    refetchOnWindowFocus: false,
  });
  return <Factions {...{ data, isLoading }} />;
};

export const CorporationGlancesFactions = ({ corporationID = 0 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "corp", "faction", corporationID],
    queryFn: () => loadCorpGlanceFactionData(corporationID),
    refetchOnWindowFocus: false,
  });
  return <Factions {...{ data, isLoading }} />;
};
