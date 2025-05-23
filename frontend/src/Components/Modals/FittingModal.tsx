import ring from "../../assets/fittings/tyrannis.png";
import h1 from "../../assets/fittings/1h.png";
import h2 from "../../assets/fittings/2h.png";
import h3 from "../../assets/fittings/3h.png";
import h4 from "../../assets/fittings/4h.png";
import h5 from "../../assets/fittings/5h.png";
import h6 from "../../assets/fittings/6h.png";
import h7 from "../../assets/fittings/7h.png";
import h8 from "../../assets/fittings/8h.png";
import m1 from "../../assets/fittings/1m.png";
import m2 from "../../assets/fittings/2m.png";
import m3 from "../../assets/fittings/3m.png";
import m4 from "../../assets/fittings/4m.png";
import m5 from "../../assets/fittings/5m.png";
import m6 from "../../assets/fittings/6m.png";
import m7 from "../../assets/fittings/7m.png";
import m8 from "../../assets/fittings/8m.png";
import l8 from "../../assets/fittings/8l.png";
import l7 from "../../assets/fittings/7l.png";
import l6 from "../../assets/fittings/6l.png";
import l5 from "../../assets/fittings/5l.png";
import l4 from "../../assets/fittings/4l.png";
import l3 from "../../assets/fittings/3l.png";
import l2 from "../../assets/fittings/2l.png";
import l1 from "../../assets/fittings/1l.png";
import r1 from "../../assets/fittings/1r.png";
import r2 from "../../assets/fittings/2r.png";
import r3 from "../../assets/fittings/3r.png";
import s1 from "../../assets/fittings/1s.png";
import s2 from "../../assets/fittings/2s.png";
import s3 from "../../assets/fittings/3s.png";
import s4 from "../../assets/fittings/4s.png";
import s5 from "../../assets/fittings/5s.png";
import { Card, Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadStructureFit } from "../../api/corporation";
import { PanelLoader } from "../Loaders/loaders";
import { useTranslation } from "react-i18next";

const type_url = (typeID: number, size = 32) => {
  return `https://images.evetech.net/types/${typeID}/${
    size >= 256 ? "render" : `icon?size=${size}`
  }`;
};

const HighSlotLayout = ({ slots }: { slots: number }) => {
  let _slots: string | boolean = false;
  switch (slots) {
    case 1:
      _slots = h1;
      break;
    case 2:
      _slots = h2;
      break;
    case 3:
      _slots = h3;
      break;
    case 4:
      _slots = h4;
      break;
    case 5:
      _slots = h5;
      break;
    case 6:
      _slots = h6;
      break;
    case 7:
      _slots = h7;
      break;
    case 8:
      _slots = h8;
      break;
    default:
      _slots = false;
  }
  return _slots ? <img className="rounded" src={_slots} style={{ border: 0 }} /> : <></>;
};

const MedSlotLayout = ({ slots }: { slots: number }) => {
  let _slots: string | boolean = false;
  switch (slots) {
    case 1:
      _slots = m1;
      break;
    case 2:
      _slots = m2;
      break;
    case 3:
      _slots = m3;
      break;
    case 4:
      _slots = m4;
      break;
    case 5:
      _slots = m5;
      break;
    case 6:
      _slots = m6;
      break;
    case 7:
      _slots = m7;
      break;
    case 8:
      _slots = m8;
      break;
    default:
      _slots = false;
  }
  return _slots ? <img className="rounded" src={_slots} style={{ border: 0 }} /> : <></>;
};

const LoSlotLayout = ({ slots }: { slots: number }) => {
  let _slots: string | boolean = false;
  switch (slots) {
    case 1:
      _slots = l1;
      break;
    case 2:
      _slots = l2;
      break;
    case 3:
      _slots = l3;
      break;
    case 4:
      _slots = l4;
      break;
    case 5:
      _slots = l5;
      break;
    case 6:
      _slots = l6;
      break;
    case 7:
      _slots = l7;
      break;
    case 8:
      _slots = l8;
      break;
    default:
      _slots = false;
  }
  return _slots ? <img className="rounded" src={_slots} style={{ border: 0 }} /> : <></>;
};

