import { loadCorpStatus } from "../apis/Corporation";
import CorpActiveBadge from "./CorpActiveBadge";
import "./CorpHeader.css";
import { Bars } from "@agney/react-loading";
import React from "react";
import { Col } from "react-bootstrap";
import { Image } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import { useQuery } from "react-query";

const CorpHeader = ({ corporation_id }) => {
  const { isLoading, data } = useQuery(["status"], () => loadCorpStatus(corporation_id));

  return (
    <Panel>
      <Panel.Body>
        <Col xs={12} className="flex">
          {!isLoading ? (
            <>
              <div class="child">
                <Image
                  className="ra-avatar img-circle"
                  src={`https://images.evetech.net/corporations/${data.corporation.corporation_id}/logo?size=64`}
                ></Image>
              </div>
              <div class="child">
                <h1 style={{ margin: 0 }}>{data.corporation.corporation_name}</h1>
              </div>
              {data.corporation.alliance_id != null && (
                <>
                  <div class="child association-hide">
                    <Image
                      className="ra-avatar img-circle"
                      src={`https://images.evetech.net/alliances/${data.corporation.alliance_id}/logo?size=32`}
                    ></Image>
                  </div>
                  <div class="child association-hide">
                    <h4>{data.corporation.alliance_name}</h4>
                  </div>
                </>
              )}
              <div class="child-end">
                <CorpActiveBadge />
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

export default CorpHeader;
