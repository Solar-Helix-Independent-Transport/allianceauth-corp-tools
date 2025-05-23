import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { LoadAllStarbases } from "../../api/corporation";
import { CorporationLogo } from "../../Components/EveImages/EveImages";
import { TimeTill } from "../../Components/Helpers/TimeTill";
import { useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import StarbaseModal from "../../Components/Modals/StarbaseModal";
import BaseTable from "../../Components/Tables/BaseTable/BaseTable";

const showTooltip = (toolTipText: string | undefined) => {
  return toolTipText ? (
    <Tooltip placement={"top"} id={toolTipText} style={{ position: "fixed" }}>
      {toolTipText}
    </Tooltip>
  ) : (
    <></>
  );
};

const CorporationStarbases = () => {
  const { t } = useTranslation();
  const [starbase, setSarbase] = useState({} as any);
  const [showModal, setShowModal] = useState(true);

  const { data, isFetching } = useQuery({
    queryKey: ["starbases"],
    queryFn: () => LoadAllStarbases(),
    refetchOnWindowFocus: false,
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("region.name", {
      header: t("Region"),
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/map/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("constellation.name", {
      header: t("Constellation"),
      cell: (cell) => (
        <a
          href={`https://evemaps.dotlan.net/map/${cell.row.original.region?.name.replace(
            " ",
            "_",
          )}/${cell.getValue().replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("system.name", {
      header: t("System"),
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/map/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("moon.name", {
      header: t("Moon"),
      cell: (cell) => {
        return (
          <div className="d-flex text-nowrap">
            <span className="me-auto align-self-center">{cell.getValue()}</span>
            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={showTooltip(t("Open Starbase Fitting. If Assets Token is loaded."))}
            >
              <Button
                size="sm"
                onClick={() => {
                  setSarbase(cell.row.original);
                  setShowModal(true);
                }}
              >
                <i className="fa-solid fa-wrench"></i>
              </Button>
            </OverlayTrigger>
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: t("Name"),
    }),
    columnHelper.accessor("owner.corporation_name", {
      header: t("Owner"),
      cell: (cell) => (
        <>
          <CorporationLogo
            corporation_id={cell.row.original.owner.corporation_id}
            size={32}
          ></CorporationLogo>
          <span className="ms-2">{cell.row.original.owner.corporation_name}</span>
        </>
      ),
    }),
    columnHelper.accessor("state", {
      header: t("State"),
      cell: (cell) => {
        return (
          <div className="d-flex flex-column">
            <span>{cell.getValue()}</span>
            {cell.getValue() == "online" && (
              <>
                <TimeTill date={cell.row.original.onlined_since} />
              </>
            )}
          </div>
        );
      },
    }),
  ];
  return (
    <>
      <BaseTable {...{ isFetching, data, columns }} />
      {starbase.starbase_id && (
        <StarbaseModal starbase={starbase} {...{ showModal, setShowModal }} />
      )}
    </>
  );
};

export default CorporationStarbases;
