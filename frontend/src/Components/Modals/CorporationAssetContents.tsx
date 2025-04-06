import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { TypeIcon } from "../EveImages/EveImages";
import React from "react";
import { loadAssetContents } from "../../api/corporation";
import AssetContentsTable from "./AssetContentsTable";
// import { AssetFittingModal } from "./FittingModal";

function CorporationAssetModal({ item }: any) {
  // type is asset from api
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["assets-corp", item.id],
    queryFn: () => loadAssetContents(item.id ? Number(item.id) : 0),
    refetchOnWindowFocus: false,
    enabled: show,
  });
  return (
    <div className="text-center">
      <Button variant="secondary" size="sm" onClick={() => setShow(true)}>
        Show Contents
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Asset Contents")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center m-2">
            <TypeIcon type_id={item.item.id} size={128} forceType="icon" />
          </div>
          {item?.item?.name && <h3 className="text-center m-2">{item?.item?.name}</h3>}
          <AssetContentsTable data={data} header={t("Contents")} isFetching={isFetching} />
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100" onClick={() => setShow(false)}>
            {t("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* )} */}
    </div>
  );
}

export default CorporationAssetModal;
