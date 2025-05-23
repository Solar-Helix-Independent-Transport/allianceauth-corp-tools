import { DateToFields, StrToFields } from "./ModalFields";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import StarbaseModalTable from "./StarbaseModalTable";
import { useQuery } from "react-query";
import { loadStarbaseFit } from "../../api/corporation";
import { TypeIcon } from "../EveImages/EveImages";
import styles from "../../Pages/Glance/AtAGlance.module.css";
import StarbaseModalFuelTable from "./StarbaseModalFuelTable";

function StarbaseModal({ starbase, showModal, setShowModal }: any) {
  const { t } = useTranslation();
  const { data, isFetching } = useQuery({
    queryKey: ["starbase", starbase.starbase_id],
    queryFn: () => loadStarbaseFit(starbase.starbase_id ? Number(starbase.starbase_id) : 0),
    refetchOnWindowFocus: false,
  });
  return (
    <Modal
      show={showModal}
      size="lg"
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("Starbase Detail")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center m-2">
          <TypeIcon type_id={starbase?.type?.id} size={256} />
        </div>
        {starbase?.name && <h3 className="text-center m-2">{starbase?.name}</h3>}
        <h6 className={styles.strikeOut}>{t("Detail")}</h6>
        <table className="table">
          <StrToFields strValue={starbase?.state} text={t("State")} />
          <DateToFields dateStrValue={starbase?.onlined_since} text={t("Online Since")} />
          <DateToFields dateStrValue={starbase?.reinforced_until} text={t("Reinforced Till")} />
          <DateToFields dateStrValue={starbase?.unanchor_at} text={t("Unanchoring AT")} />
          <StrToFields strValue={starbase?.moon?.name} text={t("Moon")} />
          <StrToFields strValue={starbase?.anchor} text={"Anchoring Permissions:"} />
          <StrToFields strValue={starbase?.online} text={"Onlining Permissions:"} />
          <StrToFields strValue={starbase?.offline} text={"Offlining Permissions:"} />
          <StrToFields strValue={starbase?.unanchor} text={"UnAnchoring Permissions:"} />
          <StrToFields strValue={starbase?.fuel_bay_take} text={"Fuel Take Permissions:"} />
          <StrToFields strValue={starbase?.fuel_bay_view} text={"Fuel View Permissions:"} />
        </table>

        <StarbaseModalFuelTable data={data?.fuel} isFetching={isFetching} header={t("Fuel Bays")} />
        <StarbaseModalTable data={data?.space} isFetching={isFetching} header={t("Fitting")} />
      </Modal.Body>
      <Modal.Footer>
        <Button className="w-100" onClick={() => setShowModal(false)}>
          {t("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StarbaseModal;