const RigSlotLayout = ({ slots }: { slots: number }) => {
  let _slots: string | boolean = false;
  switch (slots) {
    case 1:
      _slots = r1;
      break;
    case 2:
      _slots = r2;
      break;
    case 3:
      _slots = r3;
      break;
    default:
      _slots = false;
  }
  return _slots ? <img className="rounded" src={_slots} style={{ border: 0 }} /> : <></>;
};

const ServiceSlotLayout = ({ slots }: { slots: number }) => {
  let _slots: string | boolean = false;
  switch (slots) {
    case 1:
      _slots = s1;
      break;
    case 2:
      _slots = s2;
      break;
    case 3:
      _slots = s3;
      break;
    case 4:
      _slots = s4;
      break;
    case 5:
      _slots = s5;
      break;
    default:
      _slots = false;
  }
  return _slots ? <img className="rounded" src={_slots} style={{ border: 0 }} /> : <></>;
};

const TypeIcon = ({
  item,
  id,
  left,
  top,
}: {
  item: { id: number; name: string } | any;
  id: string;
  left: number;
  top: number;
}) => {
  return (
    <div
      id={id}
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: "32px",
        height: "32px",
      }}
    >
      <img className="rounded" src={type_url(item.id)} title={item.name} alt={item.name} />
    </div>
  );
};

const FitTypeDiv = ({
  item,
  qty = 0,
  prefix = "",
}: {
  item: { id: number; name: string } | any;
  qty?: number;
  prefix?: string;
}) => {
  return (
    <div id={item.id} className="d-flex align-items-center">
      <img
        className="rounded"
        src={type_url(item.id)}
        title={item.name}
        alt={item.name}
        width={"32px"}
        height={"32px"}
      />

      {prefix != "" && <h6 className="m-0 p-0 mx-2" style={{ minWidth: "50px" }}>{`${prefix}`}</h6>}

      <p className="m-0 p-0 ms-2">
        {qty > 0 && `${qty.toLocaleString()}x `}
        {item.name}
      </p>
    </div>
  );
};

const EmptyTypeDiv = ({ message }: { message: string }) => {
  return (
    <div className="d-flex align-items-center">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ width: "32px", height: "32px" }}
      >
        <i
          className="fa-regular fa-square align-self-center text-muted"
          style={{ fontSize: "22px" }}
        ></i>
      </div>
      <p className="m-0 p-0 ms-2">{message}</p>
    </div>
  );
};

