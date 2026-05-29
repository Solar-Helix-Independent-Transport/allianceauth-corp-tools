import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CorporationLogo, TypeIcon } from "../EveImages/EveImages";
import BaseTable from "../Tables/BaseTable/BaseTable";
import { NameObjectArrayFilterFn } from "../Tables/BaseTable/BaseTableFilter";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Form, OverlayTrigger, Tooltip } from "react-bootstrap";

type Corporation = {
  corporation_id: number;
  corporation_name: string;
};

type EveName = {
  id: number;
  name: string;
};

type Reagent = {
  name: string;
  type_id: number | null;
  amount: number;
  burning_per_hour: number;
};

type Upgrade = {
  name: string;
  type_id: number | null;
  power_state: string;
};

type TransportSystem = {
  system_id: number;
  system_name: string;
  amount?: number | null;
};

type WorkforceTransport = {
  mode: "import" | "export" | "transit" | null;
  config_sources: TransportSystem[];
  state_sources: TransportSystem[];
  config_destination: TransportSystem | null;
  state_destination: TransportSystem | null;
} | null;

type SovHub = {
  hub_id: number;
  owner: Corporation;
  location: EveName;
  constellation: EveName;
  region: EveName;
  power_allocated: number | null;
  power_available: number | null;
  workforce_allocated: number | null;
  workforce_available: number | null;
  reagent_last_updated: string | null;
  reagents: Reagent[];
  upgrades: Upgrade[];
  workforce_transport: WorkforceTransport;
};

const formatHours = (hours: number) => {
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  if (d === 0) return `${h}h`;
  if (h === 0) return `${d}d`;
  return `${d}d ${h}h`;
};

const transportMismatch = (wt: WorkforceTransport): boolean => {
  if (!wt || !wt.mode) return false;
  if (wt.mode === "import") {
    const cfgIds = new Set(wt.config_sources.map((s) => s.system_id));
    const stateIds = new Set(wt.state_sources.map((s) => s.system_id));
    if (cfgIds.size !== stateIds.size) return true;
    for (const id of cfgIds) if (!stateIds.has(id)) return true;
    return false;
  }
  if (wt.mode === "export") {
    const cfgId = wt.config_destination?.system_id ?? null;
    const stateId = wt.state_destination?.system_id ?? null;
    return cfgId !== stateId;
  }
  return false;
};

const upgradeStateBg = (state: string) => {
  switch (state.toLowerCase()) {
    case "online":
      return "success";
    case "offline":
      return "warning";
    case "low":
      return "danger";
    case "pending":
      return "info";
    default:
      return "secondary";
  }
};

