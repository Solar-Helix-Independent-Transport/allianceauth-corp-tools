import { useTranslation } from "react-i18next";
import { getMailBody } from "../../api/character";
import { DateToFields, StrToFields } from "../Modals/ModalFields";
import { Badge, Button, Modal } from "react-bootstrap";
import { useQuery } from "react-query";

function MailModal({ msg_data, shown, setShown }: any) {
  const { t } = useTranslation();

  const { isFetching, error, data } = useQuery(
    ["mailBody", msg_data?.character_id, msg_data?.mail_id],
    () => getMailBody(msg_data?.character_id, msg_data?.mail_id),
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <Modal
      size="lg"
      show={shown}
      onHide={() => {
        setShown(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("Mail Detail")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <StrToFields strValue={msg_data?.from} text={"From:"} />
          <StrToFields text={"Labels:"}>
            <span style={{ overflowWrap: "anywhere" }}>
              {msg_data?.labels.map((name: any) => (
                <Badge style={{ marginLeft: "5px" }}>{name}</Badge>
              ))}
            </span>
          </StrToFields>
          <StrToFields text={"Recipients:"}>
            {msg_data?.recipients.length > 2 && (
              <p>
                {msg_data?.recipients.length} {t("Recipients")}
              </p>
            )}

            <span style={{ overflowWrap: "anywhere" }}>
              {msg_data?.recipients.map((name: any) => (
                <Badge style={{ marginLeft: "5px" }}>{name}</Badge>
              ))}
            </span>
          </StrToFields>
          <DateToFields dateStrValue={msg_data?.timestamp} text={"Timestamp:"} />
          <StrToFields strValue={msg_data?.subject} text={"Subject:"} />
        </div>
        <hr />
        {error && <p>{t("Error from API")}</p>}
        {isFetching && <p>Loading From API...</p>}
        {data && <p dangerouslySetInnerHTML={{ __html: `${data?.body}` }}></p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShown(false)}>{t("Close")}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MailModal;
