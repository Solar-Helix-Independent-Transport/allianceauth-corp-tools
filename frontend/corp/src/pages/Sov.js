import React from "react";
import { Panel, Glyphicon, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadSov } from "../apis/Corporation";

export const Sov = () => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["sov"],
    () => loadSov(),
    { initialData: [] }
  );

  return (
    <Panel>
      <Panel.Heading>Sov Upgrades</Panel.Heading>
      <Panel.Body className="flex-container">
        {data.map((system) => {
          return (
            <Panel key={`panel ${system.system}`} className="flex-child">
              <Panel.Heading>
                <h4 className={"text-center"}>
                  {system.system}
                  {isFetching && (
                    <Glyphicon
                      className="glyphicon-refresh-animate pull-right"
                      glyph="refresh"
                    />
                  )}
                </h4>
              </Panel.Heading>
              <Panel.Body className="flex-body">
                <h4 className={"text-center"}>Upgrades</h4>
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
    </Panel>
  );
};
