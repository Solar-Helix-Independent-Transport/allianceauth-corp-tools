import { loadStatus } from "../apis/Corporation";
import { ErrorLoader } from "../components/ErrorLoader";
import { CorporationLogo } from "../components/EveImages";
import { PanelLoader } from "../components/PanelLoader";
import React from "react";
import { Label, Table } from "react-bootstrap";
import { OverlayTrigger, Panel, Tooltip } from "react-bootstrap";
import { useQuery } from "react-query";
import ReactTimeAgo from "react-time-ago";

function MyTooltip({ message }) {
  return (
    <Tooltip wrap id="character_tooltip">
      {message}
    </Tooltip>
  );
}

const CorpStatus = () => {
  const { isLoading, error, data } = useQuery(["corp-status"], () => loadStatus());

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  return (
    <Panel.Body className="flex-container">
      {data.corps.map((corp) => {
        return (
          <Panel className={"flex-child"}>
            <Panel.Heading>
              <h4 className={"text-center"}>{corp.corporation.corporation_name}</h4>
            </Panel.Heading>
            <Panel.Body className="flex-body">
              <div className="text-center">
                <CorporationLogo corporation_id={corp.corporation.corporation_id} size={256} />
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
                          <td>
                            {h}{" "}
                            <OverlayTrigger
                              placement="top"
                              overlay={MyTooltip({
                                message: "Characters with Roles in Audit vs Tokens Available.",
                              })}
                            >
                              <Label className="pull-right" bsStyle="info" size={"small"}>
                                Chars/Tokens: {corp.last_updates[h].chars}/
                                {corp.last_updates[h].tokens}
                              </Label>
                            </OverlayTrigger>
                          </td>
                          <td className="text-right">
                            {corp.last_updates[h].update ? (
                              <ReactTimeAgo date={Date.parse(corp.last_updates[h].update)} />
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
