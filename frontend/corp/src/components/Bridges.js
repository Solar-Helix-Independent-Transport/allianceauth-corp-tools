import React from "react";
import { Panel, Label } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadBridges } from "../apis/Corporation";
import { BridgeLink } from "./BridgeLink";

export const Bridges = () => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["bridges"],
    () => loadBridges(),
    { initialData: [] }
  );

  return (
    <Panel>
      <Panel.Heading>Jump Bridge Network</Panel.Heading>
      <Panel.Body className="flex-container">
        <div className="flex-container">
          <p
            bsSize="small"
            className="gate-active"
            style={{
              margin: "15px",
              borderBottom: "3px dotted",
            }}
          >
            Gate Online
          </p>
          <p
            bsSize="small"
            className="gate-inactive"
            style={{
              margin: "15px",
              borderBottom: "3px dotted",
            }}
          >
            Gate Offline
          </p>{" "}
          <p
            bsSize="small"
            className="gate-unknown"
            style={{
              margin: "15px",
              borderBottom: "3px dotted",
            }}
          >
            Gate Unknown
          </p>
          <Label
            bsStyle="info"
            bsSize="small"
            style={{
              margin: "15px",
            }}
          >
            Lo/Fuel Level Ok
          </Label>
          <Label
            bsStyle="danger"
            bsSize="small"
            style={{
              margin: "15px",
            }}
          >
            Lo/Fuel Level Low
          </Label>
        </div>

        <hr className="col-xs-12" />

        {data
          .sort((a, b) => {
            let levels_a = [];
            let levels_b = [];

            a.start.known && levels_a.push(a.start.ozone);
            a.end.known && levels_a.push(a.end.ozone);
            b.start.known && levels_b.push(b.start.ozone);
            b.end.known && levels_b.push(b.end.ozone);

            if (Math.min(...levels_a) > Math.min(...levels_b)) {
              return 1;
            } else if (Math.min(...levels_a) < Math.min(...levels_b)) {
              return -1;
            } else {
              return 0;
            }
          })
          .map((bridgePair) => {
            return <BridgeLink start={bridgePair.start} end={bridgePair.end} />;
          })}
      </Panel.Body>
    </Panel>
  );
};
