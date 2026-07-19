import { useState } from "react";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { ReactFlowProvider } from "@xyflow/react";
import SovMapCanvas from "./SovMapCanvas";
import Legend from "./Legend";
import type { SovMapCoordMode, SovMapMode, SovMapResponse } from "./types";

const SovereigntyMap = ({
  data,
  isFetching,
  upgradesOnly = false,
}: {
  data: SovMapResponse | null;
  isFetching: boolean;
  // The public dashboard's payload has no workforce/transport data to show
  // at all, so flow mode has nothing to switch to - hide the toggle rather
  // than let anyone flip to a mode that's permanently empty.
  upgradesOnly?: boolean;
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useQueryState("mode", { defaultValue: "upgrades" });
  const activeMode: SovMapMode = upgradesOnly ? "upgrades" : mode === "flow" ? "flow" : "upgrades";
  const [upgradeSearch, setUpgradeSearch] = useState("");
  const [coords, setCoords] = useQueryState("coords", { defaultValue: "2d" });
  const coordMode: SovMapCoordMode = coords === "real" ? "real" : "2d";

  if (!data) {
    return <div>{isFetching ? t("Loading...") : t("No sovereignty hub regions to display.")}</div>;
  }

  if (data.systems.length === 0) {
    return <div>{t("No sovereignty hub regions to display.")}</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <Legend mode={activeMode} />
        <div className="d-flex align-items-center gap-2">
          {activeMode === "upgrades" && (
            <Form.Control
              type="search"
              size="sm"
              style={{ width: 200 }}
              placeholder={t("Search upgrades...")}
              value={upgradeSearch}
              onChange={(e) => setUpgradeSearch(e.target.value)}
            />
          )}
          <ButtonGroup>
            <ToggleButton
              id="sovmap-coords-2d"
              type="radio"
              size="sm"
              variant="outline-secondary"
              name="sovmap-coords"
              value="2d"
              checked={coordMode === "2d"}
              onChange={() => setCoords("2d")}
              title={t("Dotlan-style laid-out map")}
            >
              {t("Map Layout")}
            </ToggleButton>
            <ToggleButton
              id="sovmap-coords-real"
              type="radio"
              size="sm"
              variant="outline-secondary"
              name="sovmap-coords"
              value="real"
              checked={coordMode === "real"}
              onChange={() => setCoords("real")}
              title={t("Actual in-game universe coordinates")}
            >
              {t("Real Coords")}
            </ToggleButton>
          </ButtonGroup>
          {!upgradesOnly && (
            <ButtonGroup>
              <ToggleButton
                id="sovmap-mode-upgrades"
                type="radio"
                variant="outline-primary"
                name="sovmap-mode"
                value="upgrades"
                checked={activeMode === "upgrades"}
                onChange={() => setMode("upgrades")}
              >
                {t("Upgrades")}
              </ToggleButton>
              <ToggleButton
                id="sovmap-mode-flow"
                type="radio"
                variant="outline-primary"
                name="sovmap-mode"
                value="flow"
                checked={activeMode === "flow"}
                onChange={() => setMode("flow")}
              >
                {t("Workforce Flow")}
              </ToggleButton>
            </ButtonGroup>
          )}
        </div>
      </div>
      <ReactFlowProvider>
        <SovMapCanvas
          data={data}
          mode={activeMode}
          upgradeSearch={activeMode === "upgrades" ? upgradeSearch : ""}
          coordMode={coordMode}
        />
      </ReactFlowProvider>
    </>
  );
};

export default SovereigntyMap;
