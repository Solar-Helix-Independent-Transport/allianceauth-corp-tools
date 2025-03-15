import { useQuery } from "react-query";
import { loadDivisions } from "../../api/corporation";
import { Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CorpDivisions = ({ corporationID }: { corporationID: number }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["corp-divisions", corporationID],
    queryFn: () => loadDivisions(corporationID),
    initialData: [],
  });

  return (
    <div className="d-flex flex-wrap">
      {data.length > 0 ? (
        data.map((division: any) => {
          return (
            <h5>
              <Badge className="text-center m-2">
                {division.division} {division.name == "Unknown" ? "" : division.name}:{" "}
                {Number(division.balance).toLocaleString()} Isk
              </Badge>
            </h5>
          );
        })
      ) : isLoading ? (
        <Badge>{t("Divisions Loading")}</Badge>
      ) : (
        <Badge>{t("Divisions Unavailable")}</Badge>
      )}
    </div>
  );
};

export default CorpDivisions;
