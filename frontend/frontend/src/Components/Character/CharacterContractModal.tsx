import { DateToFields, StrIntToFields, StrToFields } from "../Modals/ModalFields";
import CharacterContractModalTable from "./CharacterContractModalTable";
import { Button, Modal } from "react-bootstrap";

function CharacterContractModal({ data, shown, setShown }: any) {
  return (
    <Modal
      show={shown}
      size="lg"
      onHide={() => {
        setShown(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Contract Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table">
          <StrToFields strValue={data?.issuer} text={"From:"} />
          <StrToFields strValue={data?.assignee} text={"To:"} />
          <StrToFields
            strValue={data?.acceptor === data?.assignee ? null : data?.acceptor}
            text={"Acceptor:"}
          />
          <StrToFields strValue={data?.availability} text={"Availability:"} />
          <StrToFields strValue={data?.status} text={"Status:"} />
          <StrIntToFields strValue={data?.start_location_id} text={"Start Location:"} />
          <StrIntToFields strValue={data?.end_location_id} text={"End Location:"} />
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
        </table>

        <CharacterContractModalTable
          data={data?.items?.filter((item: any) => item.is_included)}
          header={"Items Received"}
        />
        <CharacterContractModalTable
          data={data?.items?.filter((item: any) => !item.is_included)}
          header={"Items Wanted"}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="w-100" onClick={() => setShown(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CharacterContractModal;
