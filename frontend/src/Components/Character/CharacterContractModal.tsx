import { DateToFields, StrIntToFields, StrToFields } from "../Modals/ModalFields";
import CharacterContractModalTable from "./CharacterContractModalTable";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function CharacterContractModal({ data, shown, setShown }: any) {
  const { t } = useTranslation();
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
          <StrToFields strValue={data?.availability} text={t("Availability")} />
          <StrToFields strValue={data?.status} text={t("Status")} />
          {data?.start_location ? (
            <StrToFields strValue={data?.start_location.name} text={t("Start Location")} />
          ) : (
            <StrIntToFields strValue={data?.start_location_id} text={t("Start Location")} />
          )}
          {data?.end_location ? (
            <StrToFields strValue={data?.end_location.name} text={t("End Location")} />
          ) : (
            <StrIntToFields strValue={data?.end_location_id} text={t("End Location")} />
          )}
          <DateToFields dateStrValue={data?.date_issued} text={t("Issued")} />
          <DateToFields dateStrValue={data?.date_accepted} text={t("Accepted")} />
          <DateToFields dateStrValue={data?.date_completed} text={t("Completed")} />
          <DateToFields dateStrValue={data?.date_expired} text={"Expiry"} />
          <StrIntToFields strValue={data?.price} text={t("Price")} valuePre={"$"} />
          <StrIntToFields strValue={data?.collateral} text={t("Collateral")} valuePre={"$"} />
          <StrIntToFields strValue={data?.reward} text={t("Reward")} valuePre={"$"} />
          <StrIntToFields strValue={data?.buyout} text={t("Buyout")} valuePre={"$"} />
          <StrIntToFields strValue={data?.volume} text={t("Volume")} valuePost={"m3"} />
          <StrIntToFields strValue={data?.days_to_complete} text={t("Days to Complete")} />
          <StrToFields strValue={data?.title} text={t("Description")} />
        </table>

        <CharacterContractModalTable
          data={data?.items?.filter((item: any) => item.is_included)}
          header={t("Items Received")}
        />
        <CharacterContractModalTable
          data={data?.items?.filter((item: any) => !item.is_included)}
          header={t("Items Wanted")}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="w-100" onClick={() => setShown(false)}>
          {t("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CharacterContractModal;
