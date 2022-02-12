import React from "react";
import { Col } from "react-bootstrap";
import { useQuery } from "react-query";
import { Image } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import CharActiveBadge from "./CharActiveBadge";
import { loadStatus } from "../apis/Character";
import { Bars } from "@agney/react-loading";

const CharHeader = ({ character_id }) => {
  const { isLoading, data } = useQuery(["status", character_id], () =>
    loadStatus(character_id)
  );

  return (
    <Panel>
      <Panel.Body>
        <Col xs={12} className="flex">
          <div class="child">
            <h1 style={{ margin: 0 }}>Account Audit</h1>
          </div>
          {!isLoading ? (
            <>
              <div class="child">
                <Image
                  className="ra-avatar img-circle"
                  src={`https://images.evetech.net/characters/${data.main.character_id}/portrait?size=64`}
                ></Image>
              </div>
              <div class="child">
                <h4>{data.main.character_name}</h4>
              </div>
              <div class="child association-hide">
                <Image
                  className="ra-avatar img-circle"
                  src={`https://images.evetech.net/corporations/${data.main.corporation_id}/logo?size=32`}
                ></Image>
              </div>
              <div class="child association-hide">
                <h4>{data.main.corporation_name}</h4>
              </div>
              {data.main.alliance_id != null && (
                <>
                  <div class="child association-hide">
                    <Image
                      className="ra-avatar img-circle"
                      src={`https://images.evetech.net/alliances/${data.main.alliance_id}/logo?size=32`}
                    ></Image>
                  </div>
                  <div class="child association-hide">
                    <h4>{data.main.alliance_name}</h4>
                  </div>
                  <div class="info-hide">
                    <Badge>
                      Total SP:{" "}
                      {data.characters
                        .reduce((p, c) => {
                          try {
                            return p + c.sp;
                          } catch (err) {
                            return p;
                          }
                        }, 0)
                        .toLocaleString()}
                    </Badge>
                    <br />
                    <Badge>
                      Total Isk:{" "}
                      {data.characters
                        .reduce((p, c) => {
                          try {
                            return p + c.isk;
                          } catch (err) {
                            return p;
                          }
                        }, 0)
                        .toLocaleString()}
                    </Badge>
                  </div>
                </>
              )}
              <div class="child-end">
                <CharActiveBadge
                  characters={data.characters}
                  character_id={character_id}
                />
              </div>
            </>
          ) : (
            <div class="child">
              <Bars className="spinner-size" />
            </div>
          )}
        </Col>
      </Panel.Body>
    </Panel>
  );
};

export default CharHeader;
