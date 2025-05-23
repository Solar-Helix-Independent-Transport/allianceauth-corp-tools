import { TypeIcon } from "../../Components/EveImages/EveImages";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterClones } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, Modal, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

const CharacterClones = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const [openModal, setOpenModal] = React.useState(false);
  const [modalData, setModalData] = React.useState(null as any);

  const { data, isFetching } = useQuery({
    queryKey: ["clones", characterID],
    queryFn: () => getCharacterClones(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterClones"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: t("Character"),
    }),
    columnHelper.accessor("home.name", {
      header: t("Home"),
    }),
    columnHelper.accessor("last_clone_jump", {
      header: t("Last Jump"),
    }),
    columnHelper.accessor("last_station_change", {
      header: t("Last Station Change"),
    }),
    columnHelper.accessor("clones", {
      header: t("Clones"),
      cell: (props) => {
        const data = props.getValue();
        return (
          <>
            <Table>
              <thead>
                <tr>
                  <th>{t("Location")}</th>
                  <th className="text-end pe-2">{t("Implants")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((d: components["schemas"]["CharacterClone"]) => {
                  return (
                    <>
                      <tr className="align-items-center">
                        <td colSpan={2} style={{ verticalAlign: "middle" }} className="border-0">
                          {d.name} {d.location?.name}
                        </td>
                      </tr>
                      <tr className="align-items-center">
                        <td colSpan={2} style={{ verticalAlign: "middle" }}>
                          <div className="d-flex justify-content-end align-items-center">
                            {d.implants?.length ? (
                              d.implants.map((imp) => {
                                return (
                                  <TypeIcon textContent={imp.name} type_id={imp.id} size={32} />
                                );
                              })
                            ) : (
                              <>
                                {t("No Implants")}
                                <i className="ms-2 fa-regular fa-circle-xmark pe-2"></i>
                              </>
                            )}
                            {d.implants?.length ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setModalData(d);
                                  setOpenModal(true);
                                }}
                              >
                                <i className="fa-solid fa-info"></i>
                              </Button>
                            ) : (
                              <></>
                            )}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
          </>
        );
      },
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
      {modalData?.implants && (
        <Modal
          size="lg"
          show={openModal}
          onHide={() => {
            setOpenModal(false);
          }}
        >
          <Modal.Header closeButton>{t(`Implant Details`)}</Modal.Header>
          <Modal.Body>
            <div>
              <Table striped style={{ marginBottom: 0 }}>
                <tbody>
                  {modalData?.implants.map((imp: any) => {
                    return (
                      <tr key={imp.name}>
                        <td className="text-end">
                          <TypeIcon textContent={imp.name} type_id={imp.id} size={32} />
                        </td>
                        <td className="text-start">{imp.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              {t("Close")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CharacterClones;
