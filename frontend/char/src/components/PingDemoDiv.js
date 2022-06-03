import React, { useState } from "react";
import { ButtonGroup, Panel } from "react-bootstrap";
import { postTestPing, postSendPing } from "../apis/Character";
import { useQuery } from "react-query";
import { Button } from "react-bootstrap";
import AwesomeDebouncePromise from "awesome-debounce-promise";
const debounceSend = AwesomeDebouncePromise(postSendPing, 1000);

export const TestEmbed = ({
  message,
  structures,
  locations,
  itemGroups,
  filter_charges,
  ships_only,
}) => {
  const [interlock, setInterlock] = useState(false);
  const { isLoading, isFetching, error, data } = useQuery(
    ["pingTest", structures, locations, itemGroups, filter_charges, ships_only],
    () =>
      postTestPing(
        message,
        structures,
        locations,
        itemGroups,
        filter_charges,
        ships_only
      ),
    {
      initialData: {
        members: 0,
        structures: [],
      },
    }
  );
  if (isFetching && interlock) {
    setInterlock(false);
  }
  return (
    <Panel style={{ margin: "15px", width: "400px" }}>
      <Panel.Heading>
        Example Asset Alert ({data.members} Characters!)
      </Panel.Heading>
      <Panel.Body>
        <p>{message}</p>
        <h4>Characters</h4>
        <p>
          Master Chief, Obi-wan, Grogu, Katheryn Janeway, Postman Pat, Wally,
          Bill, Ted, ArielKable
        </p>
        <h4>Structures</h4>
        <p>{data.structures.join(", ")}</p>
        <h4>Items</h4>
        <p>
          Molok, Molok, Avatar, Avatar, Revelation, Revelation, Revelation, Apoc
          Navy Issue, Omen, Prophecy
        </p>
      </Panel.Body>
      <Panel.Footer className="text-center">
        <ButtonGroup>
          <Button
            disabled={interlock & message}
            bsStyle="danger"
            onClick={(e) => {
              setInterlock(!interlock);
            }}
          >
            {!interlock ? `Confirm ${data.members} Pings!` : `Ready`}
          </Button>
          <Button
            disabled={!interlock | !message}
            bsStyle="success"
            onClick={(e) => {
              debounceSend(
                message,
                structures,
                locations,
                itemGroups,
                filter_charges,
                ships_only
              );
              setInterlock(!interlock);
            }}
          >
            {interlock ? `SEND ${data.members} Pings!` : `Send Locked`}
          </Button>
        </ButtonGroup>
      </Panel.Footer>
    </Panel>
  );
};
