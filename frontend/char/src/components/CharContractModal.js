import CharContractModalTable from "./CharContractModalTable";
import React from "react";
import { Button, Modal } from "react-bootstrap";

function StrToFields({ strValue, text, valuePre = "", valuePost = "" }) {
  //console.log("StrToFields", strValue, text);
  return strValue ? (
    <div className="row">
      <div className="col-xs-4">
        <p className="text-right">{text}</p>
      </div>
      <div className="col">
        <p>
          {valuePre} {strValue} {valuePost}
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}

function DateToFields({ dateStrValue, text, valuePre = "", valuePost = "" }) {
  //console.log("IntToFields", intValue, text);
  return dateStrValue ? (
    <StrToFields
      strValue={new Date(dateStrValue).toLocaleString()}
      text={text}
      valuePre={valuePre}
      valuePost={valuePost}
    />
  ) : (
    <></>
  );
}

function IntToFields({ intValue, text, valuePre = "", valuePost = "" }) {
  //console.log("IntToFields", intValue, text);
  return intValue !== 0 ? (
    <StrToFields
      strValue={intValue.toLocaleString()}
      text={text}
      valuePre={valuePre}
      valuePost={valuePost}
    />
  ) : (
    <></>
  );
}

function StrIntToFields({ strValue, text, valuePre = "", valuePost = "" }) {
  //console.log("StrIntToFields", strValue, text);
  let intValue = parseInt(strValue);
  return strValue ? (
    <IntToFields intValue={intValue} text={text} valuePre={valuePre} valuePost={valuePost} />
  ) : (
    <></>
  );
}

function CharContractModal({ data, shown, setShown }) {
  return (
    <Modal
      show={shown}
      onHide={() => {
        setShown(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Contract Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <StrToFields strValue={data?.issuer} text={"From:"} />
          <StrToFields strValue={data?.assignee} text={"To:"} />
          <StrToFields
            strValue={data?.acceptor === data?.assignee ? null : data?.acceptor}
            text={"Acceptor:"}
          />
          <StrToFields strValue={data?.availability} text={"Availability:"} />
          <StrToFields strValue={data?.status} text={"Status:"} />
          <DateToFields dateStrValue={data?.date_issued} text={"Issued:"} />
          <DateToFields dateStrValue={data?.date_accepted} text={"Accepted:"} />
          <DateToFields dateStrValue={data?.date_completed} text={"Completed:"} />
          <DateToFields dateStrValue={data?.date_expired} text={"Expiry:"} />
          <StrIntToFields strValue={data?.price} text={"Price:"} valuePre={"$"} />
          <StrIntToFields strValue={data?.collateral} text={"Collateral:"} valuePre={"$"} />
          <StrIntToFields strValue={data?.reward} text={"Reward:"} valuePre={"$"} />
          <StrIntToFields strValue={data?.buyout} text={"Buyout:"} valuePre={"$"} />
          <StrIntToFields strValue={data?.volume} text={"Volume:"} valuePost={"m3"} />
          <StrIntToFields strValue={data?.days_to_complete} text={"Days to Complete:"} />
          <StrToFields strValue={data?.title} text={"Description:"} />
        </div>

        <CharContractModalTable
          data={data?.items?.filter((item) => item.is_included)}
          header={"Items Received"}
        />
        <CharContractModalTable
          data={data?.items?.filter((item) => !item.is_included)}
          header={"Items Wanted"}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShown(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CharContractModal;
