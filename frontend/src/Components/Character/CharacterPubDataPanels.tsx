import { useTranslation } from "react-i18next";
import { PortraitCard } from "../Cards/PortraitCard";
import { PanelLoader } from "../Loaders/loaders";
import { Table } from "react-bootstrap";

const CharacterPubDataPanels = ({ isFetching, data }: { isFetching: boolean; data: any }) => {
  const { t } = useTranslation();

  if (!data) return <PanelLoader />;

  return (
    <div className="d-flex justify-content-around align-items-center flex-row flex-wrap">
      {data?.characters.map((char: any) => {
        const char_status = char.active ? "success" : "warning";
        return (
          <PortraitCard
            border={char_status}
            isFetching={isFetching}
            character={char.character}
            heading={char.character.character_name}
            roundedImages={"10"}
          >
            <div style={{ width: "350px" }}>
              <div>
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr key={`head-${char.character}`}>
                      <th>{t("Corporation")}</th>
                      <th className="text-end">{t("Joined")}</th>
                    </tr>
                  </thead>
                </Table>
                <div
                  style={{ width: "350px", height: "250px", overflowY: "auto" }}
                  className="card-img-bottom"
                >
                  <Table striped>
                    <tbody>
                      {char.history?.map((h: any) => {
                        return (
                          <tr key={h.start}>
                            <td>{h.corporation.corporation_name}</td>
                            <td className="text-end text-nowrap">{h.start.slice(0, 10)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </PortraitCard>
        );
      })}
    </div>
  );
};

export default CharacterPubDataPanels;
