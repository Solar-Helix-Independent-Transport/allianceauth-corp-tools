import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";

import { Image } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import axios from "axios";
import CharActiveBadge from "./CharActiveBadge";
import PanelHeading from "react-bootstrap/lib/PanelHeading";

const CharHeader = ({ char }) => {
  const [data, setState] = useState({
    characters: [],
    main: {
      character_id: 1,
      character_name: "",
      corporation_id: 0,
      corporation_name: "",
      alliance_id: null,
      alliance_name: null,
    },
  });

  useEffect(() => {
    axios.get(`/audit/api/characters/${char}/status`).then((res) => {
      const data = res.data;

      setState({ characters: data.characters, main: data.main });
    });
  }, []);

  return (
    <Panel>
      <Panel.Body>
        <Col xs={12} className="flex">
          <div class="child">
            <Image
              className="ra-avatar img-circle"
              src={`https://images.evetech.net/characters/${data.main.character_id}/portrait?size=64`}
            ></Image>
          </div>
          <div class="child">
            <h4>{data.main.character_name}</h4>
          </div>
          <div class="child">
            <Image
              className="ra-avatar img-circle"
              src={`https://images.evetech.net/corporations/${data.main.corporation_id}/logo?size=32`}
            ></Image>
          </div>
          <div class="child">
            <h4>{data.main.corporation_name}</h4>
          </div>
          {data.main.alliance_id != null && (
            <>
              <div class="child">
                <Image
                  className="ra-avatar img-circle"
                  src={`https://images.evetech.net/alliances/${data.main.alliance_id}/logo?size=32`}
                ></Image>
              </div>
              <div class="child">
                <h4>{data.main.alliance_name}</h4>
              </div>
              <div>
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
            <CharActiveBadge characters={data.characters} />
          </div>
        </Col>
      </Panel.Body>
    </Panel>
  );
};

export default CharHeader;
