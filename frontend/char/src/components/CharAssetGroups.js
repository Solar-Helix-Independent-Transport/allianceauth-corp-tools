import React from "react";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";
import { Bars } from "@agney/react-loading";
import { loadAssetGroups } from "../apis/Character";
import { Table } from "react-bootstrap";

const CharAssetGroups = ({ character_id, location_id = 0 }) => {
  const { isLoading, error, data } = useQuery(
    ["assetGroups", character_id, location_id],
    () => loadAssetGroups(character_id, location_id)
  );
  console.log("ASSET GROUP");
  if (isLoading)
    return (
      <div className="flex-container">
        <Bars className="flex-child spinner-size" />
      </div>
    );

  if (error) return <div></div>;

  return (
    <div className="flex-container">
      {data.map((group) => {
        return (
          <Panel className="flex-child">
            <Panel.Heading>
              <h4 className={"text-center"}>{group.name}</h4>
            </Panel.Heading>
            <Panel.Body className="flex-body">
              <Table striped style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th className="text-right">Count</th>
                  </tr>
                </thead>
              </Table>
              <div className={"table-div"}>
                <Table striped>
                  <tbody>
                    {group.items.map((h) => {
                      return (
                        <tr>
                          <td>{h.label}</td>
                          <td class="text-right no-wrap">
                            {h.value.toLocaleString()}
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
    </div>
  );
};

export default CharAssetGroups;
