import { useCallback } from "react";
import { parseAsFloat, useQueryState, useQueryStates } from "nuqs";
import { useTranslation } from "react-i18next";
import { ButtonGroup, Form, Spinner, ToggleButton } from "react-bootstrap";
import { ReactFlowProvider, type Viewport } from "@xyflow/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { MapCoordMode } from "../SpaceMap/types";
import { useFillHeight } from "../SpaceMap/useFillHeight";
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

  // Pan/zoom persisted to the URL, the same way `source`/`coords` already
  // are - so reloading the page (or sharing the link) lands back in the
  // same spot instead of re-fitting the whole map. Left un-set (null) until
  // the user actually pans/zooms once; only then do we have a viewport
  // worth restoring instead of just fighting the default auto-fit.
  const [viewportParams, setViewportParams] = useQueryStates({
    x: parseAsFloat,
    y: parseAsFloat,
    zoom: parseAsFloat,
  });
  const initialViewport: Viewport | undefined =
    viewportParams.x !== null && viewportParams.y !== null && viewportParams.zoom !== null
      ? { x: viewportParams.x, y: viewportParams.y, zoom: viewportParams.zoom }
      : undefined;
  const handleViewportChange = useCallback(
    (viewport: Viewport) => {
      setViewportParams({ x: viewport.x, y: viewport.y, zoom: viewport.zoom });
    },
    [setViewportParams],
  );

  // keepPreviousData stops `data` from going undefined while a new
  // data-source/id fetch is in flight - without it, the canvas (and the
  // ReactFlowProvider holding its live pan/zoom) would unmount on every
  // switch and remount from scratch once the new data lands, silently
  // resetting the viewport even though nothing asked for that.
  const { data, isFetching } = useQuery({
    queryKey: [queryKeyPrefix, id, dataSource.value],
    queryFn: () => dataSource.load(id),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const { ref: loadingRef, height: loadingHeight } = useFillHeight<HTMLDivElement>();

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
        isFetching ? (
          <div
            ref={loadingRef}
            style={{ height: loadingHeight }}
            className="d-flex align-items-center justify-content-center"
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">{t("Loading...")}</span>
            </Spinner>
          </div>
        ) : (
          <div>{t("No data to display.")}</div>
        )
      ) : (
        <div style={{ position: "relative" }}>
          <ReactFlowProvider>
            <ActivityMapCanvas
              id={id}
              data={data}
              coordMode={coordMode}
              dataSource={dataSource}
              initialViewport={initialViewport}
              onViewportChange={handleViewportChange}
            />
          </ReactFlowProvider>
          {/* Switching data source/scope keeps the previous map visible
              (see placeholderData above) rather than blanking it out - this
              overlay is just the "something new is on the way" indicator on
              top of it, not a replacement for the map itself. */}
          {isFetching && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "color-mix(in srgb, var(--bs-body-bg) 55%, transparent)",
              }}
            >
              <Spinner animation="border" role="status">
                <span className="visually-hidden">{t("Loading...")}</span>
              </Spinner>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ActivityMap;