const FittingModalCircle = ({
  ship,
  fitting,
  low = 8,
  med = 8,
  high = 8,
  services = 5,
  rigs = 3,
}: any) => {
  return (
    <div
      id="Fitting_Panel"
      style={{ position: "relative", height: "398px", width: "398px", zIndex: 3, margin: "0 auto" }}
    >
      <div
        id="mask"
        style={{
          position: "absolute",
          height: "398px",
          width: "398px",
          zIndex: -1,
          margin: "0 auto",
          left: 0,
          top: 0,
        }}
      >
        <img
          className="rounded"
          style={{
            position: "absolute",
            height: "398px",
            width: "398px",
            margin: "0 auto",
            left: 0,
            top: 0,
            border: 0,
          }}
          src={ring}
          alt=""
        />
      </div>

      <div
        id="highx"
        style={{
          position: "absolute",
          height: "398px",
          width: "398px",
          zIndex: -1,
          margin: "0 auto",
          left: 0,
          top: 0,
        }}
      >
        <HighSlotLayout slots={high} />
      </div>

      {fitting.HiSlot0 && <TypeIcon item={fitting.HiSlot0} left={73} top={60} id="high1" />}
      {fitting.HiSlot1 && <TypeIcon item={fitting.HiSlot1} left={102} top={42} id="high2" />}
      {fitting.HiSlot2 && <TypeIcon item={fitting.HiSlot2} left={134} top={27} id="high3" />}
      {fitting.HiSlot3 && <TypeIcon item={fitting.HiSlot3} left={169} top={21} id="high4" />}
      {fitting.HiSlot4 && <TypeIcon item={fitting.HiSlot4} left={203} top={22} id="high5" />}
      {fitting.HiSlot5 && <TypeIcon item={fitting.HiSlot5} left={238} top={30} id="high6" />}
      {fitting.HiSlot6 && <TypeIcon item={fitting.HiSlot6} left={270} top={45} id="high7" />}
      {fitting.HiSlot7 && <TypeIcon item={fitting.HiSlot7} left={295} top={64} id="high8" />}

      <div
        id="midx"
        style={{
          position: "absolute",
          height: "398px",
          width: "398px",
          zIndex: -1,
          margin: "0 auto",
          left: 0,
          top: 0,
        }}
      >
        <MedSlotLayout slots={med} />
      </div>

      {fitting.MedSlot0 && <TypeIcon item={fitting.MedSlot0} left={26} top={140} id="mid1" />}
      {fitting.MedSlot1 && <TypeIcon item={fitting.MedSlot1} left={24} top={176} id="mid2" />}
      {fitting.MedSlot2 && <TypeIcon item={fitting.MedSlot2} left={23} top={212} id="mid3" />}
      {fitting.MedSlot3 && <TypeIcon item={fitting.MedSlot3} left={30} top={245} id="mid4" />}
      {fitting.MedSlot4 && <TypeIcon item={fitting.MedSlot4} left={46} top={276} id="mid5" />}
      {fitting.MedSlot5 && <TypeIcon item={fitting.MedSlot5} left={69} top={304} id="mid6" />}
      {fitting.MedSlot6 && <TypeIcon item={fitting.MedSlot6} left={100} top={328} id="mid7" />}
      {fitting.MedSlot7 && <TypeIcon item={fitting.MedSlot7} left={133} top={342} id="mid8" />}

      <div
        id="lowx"
        style={{
          position: "absolute",
          height: "398px",
          width: "398px",
          zIndex: -1,
          margin: "0 auto",
          left: 0,
          top: 0,
        }}
      >
        <LoSlotLayout slots={low} />
      </div>

      {fitting.LoSlot0 && <TypeIcon item={fitting.LoSlot0} left={344} top={143} id="low1" />}
      {fitting.LoSlot1 && <TypeIcon item={fitting.LoSlot1} left={350} top={178} id="low2" />}
      {fitting.LoSlot2 && <TypeIcon item={fitting.LoSlot2} left={349} top={213} id="low3" />}
      {fitting.LoSlot3 && <TypeIcon item={fitting.LoSlot3} left={340} top={246} id="low4" />}
      {fitting.LoSlot4 && <TypeIcon item={fitting.LoSlot4} left={323} top={277} id="low5" />}
      {fitting.LoSlot5 && <TypeIcon item={fitting.LoSlot5} left={300} top={304} id="low6" />}
      {fitting.LoSlot6 && <TypeIcon item={fitting.LoSlot6} left={268} top={324} id="low7" />}
      {fitting.LoSlot7 && <TypeIcon item={fitting.LoSlot7} left={234} top={338} id="low8" />}

      <div
        id="rigxx"
        style={{
          position: "absolute",
          height: "398px",
          width: "398px",
          zIndex: -1,
          margin: "0 auto",
          left: 0,
          top: 0,
        }}
      >
        <RigSlotLayout slots={rigs} />
      </div>

      {fitting.RigSlot0 && <TypeIcon item={fitting.RigSlot0} left={148} top={259} id="rig1" />}
      {fitting.RigSlot1 && <TypeIcon item={fitting.RigSlot1} left={185} top={267} id="rig2" />}
      {fitting.RigSlot2 && <TypeIcon item={fitting.RigSlot2} left={221} top={259} id="rig3" />}

      <div
        id="subx"
        style={{
          position: "absolute",
          height: "398px",
          width: "398px",
          zIndex: -1,
          margin: "0 auto",
          left: 0,
          top: 0,
        }}
      >
        <ServiceSlotLayout slots={services} />
      </div>
      {/* This is a ship */}
      {fitting.SubSystemSlot0 && (
        <TypeIcon item={fitting.SubSystemSlot0} left={117} top={131} id="sub1" />
      )}
      {fitting.SubSystemSlot1 && (
        <TypeIcon item={fitting.SubSystemSlot1} left={147} top={108} id="sub2" />
      )}
      {fitting.SubSystemSlot2 && (
        <TypeIcon item={fitting.SubSystemSlot2} left={184} top={98} id="sub3" />
      )}
      {fitting.SubSystemSlot3 && (
        <TypeIcon item={fitting.SubSystemSlot3} left={221} top={107} id="sub4" />
      )}
      {/* This is a structure */}
      {fitting.ServiceSlot0 && (
        <TypeIcon item={fitting.ServiceSlot0} left={117} top={131} id="sub1" />
      )}
      {fitting.ServiceSlot1 && (
        <TypeIcon item={fitting.ServiceSlot1} left={147} top={108} id="sub2" />
      )}
      {fitting.ServiceSlot2 && (
        <TypeIcon item={fitting.ServiceSlot2} left={184} top={98} id="sub3" />
      )}
      {fitting.ServiceSlot3 && (
        <TypeIcon item={fitting.ServiceSlot3} left={221} top={107} id="sub4" />
      )}

      <div
        id="bigship"
        style={{
          position: "absolute",
          height: "256px",
          width: "256px",
          zIndex: -2,
          left: "72px",
          top: "71px",
        }}
      >
        <img
          className="rounded"
          src={type_url(ship.type.id, 256)}
          style={{ height: "256px", width: "256px" }}
          title="{{ fit.ship_type.name }}"
          alt="{{ fit.ship_type.name }}"
          data-bs-tooltip="aa-fittings"
        />
      </div>
    </div>
  );
};

