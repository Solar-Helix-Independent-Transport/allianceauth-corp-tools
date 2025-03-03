import { useTranslation } from "react-i18next";
import { CorporationLogo, TypeIcon } from "../EveImages/EveImages";
import { TimeTill } from "../Helpers/TimeTill";
import BaseTable from "../Tables/BaseTable/BaseTable";
import { NameObjectArrayFilterFn } from "../Tables/BaseTable/BaseTableFilter";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "react-bootstrap";
// import { FittingModal } from "../Modals/FittingModal";
// import { useState } from "react";

type Corporation = {
  corporation_id: number;
  corporation_name: string;
  alliance_name: string;
};

type BaseItemType = {
  id: number;
  name: string;
  cat?: string;
};

type StructureType = {
  id: number;
  owner: Corporation;
  type: BaseItemType;
  location: BaseItemType;
  constellation: BaseItemType;
  region: BaseItemType;
  name: string;
  state: string;
  fuel_expiry: string;
  services: BaseItemType[];
};

const StructuresTable = ({ data, isFetching }: { data: any; isFetching: boolean }) => {
  const { t } = useTranslation();
  // const [structure, setStructure] = useState({ id: 0, name: "" });

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
          href={`https://evemaps.dotlan.net/map/${cell.row.original.region.name.replace(
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
          href={`https://evemaps.dotlan.net/map/${cell.row.original.region.name.replace(" ", "_")}`}
        >
          {cell.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("name", {
      header: t("Structure"),
      // cell: (cell) => {
      //   return <p onClick={() => setStructure(cell.row.original)}>{cell.getValue()}</p>
      // }
    }),
    columnHelper.accessor("type.name", {
      header: t("Type"),
      cell: (cell) => (
        <>
          <TypeIcon type_id={cell.row.original.type.id} size={32}></TypeIcon>,
          <span className="ms-2">{cell.row.original.type.name}</span>
        </>
      ),
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
    columnHelper.accessor("fuel_expiry", {
      header: t("Fuel Expiry"),
      enableColumnFilter: false,
      cell: (props) => <TimeTill date={props.getValue()} />,
    }),
    columnHelper.accessor("state", {
      header: t("State"),
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
            {props.getValue().map((service: any) => {
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
  // console.log(structure);
  return (
    <>
      <BaseTable {...{ isFetching, columns, data }} />
      {/* {structure?.id !== 0 && <FittingModal ship={structure} />} */}
    </>
  );
};

export default StructuresTable;
