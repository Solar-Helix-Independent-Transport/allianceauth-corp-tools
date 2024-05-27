import { getMailBody } from "../apis/Character";
import { DateToFields, StrToFields } from "./ModalFields";
import React from "react";
import { Button, Label, Modal } from "react-bootstrap";
import { useQuery } from "react-query";

function CharMailModal({ msg_data, shown, setShown }) {
  const { isFetching, error, data } = useQuery(
    ["mailBody", msg_data?.character_id, msg_data?.mail_id],
    () => getMailBody(msg_data?.character_id, msg_data?.mail_id),
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Modal
      bsSize="large"
      show={shown}
      onHide={() => {
        setShown(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Mail Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <StrToFields strValue={msg_data?.from} text={"From:"} />
          <StrToFields text={"Labels:"}>
            <span style={{ overflowWrap: "anywhere" }}>
              {msg_data?.labels.map((name) => (
                <Label style={{ marginLeft: "5px" }}>{name}</Label>
              ))}
            </span>
          </StrToFields>
          <StrToFields text={"Recipients:"}>
            {msg_data?.recipients.length > 2 && <p>{msg_data?.recipients.length} Recipients</p>}

            <span style={{ overflowWrap: "anywhere" }}>
              {msg_data?.recipients.map((name) => (
                <Label style={{ marginLeft: "5px" }}>{name}</Label>
              ))}
            </span>
          </StrToFields>
          <DateToFields dateStrValue={msg_data?.timestamp} text={"Timestamp:"} />
          <StrToFields strValue={msg_data?.subject} text={"Subject:"} />
        </div>
        <hr />
        {error && <p>Error from API</p>}
        {isFetching && <p>Loading From API...</p>}
        {data && <p dangerouslySetInnerHTML={{ __html: `${data?.body}` }}></p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShown(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CharMailModal;
