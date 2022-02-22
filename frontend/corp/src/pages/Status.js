import React from "react";
import { Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import { useQuery } from "react-query";
import { loadStatus } from "../apis/Corporation";
import { PanelLoader } from "../components/PanelLoader";
import { ErrorLoader } from "../components/ErrorLoader";
import { CorporationLogo } from "../components/EveImages";

const CorpStatus = () => {
  const { isLoading, error, data } = useQuery(["corp-status"], () =>
    loadStatus()
  );

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <Panel.Body className="flex-container">
      {data.corps.map((corp) => {
        return (
          <Panel className={"flex-child"}>
            <Panel.Heading>
              <h4 className={"text-center"}>
                {corp.corporation.corporation_name}
              </h4>
            </Panel.Heading>
            <Panel.Body className="flex-body">
              <div className="text-center">
                <CorporationLogo
                  corporation_id={corp.corporation.corporation_id}
                  size={256}
                />
              </div>
              <h4 className={"text-center"}>Update Status</h4>
              <Table striped style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>Update</th>
                    <th className="text-right">Last Run</th>
                  </tr>
                </thead>
              </Table>
              <div className={"table-div"}>
                <Table striped>
                  <tbody>
                    {data.headers.map((h) => {
                      return (
                        <tr>
                          <td>{h}</td>
                          <td className="text-right">
                            {corp.last_updates[h] ? (
                              <ReactTimeAgo
                                date={Date.parse(corp.last_updates[h])}
                              />
                            ) : (
                              <>{"Never"}</>
                            )}
                          </td>
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
  );
};

export default CorpStatus;
