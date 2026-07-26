import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { ReactFlowProvider } from "@xyflow/react";
import { useQuery } from "@tanstack/react-query";
import type { MapCoordMode } from "../SpaceMap/types";
import ActivityMapCanvas from "./ActivityMapCanvas";
import { getActivityMapDataSource } from "./types";
import type { ActivityMapDataSource } from "./types";

// The shared map view: a data-source dropdown, a coordinate-layout toggle,
// and the canvas underneath. `id` is whatever scope the map is fetching for
// (a character id, a corporation id, ...) and `dataSources` is that scope's
// own registry of {value, label, load, ...labels} - the fetch/dropdown/
// render logic here doesn't care which scope it's serving.
const ActivityMap = ({
  id,
  dataSources,
  queryKeyPrefix,
}: {
  id: number;
  dataSources: ActivityMapDataSource[];
  queryKeyPrefix: string;
}) => {
  const { t } = useTranslation();
  const [coords, setCoords] = useQueryState("coords", { defaultValue: "2d" });
  const coordMode: MapCoordMode = coords === "real" ? "real" : "2d";
  const [source, setSource] = useQueryState("source", {
    defaultValue: dataSources[0].value,
  });
  const dataSource = getActivityMapDataSource(dataSources, source);

  const { data, isFetching } = useQuery({
    queryKey: [queryKeyPrefix, id, dataSource.value],
    queryFn: () => dataSource.load(id),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="d-flex justify-content-end align-items-center mb-2 flex-wrap gap-2">
        <span className="me-1">{t("Data")}</span>
        <Form.Select
          size="sm"
          style={{ width: 180 }}
          value={dataSource.value}
          onChange={(e) => setSource(e.target.value)}
          aria-label={t("Data shown on map")}
        >
          {dataSources.map((s) => (
            <option key={s.value} value={s.value}>
              {t(s.label)}
            </option>
          ))}
        </Form.Select>
        <ButtonGroup>
          <ToggleButton
            id="activitymap-coords-2d"
            type="radio"
            size="sm"
            variant="outline-secondary"
            name="activitymap-coords"
            value="2d"
            checked={coordMode === "2d"}
            onChange={() => setCoords("2d")}
            title={t("Dotlan-style laid-out map")}
          >
            {t("Map Layout")}
          </ToggleButton>
          <ToggleButton
            id="activitymap-coords-real"
            type="radio"
            size="sm"
            variant="outline-secondary"
            name="activitymap-coords"
            value="real"
            checked={coordMode === "real"}
            onChange={() => setCoords("real")}
            title={t("Actual in-game universe coordinates")}
          >
            {t("Real Coords")}
          </ToggleButton>
        </ButtonGroup>
      </div>
      {!data ? (
        <div>{isFetching ? t("Loading...") : t("No data to display.")}</div>
      ) : (
        <ReactFlowProvider>
          <ActivityMapCanvas data={data} coordMode={coordMode} dataSource={dataSource} />
        </ReactFlowProvider>
      )}
    </>
  );
};

export default ActivityMap;
