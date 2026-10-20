import { useTranslation } from "react-i18next";
import { CorporationLogo, TypeIcon } from "../EveImages/EveImages";
import { TimeTill } from "../Helpers/TimeTill";
import BaseTable from "../Tables/BaseTable/BaseTable";
import { NameObjectArrayFilterFn } from "../Tables/BaseTable/NameObjectArrayFilterFn";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FittingModal } from "../Modals/FittingModal";
import { useState } from "react";
import type { components } from "../../api/CtApi";

export type StructureType = components["schemas"]["Structure"];

const showTooltip = (toolTipText: string | undefined) => {
  return toolTipText ? (
    <Tooltip placement={"top"} id={toolTipText} style={{ position: "fixed" }}>
      {toolTipText}
    </Tooltip>
  ) : (
    <></>
  );
};

const StructuresTable = ({ data, isFetching }: { data: StructureType[]; isFetching: boolean }) => {
  const { t } = useTranslation();
  const [structure, setStructure] = useState({ id: 0, name: "" });
  const [showModal, setShowModal] = useState(false);

  const columnHelper = createColumnHelper<StructureType>();

  const columns = [
    columnHelper.accessor("location.name", {
      header: t("System"),
      cell: (cell) => (
        <a href={`https://evemaps.dotlan.net/system/${cell.getValue().replace(" ", "_")}`}>
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("constellation.name", {
      header: t("Constellation"),
      cell: (cell) => (
        <a
          href={`https://evemaps.dotlan.net/map/${(cell.row.original.region?.name ?? "").replace(
            " ",
            "_",
          )}/${cell.getValue().replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("region.name", {
      header: t("Region"),
      cell: (cell) => (
        <a
          href={`https://evemaps.dotlan.net/map/${(cell.row.original.region?.name ?? "").replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("name", {
      header: t("Structure"),
      cell: (cell) => {
        return (
          <div className="d-flex text-nowrap">
            <span className="me-auto align-self-center">{cell.getValue()}</span>
            <OverlayTrigger
              trigger={["hover"]}
              overlay={showTooltip(t("Open Structure Fitting. If Assets Token is loaded."))}
            >
              <Button
                size="sm"
                onClick={() => {
                  setStructure(cell.row.original);
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
    columnHelper.accessor("type.name", {
      header: t("Type"),
      cell: (cell) => (
        <div className="text-nowrap">
          <TypeIcon type_id={cell.row.original.type.id} size={32}></TypeIcon>
          <span className="mx-2 ">{cell.row.original.type.name}</span>
        </div>
      ),
    }),
    columnHelper.accessor("owner.corporation_name", {
      header: t("Owner"),
      cell: (cell) => (
        <div className="text-nowrap">
          <CorporationLogo
            corporation_id={cell.row.original.owner.corporation_id}
            size={32}
          ></CorporationLogo>
          <span className="ms-2">{cell.row.original.owner.corporation_name}</span>
        </div>
      ),
    }),
    columnHelper.accessor("fuel_expiry", {
      header: t("Fuel Expiry"),
      enableColumnFilter: false,
      // null for a structure with no fuel - TimeTill would show it as 1970
      cell: (props) => {
        const expiry = props.getValue();
        return expiry ? <TimeTill date={expiry} /> : null;
      },
    }),
    columnHelper.accessor("state", {
      header: t("State"),
      cell: (cell) => (
        <span style={{ textTransform: "capitalize" }}>
          {(cell.getValue() ?? "").replaceAll("_", " ")}
        </span>
      ),
    }),
    columnHelper.accessor("services", {
      header: t("Services"),
      filterFn: NameObjectArrayFilterFn,
      cell: (props) =>
        props.getValue() ? (
          <div
            className="text-center"
            style={{
              maxWidth: "500px",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              alignContent: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {props.getValue()?.map((service) => {
              return (
                <Badge bg={service.state === "online" ? "primary" : "danger"}>{service.name}</Badge>
              );
            })}
          </div>
        ) : (
          <></>
        ),
    }),
  ];
  return (
    <>
      <BaseTable {...{ isFetching, columns, data }} />
      {structure?.id !== 0 && <FittingModal ship={structure} {...{ showModal, setShowModal }} />}
    </>
  );
};

export default StructuresTable;
