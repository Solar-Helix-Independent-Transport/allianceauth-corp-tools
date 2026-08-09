import { useTranslation } from "react-i18next";
import { getMailBody } from "../../api/character";
import { DateToFields, StrToFields } from "../Modals/ModalFields";
import { MailListItem } from "./MailTypes";
import { Badge, Button, Modal } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";

function MailModal({
  msg_data,
  shown,
  setShown,
}: {
  msg_data: MailListItem | null;
  shown: boolean;
  setShown: (show: boolean) => void;
}) {
  const { t } = useTranslation();

  const { isFetching, error, data } = useQuery({
    queryKey: ["mailBody", msg_data?.character_id, msg_data?.mail_id],
    queryFn: () => getMailBody(msg_data?.character_id ?? 0, msg_data?.mail_id ?? 0),
    refetchOnWindowFocus: false,
  });

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
          <StrToFields strValue={msg_data?.from} text={t("From:")} />
          <StrToFields text={t("Labels:")}>
            <span style={{ overflowWrap: "anywhere" }}>
              {msg_data?.labels.map((name) => <Badge style={{ marginLeft: "5px" }}>{name}</Badge>)}
            </span>
          </StrToFields>
          <StrToFields text={t("Recipients:")}>
            {(msg_data?.recipients.length ?? 0) > 2 && (
              <p>
                {msg_data?.recipients.length} {t("Recipients")}
              </p>
            )}

            <span style={{ overflowWrap: "anywhere" }}>
              {msg_data?.recipients.map((name) => (
                <Badge style={{ marginLeft: "5px" }}>{name}</Badge>
              ))}
            </span>
          </StrToFields>
          <DateToFields dateStrValue={msg_data?.timestamp} text={t("Timestamp:")} />
          <StrToFields strValue={msg_data?.subject} text={t("Subject:")} />
        </div>
        <hr />
        {error && <p>{t("Error from API")}</p>}
        {isFetching && <p>{t("Loading From API...")}</p>}
        {data && <p dangerouslySetInnerHTML={{ __html: `${data?.body}` }}></p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShown(false)}>{t("Close")}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MailModal;
