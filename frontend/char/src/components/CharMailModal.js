import { DateToFields, StrToFields } from "./ModalFields";
import React from "react";
import { Button, Label, Modal } from "react-bootstrap";

function CharMailModal({ data, shown, setShown }) {
  return (
    <Modal
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
          <StrToFields strValue={data?.from} text={"From:"} />
          <StrToFields text={"Labels:"}>
            <p style={{ overflowWrap: "anywhere" }}>
              {data?.labels.map((name) => (
                <Label style={{ marginLeft: "5px" }}>{name}</Label>
              ))}
            </p>
          </StrToFields>
          <StrToFields text={"Recipients:"}>
            {data?.recipients.length > 2 && <p>{data?.recipients.length} Recipients</p>}

            <p style={{ overflowWrap: "anywhere" }}>
              {data?.recipients.map((name) => (
                <Label style={{ marginLeft: "5px" }}>{name}</Label>
              ))}
            </p>
          </StrToFields>
          <DateToFields dateStrValue={data?.timestamp} text={"Timestamp:"} />
          <StrToFields strValue={data?.subject} text={"Subject:"} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShown(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CharMailModal;