export const FittingModal = ({ ship, showModal, setShowModal }: any) => {
  const { data, isFetching } = useQuery({
    queryKey: ["glances", "account", ship.id],
    queryFn: () => loadStructureFit(ship.id ? Number(ship.id) : 0),
    refetchOnWindowFocus: false,
  });

  return <FittingModalBase {...{ ship, data, showModal, setShowModal, isFetching }} />;
};

export const AssetFittingModal = ({ asset, assetContents, showModal, setShowModal }: any) => {
  const data = assetContents?.reduce(
    (o: any, n: any) => {
      if (o.fit.hasOwnProperty(n.location.name)) {
        o.fit[n.location.name].push(n.item);
      } else {
        o.fit[n.location.name] = n.item;
      }
      return o;
    },
    {
      fit: {
        StructureFuel: [],
        Cargo: [],
        MoonMaterialBay: [],
        DroneBay: [],
        FighterBay: [],
      },
    },
  );
  const ship = {
    name: asset.item.name,
    type: {
      id: asset.item.id,
    },
  };
  return <FittingModalBase {...{ ship, data, showModal, setShowModal }} isFetching={false} />;
};

export const FittingModalBase = ({ ship, data, showModal, setShowModal, isFetching }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        size="xl"
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>{ship?.name}</Modal.Title>
        </Modal.Header>
        {isFetching || !data ? (
          <PanelLoader title={t("Laoding Fit")} message={t("Please Wait")} />
        ) : (
          <div className="d-flex">
            <div className="m-3">
              <FittingModalCircle
                ship={ship}
                fitting={data.fit}
                high={data.high}
                med={data.med}
                low={data.low}
                services={data.service}
                rigs={data.rig}
              />
            </div>
            <div className="d-flex flex-column flex-grow-1 m-3">
              {data.high > 0 && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Hi Slots")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.HiSlot0 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot0} />
                    ) : (
                      data.high > 0 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                    {data?.fit?.HiSlot1 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot1} />
                    ) : (
                      data.high > 1 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                    {data?.fit?.HiSlot2 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot2} />
                    ) : (
                      data.high > 2 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                    {data?.fit?.HiSlot3 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot3} />
                    ) : (
                      data.high > 3 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                    {data?.fit?.HiSlot4 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot4} />
                    ) : (
                      data.high > 4 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                    {data?.fit?.HiSlot5 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot5} />
                    ) : (
                      data.high > 5 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                    {data?.fit?.HiSlot6 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot6} />
                    ) : (
                      data.high > 6 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                    {data?.fit?.HiSlot7 ? (
                      <FitTypeDiv item={data?.fit?.HiSlot7} />
                    ) : (
                      data.high > 7 && <EmptyTypeDiv message={t("Empty Hi Slot")} />
                    )}
                  </div>
                </div>
              )}
              {data.med > 0 && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Med Slots")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.MedSlot0 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot0} />
                    ) : (
                      data.med > 0 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                    {data?.fit?.MedSlot1 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot1} />
                    ) : (
                      data.med > 1 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                    {data?.fit?.MedSlot2 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot2} />
                    ) : (
                      data.med > 2 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                    {data?.fit?.MedSlot3 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot3} />
                    ) : (
                      data.med > 3 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                    {data?.fit?.MedSlot4 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot4} />
                    ) : (
                      data.med > 4 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                    {data?.fit?.MedSlot5 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot5} />
                    ) : (
                      data.med > 5 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                    {data?.fit?.MedSlot6 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot6} />
                    ) : (
                      data.med > 6 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                    {data?.fit?.MedSlot7 ? (
                      <FitTypeDiv item={data?.fit?.MedSlot7} />
                    ) : (
                      data.med > 7 && <EmptyTypeDiv message={t("Empty Med Slot")} />
                    )}
                  </div>
                </div>
              )}
              {data.low > 0 && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Lo Slots")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.LoSlot0 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot0} />
                    ) : (
                      data.low > 0 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                    {data?.fit?.LoSlot1 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot1} />
                    ) : (
                      data.low > 1 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                    {data?.fit?.LoSlot2 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot2} />
                    ) : (
                      data.low > 2 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                    {data?.fit?.LoSlot3 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot3} />
                    ) : (
                      data.low > 3 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                    {data?.fit?.LoSlot4 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot4} />
                    ) : (
                      data.low > 4 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                    {data?.fit?.LoSlot5 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot5} />
                    ) : (
                      data.low > 5 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                    {data?.fit?.LoSlot6 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot6} />
                    ) : (
                      data.low > 6 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                    {data?.fit?.LoSlot7 ? (
                      <FitTypeDiv item={data?.fit?.LoSlot7} />
                    ) : (
                      data.low > 7 && <EmptyTypeDiv message={t("Empty Lo Slot")} />
                    )}
                  </div>
                </div>
              )}
              {data.rig > 0 && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Rigs")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.RigSlot0 ? (
                      <FitTypeDiv item={data?.fit?.RigSlot0} />
                    ) : (
                      data.rig > 0 && <EmptyTypeDiv message={t("Empty Rig Slot")} />
                    )}
                    {data?.fit?.RigSlot1 ? (
                      <FitTypeDiv item={data?.fit?.RigSlot1} />
                    ) : (
                      data.rig > 1 && <EmptyTypeDiv message={t("Empty Rig Slot")} />
                    )}
                    {data?.fit?.RigSlot2 ? (
                      <FitTypeDiv item={data?.fit?.RigSlot2} />
                    ) : (
                      data.rig > 2 && <EmptyTypeDiv message={t("Empty Rig Slot")} />
                    )}
                  </div>
                </div>
              )}
              {data.service > 0 && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Service Slots")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.ServiceSlot0 ? (
                      <FitTypeDiv item={data?.fit?.ServiceSlot0} />
                    ) : (
                      data.service > 0 && <EmptyTypeDiv message={t("Empty Service Slot")} />
                    )}
                    {data?.fit?.ServiceSlot1 ? (
                      <FitTypeDiv item={data?.fit?.ServiceSlot1} />
                    ) : (
                      data.service > 1 && <EmptyTypeDiv message={t("Empty Service Slot")} />
                    )}
                    {data?.fit?.ServiceSlot2 ? (
                      <FitTypeDiv item={data?.fit?.ServiceSlot2} />
                    ) : (
                      data.service > 2 && <EmptyTypeDiv message={t("Empty Service Slot")} />
                    )}
                    {data?.fit?.ServiceSlot3 ? (
                      <FitTypeDiv item={data?.fit?.ServiceSlot3} />
                    ) : (
                      data.service > 3 && <EmptyTypeDiv message={t("Empty Service Slot")} />
                    )}
                    {data?.fit?.ServiceSlot4 ? (
                      <FitTypeDiv item={data?.fit?.ServiceSlot4} />
                    ) : (
                      data.service > 4 && <EmptyTypeDiv message={t("Empty Service Slot")} />
                    )}
                    {data?.fit?.ServiceSlot5 ? (
                      <FitTypeDiv item={data?.fit?.ServiceSlot5} />
                    ) : (
                      data.service > 5 && <EmptyTypeDiv message={t("Empty Service Slot")} />
                    )}
                  </div>
                </div>
              )}
              {data.subsystem > 0 && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Service Slots")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.SubSystemSlot0 ? (
                      <FitTypeDiv item={data?.fit?.SubSystemSlot0} />
                    ) : (
                      data.subsystem > 0 && <EmptyTypeDiv message={t("Empty Sub System Slot")} />
                    )}
                    {data?.fit?.SubSystemSlot1 ? (
                      <FitTypeDiv item={data?.fit?.SubSystemSlot1} />
                    ) : (
                      data.subsystem > 1 && <EmptyTypeDiv message={t("Empty Sub System Slot")} />
                    )}
                    {data?.fit?.SubSystemSlot2 ? (
                      <FitTypeDiv item={data?.fit?.SubSystemSlot2} />
                    ) : (
                      data.subsystem > 2 && <EmptyTypeDiv message={t("Empty Sub System Slot")} />
                    )}
                    {data?.fit?.SubSystemSlot3 ? (
                      <FitTypeDiv item={data?.fit?.SubSystemSlot3} />
                    ) : (
                      data.subsystem > 3 && <EmptyTypeDiv message={t("Empty Sub System Slot")} />
                    )}
                    {data?.fit?.SubSystemSlot4 ? (
                      <FitTypeDiv item={data?.fit?.SubSystemSlot4} />
                    ) : (
                      data.subsystem > 4 && <EmptyTypeDiv message={t("Empty Sub System Slot")} />
                    )}
                    {data?.fit?.SubSystemSlot5 ? (
                      <FitTypeDiv item={data?.fit?.SubSystemSlot5} />
                    ) : (
                      data.subsystem > 5 && <EmptyTypeDiv message={t("Empty Sub System Slot")} />
                    )}
                  </div>
                </div>
              )}

              {data.fit.StructureFuel && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Structure Fuel")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.StructureFuel.map((item: any) => (
                      <FitTypeDiv item={item} qty={item.qty} />
                    ))}
                  </div>
                </div>
              )}

              {data.fit.Cargo && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Cargo")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.Cargo.map((item: any) => <FitTypeDiv item={item} qty={item.qty} />)}
                  </div>
                </div>
              )}

              {data.fit.MoonMaterialBay && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Moon Material Bay")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.MoonMaterialBay.map((item: any) => (
                      <FitTypeDiv item={item} qty={item.qty} />
                    ))}
                  </div>
                </div>
              )}

              {data.fighter > 0 && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{"Fighter Tubes"}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.FighterTube0 ? (
                      <FitTypeDiv prefix="Tube 1:" item={data?.fit?.FighterTube0} />
                    ) : (
                      data.fighter > 0 && <EmptyTypeDiv message={"Empty Fighter Tube"} />
                    )}
                    {data?.fit?.FighterTube1 ? (
                      <FitTypeDiv prefix="Tube 2:" item={data?.fit?.FighterTube1} />
                    ) : (
                      data.fighter > 1 && <EmptyTypeDiv message={"Empty Fighter Tube"} />
                    )}
                    {data?.fit?.FighterTube2 ? (
                      <FitTypeDiv prefix="Tube 3:" item={data?.fit?.FighterTube2} />
                    ) : (
                      data.fighter > 2 && <EmptyTypeDiv message={"Empty Fighter Tube"} />
                    )}
                    {data?.fit?.FighterTube3 ? (
                      <FitTypeDiv prefix="Tube 4:" item={data?.fit?.FighterTube3} />
                    ) : (
                      data.fighter > 3 && <EmptyTypeDiv message={"Empty Fighter Tube"} />
                    )}
                    {data?.fit?.FighterTube4 ? (
                      <FitTypeDiv prefix="Tube 5:" item={data?.fit?.FighterTube4} />
                    ) : (
                      data.fighter > 4 && <EmptyTypeDiv message={"Empty Fighter Tube"} />
                    )}
                  </div>
                </div>
              )}

              {data?.fit?.FighterBay && (
                <div className="my-2">
                  <div className="aa-callout aa-callout-warning">
                    <Card.Title>{t("Fighter Bay")}</Card.Title>
                  </div>
                  <div className="px-3">
                    {data?.fit?.FighterBay.map((item: any) => (
                      <FitTypeDiv item={item} qty={item.qty} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