const SovereigntyHubsTable = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  const { t } = useTranslation();
  const [hideAllOnline, setHideAllOnline] = useState(false);
  const [hideNoFuel, setHideNoFuel] = useState(false);
  const [showTransportMismatch, setShowTransportMismatch] = useState(false);

  const filteredData = data
    .filter(
      (h: SovHub) =>
        !hideAllOnline || h.upgrades.some((u) => u.power_state.toLowerCase() !== "online"),
    )
    .filter((h: SovHub) => !hideNoFuel || h.reagents.some((r) => r.burning_per_hour > 0))
    .filter((h: SovHub) => !showTransportMismatch || transportMismatch(h.workforce_transport));

  const columnHelper = createColumnHelper<SovHub>();

  const columns = [
    columnHelper.accessor("location.name", {
      header: t("System"),
      filterFn: "includesString",
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/system/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("constellation.name", {
      header: t("Constellation"),
      filterFn: "includesString",
      cell: (cell) => (
        <a
          href={`https://evemaps.dotlan.net/map/${cell.row.original.region.name.replace(" ", "_")}/${cell.getValue().replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("region.name", {
      header: t("Region"),
      filterFn: "includesString",
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/map/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("owner.corporation_name", {
      header: t("Owner"),
      cell: (cell) => (
        <div className="text-nowrap">
          <CorporationLogo corporation_id={cell.row.original.owner.corporation_id} size={32} />
          <span className="ms-2">{cell.row.original.owner.corporation_name}</span>
        </div>
      ),
    }),
    columnHelper.accessor(
      (row) =>
        row.power_available && row.power_available > 0
          ? Math.round((row.power_allocated! / row.power_available) * 100)
          : null,
      {
        id: "power",
        header: t("Power"),
        enableColumnFilter: false,
        cell: (cell) => {
          const pct = cell.getValue();
          const { power_allocated, power_available } = cell.row.original;
          if (pct == null || power_allocated == null || power_available == null) return <></>;
          return (
            <div className="text-nowrap">
              {pct}%
              <br />
              <span className="text-muted small">
                {power_allocated} / {power_available}
              </span>
            </div>
          );
        },
      },
    ),
    columnHelper.accessor(
      (row) =>
        row.workforce_available && row.workforce_available > 0
          ? Math.round((row.workforce_allocated! / row.workforce_available) * 100)
          : null,
      {
        id: "workforce",
        header: t("Workforce"),
        enableColumnFilter: false,
        cell: (cell) => {
          const pct = cell.getValue();
          const { workforce_allocated, workforce_available } = cell.row.original;
          if (pct == null || workforce_allocated == null || workforce_available == null)
            return <></>;
          return (
            <div className="text-nowrap">
              {pct}%
              <br />
              <span className="text-muted small">
                {workforce_allocated} / {workforce_available}
              </span>
            </div>
          );
        },
      },
    ),
    columnHelper.accessor((row) => row.workforce_transport?.mode ?? null, {
      id: "workforce_transport",
      header: t("Workforce Transport"),
      enableColumnFilter: false,
      cell: (cell) => {
        const wt = cell.row.original.workforce_transport;
        if (!wt || !wt.mode) return <></>;

        const modeBg: Record<string, string> = {
          import: "info",
          export: "primary",
          transit: "secondary",
        };

        if (wt.mode === "import") {
          return (
            <div>
              <Badge bg={modeBg.import} className="me-1">
                {t("Import")}
              </Badge>
              {wt.config_sources.length > 0 && (
                <div className="text-nowrap">
                  <span className="text-muted small me-1">{t("Requested")}:</span>
                  {wt.config_sources.map((s, i) => (
                    <span key={i} className="me-1">
                      {s.system_name}
                    </span>
                  ))}
                </div>
              )}
              {wt.state_sources.length > 0 && (
                <div className="text-nowrap">
                  <span className="text-muted small me-1">{t("Active")}:</span>
                  {wt.state_sources.map((s, i) => (
                    <span key={i} className="me-1">
                      {s.system_name}
                      {s.amount != null && (
                        <span className="text-muted small ms-1">({s.amount.toLocaleString()})</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (wt.mode === "export") {
          return (
            <div>
              <Badge bg={modeBg.export} className="me-1">
                {t("Export")}
              </Badge>
              {wt.config_destination && (
                <div className="text-nowrap">
                  <span className="text-muted small me-1">{t("Requested")}:</span>
                  {wt.config_destination.system_name}
                  {wt.config_destination.amount != null && (
                    <span className="text-muted small ms-1">
                      ({wt.config_destination.amount.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
              {wt.state_destination && (
                <div className="text-nowrap">
                  <span className="text-muted small me-1">{t("Active")}:</span>
                  {wt.state_destination.system_name}
                  {wt.state_destination.amount != null && (
                    <span className="text-muted small ms-1">
                      ({wt.state_destination.amount.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }

        return <Badge bg={modeBg.transit}>{t("Transit")}</Badge>;
      },
    }),
    columnHelper.accessor("upgrades", {
      header: t("Upgrades"),
      filterFn: NameObjectArrayFilterFn,
      cell: (props) => (
        <div
          style={{
            maxWidth: "400px",
            display: "flex",
            flexWrap: "wrap",
            gap: "2px",
          }}
        >
          {props.getValue().map((u, i) => (
            <OverlayTrigger
              key={i}
              trigger={["hover"]}
              placement="top"
              overlay={
                <Tooltip
                  id={`upgrade-${props.row.original.hub_id}-${i}`}
                  style={{ position: "fixed" }}
                >
                  {u.power_state}
                </Tooltip>
              }
            >
              <Badge bg={upgradeStateBg(u.power_state)}>{u.name}</Badge>
            </OverlayTrigger>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor(
      (row) => {
        const hours = row.reagents
          .filter((r) => r.burning_per_hour > 0)
          .map((r) => Math.floor(r.amount / r.burning_per_hour));
        return hours.length > 0 ? Math.min(...hours) : null;
      },
      {
        id: "reagents",
        header: t("Reagents"),
        filterFn: NameObjectArrayFilterFn,
        cell: (props) => (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px",
            }}
          >
            {props.row.original.reagents.map((r, i) => {
              const hoursLeft =
                r.burning_per_hour > 0 ? Math.floor(r.amount / r.burning_per_hour) : null;
              return (
                <OverlayTrigger
                  key={i}
                  trigger={["hover"]}
                  placement="top"
                  overlay={
                    <Tooltip
                      id={`reagent-${props.row.original.hub_id}-${i}`}
                      style={{ position: "fixed" }}
                    >
                      <div className="text-start">
                        <div>{r.amount.toLocaleString()} remaining</div>
                        <div>{r.burning_per_hour.toLocaleString()} / hr</div>
                        {hoursLeft != null && <div>{formatHours(hoursLeft)} left</div>}
                      </div>
                    </Tooltip>
                  }
                >
                  <span className="d-flex align-items-center text-nowrap me-2">
                    {r.type_id && <TypeIcon type_id={r.type_id} size={32} />}
                    <span className="ms-1">
                      {r.name}
                      {hoursLeft != null && (
                        <span className="text-muted small ms-1">({formatHours(hoursLeft)})</span>
                      )}
                    </span>
                  </span>
                </OverlayTrigger>
              );
            })}
          </div>
        ),
      },
    ),
  ];

  return (
    <>
      <div className="d-flex justify-content-end gap-3 mb-2">
        <Form.Check
          type="switch"
          id="transport-mismatch"
          label={t("Transport mismatch only")}
          checked={showTransportMismatch}
          onChange={(e) => setShowTransportMismatch(e.target.checked)}
        />
        <Form.Check
          type="switch"
          id="hide-no-fuel"
          label={t("Hide no fuel use")}
          checked={hideNoFuel}
          onChange={(e) => setHideNoFuel(e.target.checked)}
        />
        <Form.Check
          type="switch"
          id="hide-all-online"
          label={t("Hide fully online")}
          checked={hideAllOnline}
          onChange={(e) => setHideAllOnline(e.target.checked)}
        />
      </div>
      <BaseTable {...{ isFetching, columns, data: filteredData }} />
    </>
  );
};

export default SovereigntyHubsTable;
