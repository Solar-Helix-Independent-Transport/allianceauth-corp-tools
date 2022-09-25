import { postSendPing, postTestPing } from "../apis/Character";
import { ErrorLoader } from "./ErrorLoader";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import React, { useState } from "react";
import { ButtonGroup, Panel } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useQuery } from "react-query";

const debounceSend = AwesomeDebouncePromise(postSendPing, 1000);

export const TestEmbed = ({
  message,
  structures,
  locations,
  itemGroups,
  filter_charges,
  ships_only,
  caps_only,
}) => {
  const [interlock, setInterlock] = useState(false);
  const { isFetching, error, data } = useQuery(
    ["pingTest", structures, locations, itemGroups, filter_charges, ships_only, caps_only],
    () =>
      postTestPing(
        message,
        structures,
        locations,
        itemGroups,
        filter_charges,
        ships_only,
        caps_only
      ),
    {
      initialData: {
        members: 0,
        structures: [],
      },
      refetchOnWindowFocus: false,
    }
  );
  if (isFetching && interlock) {
    setInterlock(false);
  }
  if (error) {
    return <ErrorLoader />;
  }
  return (
    <Panel style={{ margin: "15px", width: "400px" }}>
      <Panel.Heading>Example Asset Alert ({data.members} Characters!)</Panel.Heading>
      <Panel.Body>
        <p>
          {message ? (
            <>
              {message.split("\\n").map((s) => (
                <>
                  {s}
                  <br />
                </>
              ))}
            </>
          ) : (
            ""
          )}
        </p>
        <h4>Characters</h4>
        <p>
          Master Chief, Obi-wan, Grogu, Katheryn Janeway, Postman Pat, Wally, Bill, Ted, ArielKable
        </p>
        <h4>Structures</h4>
        <p>{data.structures.join(", ")}</p>
        <h4>Items</h4>
        <p>
          Molok, Molok, Avatar, Avatar, Revelation, Revelation, Revelation, Apoc Navy Issue, Omen,
          Prophecy
        </p>
      </Panel.Body>
      <Panel.Footer className="text-center">
        <ButtonGroup>
          <Button
            disabled={interlock && message}
            bsStyle="danger"
            onClick={(e) => {
              setInterlock(!interlock);
            }}
          >
            {!interlock ? `Confirm ${data.members} Pings!` : `Ready`}
          </Button>
          <Button
            disabled={!interlock || !message}
            bsStyle="success"
            onClick={(e) => {
              debounceSend(
                message,
                structures,
                locations,
                itemGroups,
                filter_charges,
                ships_only,
                caps_only
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
