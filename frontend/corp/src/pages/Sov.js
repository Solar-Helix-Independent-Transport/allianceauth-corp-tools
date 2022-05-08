import React from "react";
import { Panel, Glyphicon, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadSov } from "../apis/Corporation";
import { ErrorLoader } from "../components/ErrorLoader";
import { DataMessage } from "../components/NoData";
import { PanelLoader } from "../components/PanelLoader";

export const Sov = () => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["sov"],
    () => loadSov(),
    { initialData: [] }
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return data.length > 0 ? (
    <>
      <Panel.Heading>Sov Upgrades</Panel.Heading>
      <Panel.Body className="flex-container">
        {data.map((system) => {
          return (
            <Panel key={`panel ${system.system.name}`} className="flex-child">
              <Panel.Heading>
                <h4 className={"text-center"}>
                  {system.system.name}
                  {isFetching && (
                    <Glyphicon
                      className="glyphicon-refresh-animate pull-right"
                      glyph="refresh"
                    />
                  )}
                </h4>
              </Panel.Heading>
              <Panel.Body className="flex-body">
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr key="head">
                      <th>Upgrade</th>
                      <th className="text-right">Active</th>
                    </tr>
                  </thead>
                </Table>
                <div className={"table-div"}>
                  <Table striped>
                    <tbody>
                      {system.upgrades.map((u) => {
                        let status = "info";
                        if (u.active === "StructureInactive") {
                          status = "warning";
                        } else if (u.active === "StructureOffline") {
                          status = "danger";
                        }
                        return (
                          <tr className={status} key={u.name}>
                            <td>{u.name}</td>
                            <td className="text-right">{u.active}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Panel.Body>
            </Panel>
          );
        })}
      </Panel.Body>
    </>
  ) : isFetching ? (
    <PanelLoader />
  ) : (
    <DataMessage text="No IHubs Found" />
  );
};
