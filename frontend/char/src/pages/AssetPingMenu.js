import React, { useState } from "react";
import { Checkbox, FormControl, Panel } from "react-bootstrap";
import ErrorBoundary from "../components/ErrorBoundary";
import { ApiMultiSelect } from "../components/ApiMultiSelect";
import {
  searchItemGroup,
  searchLocation,
  searchSystem,
} from "../apis/Character";
import { TestEmbed } from "../components/PingDemoDiv";
const PingAssets = () => {
  const [systems, setSystems] = useState([]);
  const [structures, setStructures] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  const [filterCharges, setCharges] = useState(false);
  const [filterShipsOnly, setShipsOnly] = useState(false);
  const [message, setMessage] = useState();
  return (
    <ErrorBoundary>
      <Panel.Body className="flex-container">
        <h5>Message</h5>
        <FormControl
          id="message-text"
          type="text"
          label="Text"
          onChange={(e) => setMessage(e.currentTarget.value)}
        />

        <h5>Systems Filter</h5>
        <ApiMultiSelect setValue={setSystems} apiLookup={searchSystem} />
        <h5>Stations Filter</h5>
        <ApiMultiSelect setValue={setStructures} apiLookup={searchLocation} />
        <h5>Ignored Items Filter</h5>
        <ApiMultiSelect setValue={setItemGroups} apiLookup={searchItemGroup} />
        <div className="flex=container">
          <Checkbox
            onChange={(e) => {
              setShipsOnly(e.target.checked);
            }}
          >
            Ships Only
          </Checkbox>
          <Checkbox
            onChange={(e) => {
              setCharges(e.target.checked);
            }}
          >
            Filter Charges
          </Checkbox>
        </div>
        <TestEmbed
          message={message}
          structures={structures}
          locations={systems}
          itemGroups={itemGroups}
          ships_only={filterShipsOnly}
          filter_charges={filterCharges}
        />
      </Panel.Body>
    </ErrorBoundary>
  );
};

export default PingAssets;
