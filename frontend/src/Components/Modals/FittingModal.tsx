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
import l1 from "../../assets/fittings/1l.png";
import l2 from "../../assets/fittings/2l.png";
import l3 from "../../assets/fittings/3l.png";
import l4 from "../../assets/fittings/4l.png";
import l5 from "../../assets/fittings/5l.png";
import l6 from "../../assets/fittings/6l.png";
import l7 from "../../assets/fittings/7l.png";
import l8 from "../../assets/fittings/8l.png";
import r1 from "../../assets/fittings/1r.png";
import r2 from "../../assets/fittings/2r.png";
import r3 from "../../assets/fittings/3r.png";
import s1 from "../../assets/fittings/1s.png";
import s2 from "../../assets/fittings/2s.png";
import s3 from "../../assets/fittings/3s.png";
import s4 from "../../assets/fittings/4s.png";
import s5 from "../../assets/fittings/5s.png";
import { Card, Modal } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { loadStructureFit } from "../../api/corporation";
import { PanelLoader } from "../Loaders/loaders";
import { useTranslation } from "react-i18next";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FitItem {
  id: number;
  name: string;
  qty?: number;
}

interface FitData {
  HiSlot0?: FitItem;
  HiSlot1?: FitItem;
  HiSlot2?: FitItem;
  HiSlot3?: FitItem;
  HiSlot4?: FitItem;
  HiSlot5?: FitItem;
  HiSlot6?: FitItem;
  HiSlot7?: FitItem;
  MedSlot0?: FitItem;
  MedSlot1?: FitItem;
  MedSlot2?: FitItem;
  MedSlot3?: FitItem;
  MedSlot4?: FitItem;
  MedSlot5?: FitItem;
  MedSlot6?: FitItem;
  MedSlot7?: FitItem;
  LoSlot0?: FitItem;
  LoSlot1?: FitItem;
  LoSlot2?: FitItem;
  LoSlot3?: FitItem;
  LoSlot4?: FitItem;
  LoSlot5?: FitItem;
  LoSlot6?: FitItem;
  LoSlot7?: FitItem;
  RigSlot0?: FitItem;
  RigSlot1?: FitItem;
  RigSlot2?: FitItem;
  ServiceSlot0?: FitItem;
  ServiceSlot1?: FitItem;
  ServiceSlot2?: FitItem;
  ServiceSlot3?: FitItem;
  ServiceSlot4?: FitItem;
  ServiceSlot5?: FitItem;
  SubSystemSlot0?: FitItem;
  SubSystemSlot1?: FitItem;
  SubSystemSlot2?: FitItem;
  SubSystemSlot3?: FitItem;
  SubSystemSlot4?: FitItem;
  SubSystemSlot5?: FitItem;
  FighterTube0?: FitItem;
  FighterTube1?: FitItem;
  FighterTube2?: FitItem;
  FighterTube3?: FitItem;
  FighterTube4?: FitItem;
  StructureFuel?: FitItem[];
  Cargo?: FitItem[];
  MoonMaterialBay?: FitItem[];
  DroneBay?: FitItem[];
  FighterBay?: FitItem[];
  [key: string]: FitItem | FitItem[] | undefined;
}

interface StructureFitData {
  fit: FitData;
  high?: number;
  med?: number;
  low?: number;
  rig?: number;
  service?: number;
  subsystem?: number;
  fighter?: number;
}

interface ShipInfo {
  id?: number;
  name: string;
  type?: { id: number };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BAY_KEYS = new Set(["StructureFuel", "Cargo", "MoonMaterialBay", "DroneBay", "FighterBay"]);

const slotImages: Record<string, string[]> = {
  high: [h1, h2, h3, h4, h5, h6, h7, h8],
  med: [m1, m2, m3, m4, m5, m6, m7, m8],
  lo: [l1, l2, l3, l4, l5, l6, l7, l8],
  rig: [r1, r2, r3],
  service: [s1, s2, s3, s4, s5],
};

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  height: "398px",
  width: "398px",
  zIndex: -1,
  margin: "0 auto",
  left: 0,
  top: 0,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const type_url = (typeID: number, size = 32) =>
  `https://images.evetech.net/types/${typeID}/${size >= 256 ? "render" : `icon?size=${size}`}`;

const renderModuleSlots = (fit: FitData, prefix: string, count: number, emptyMessage: string) =>
  Array.from({ length: count }, (_, i) => {
    const item = fit[`${prefix}${i}`] as FitItem | undefined;
    return item ? (
      <FitTypeDiv key={i} item={item} />
    ) : (
      <EmptyTypeDiv key={i} message={emptyMessage} />
    );
  });

const renderFighterTubes = (fit: FitData, count: number, emptyMessage: string) =>
  Array.from({ length: count }, (_, i) => {
    const item = fit[`FighterTube${i}`] as FitItem | undefined;
    return item ? (
      <FitTypeDiv key={i} item={item} prefix={`Tube ${i + 1}:`} />
    ) : (
      <EmptyTypeDiv key={i} message={emptyMessage} />
    );
  });

// ── Primitive components ───────────────────────────────────────────────────────

const SlotLayout = ({ type, slots }: { type: string; slots: number }) => {
  const img = slotImages[type]?.[slots - 1];
  return img ? <img className="rounded" src={img} style={{ border: 0 }} /> : null;
};

const TypeIcon = ({
  item,
  id,
  left,
  top,
}: {
  item: FitItem;
  id: string;
  left: number;
  top: number;
}) => (
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

const FitTypeDiv = ({
  item,
  qty = 0,
  prefix = "",
}: {
  item: FitItem;
  qty?: number;
  prefix?: string;
}) => (
  <div id={String(item.id)} className="d-flex align-items-center">
    <img
      className="rounded"
      src={type_url(item.id)}
      title={item.name}
      alt={item.name}
      width="32px"
      height="32px"
    />
    {prefix !== "" && (
      <h6 className="m-0 p-0 mx-2" style={{ minWidth: "50px" }}>
        {prefix}
      </h6>
    )}
    <p className="m-0 p-0 ms-2">
      {qty > 0 && `${qty.toLocaleString()}x `}
      {item.name}
    </p>
  </div>
);

const EmptyTypeDiv = ({ message }: { message: string }) => (
  <div className="d-flex align-items-center">
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ width: "32px", height: "32px" }}
    >
      <i
        className="fa-regular fa-square align-self-center text-muted"
        style={{ fontSize: "22px" }}
      />
    </div>
    <p className="m-0 p-0 ms-2">{message}</p>
  </div>
);

const SlotSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="my-2">
    <div className="aa-callout aa-callout-warning">
      <Card.Title>{title}</Card.Title>
    </div>
    <div className="px-3">{children}</div>
  </div>
);

// ── Circle display ────────────────────────────────────────────────────────────

const FittingModalCircle = ({
  ship,
  fitting,
  low = 8,
  med = 8,
  high = 8,
  services = 5,
  rigs = 3,
}: {
  ship: ShipInfo;
  fitting: FitData;
  low?: number;
  med?: number;
  high?: number;
  services?: number;
  rigs?: number;
}) => {
  const s = (key: string) => fitting[key] as FitItem | undefined;

  return (
    <div
      id="Fitting_Panel"
      style={{ position: "relative", height: "398px", width: "398px", zIndex: 3, margin: "0 auto" }}
    >
      <div id="mask" style={overlayStyle}>
        <img className="rounded" style={{ ...overlayStyle, border: 0 }} src={ring} alt="" />
      </div>

      <div id="highx" style={overlayStyle}>
        <SlotLayout type="high" slots={high} />
      </div>
      {s("HiSlot0") && <TypeIcon item={s("HiSlot0")!} left={73} top={60} id="high1" />}
      {s("HiSlot1") && <TypeIcon item={s("HiSlot1")!} left={102} top={42} id="high2" />}
      {s("HiSlot2") && <TypeIcon item={s("HiSlot2")!} left={134} top={27} id="high3" />}
      {s("HiSlot3") && <TypeIcon item={s("HiSlot3")!} left={169} top={21} id="high4" />}
      {s("HiSlot4") && <TypeIcon item={s("HiSlot4")!} left={203} top={22} id="high5" />}
      {s("HiSlot5") && <TypeIcon item={s("HiSlot5")!} left={238} top={30} id="high6" />}
      {s("HiSlot6") && <TypeIcon item={s("HiSlot6")!} left={270} top={45} id="high7" />}
      {s("HiSlot7") && <TypeIcon item={s("HiSlot7")!} left={295} top={64} id="high8" />}

      <div id="midx" style={overlayStyle}>
        <SlotLayout type="med" slots={med} />
      </div>
      {s("MedSlot0") && <TypeIcon item={s("MedSlot0")!} left={26} top={140} id="mid1" />}
      {s("MedSlot1") && <TypeIcon item={s("MedSlot1")!} left={24} top={176} id="mid2" />}
      {s("MedSlot2") && <TypeIcon item={s("MedSlot2")!} left={23} top={212} id="mid3" />}
      {s("MedSlot3") && <TypeIcon item={s("MedSlot3")!} left={30} top={245} id="mid4" />}
      {s("MedSlot4") && <TypeIcon item={s("MedSlot4")!} left={46} top={276} id="mid5" />}
      {s("MedSlot5") && <TypeIcon item={s("MedSlot5")!} left={69} top={304} id="mid6" />}
      {s("MedSlot6") && <TypeIcon item={s("MedSlot6")!} left={100} top={328} id="mid7" />}
      {s("MedSlot7") && <TypeIcon item={s("MedSlot7")!} left={133} top={342} id="mid8" />}

      <div id="lowx" style={overlayStyle}>
        <SlotLayout type="lo" slots={low} />
      </div>
      {s("LoSlot0") && <TypeIcon item={s("LoSlot0")!} left={344} top={143} id="low1" />}
      {s("LoSlot1") && <TypeIcon item={s("LoSlot1")!} left={350} top={178} id="low2" />}
      {s("LoSlot2") && <TypeIcon item={s("LoSlot2")!} left={349} top={213} id="low3" />}
      {s("LoSlot3") && <TypeIcon item={s("LoSlot3")!} left={340} top={246} id="low4" />}
      {s("LoSlot4") && <TypeIcon item={s("LoSlot4")!} left={323} top={277} id="low5" />}
      {s("LoSlot5") && <TypeIcon item={s("LoSlot5")!} left={300} top={304} id="low6" />}
      {s("LoSlot6") && <TypeIcon item={s("LoSlot6")!} left={268} top={324} id="low7" />}
      {s("LoSlot7") && <TypeIcon item={s("LoSlot7")!} left={234} top={338} id="low8" />}

      <div id="rigxx" style={overlayStyle}>
        <SlotLayout type="rig" slots={rigs} />
      </div>
      {s("RigSlot0") && <TypeIcon item={s("RigSlot0")!} left={148} top={259} id="rig1" />}
      {s("RigSlot1") && <TypeIcon item={s("RigSlot1")!} left={185} top={267} id="rig2" />}
      {s("RigSlot2") && <TypeIcon item={s("RigSlot2")!} left={221} top={259} id="rig3" />}

      <div id="subx" style={overlayStyle}>
        <SlotLayout type="service" slots={services} />
      </div>
      {s("SubSystemSlot0") && (
        <TypeIcon item={s("SubSystemSlot0")!} left={117} top={131} id="sub1" />
      )}
      {s("SubSystemSlot1") && (
        <TypeIcon item={s("SubSystemSlot1")!} left={147} top={108} id="sub2" />
      )}
      {s("SubSystemSlot2") && (
        <TypeIcon item={s("SubSystemSlot2")!} left={184} top={98} id="sub3" />
      )}
      {s("SubSystemSlot3") && (
        <TypeIcon item={s("SubSystemSlot3")!} left={221} top={107} id="sub4" />
      )}
      {s("ServiceSlot0") && <TypeIcon item={s("ServiceSlot0")!} left={117} top={131} id="svc1" />}
      {s("ServiceSlot1") && <TypeIcon item={s("ServiceSlot1")!} left={147} top={108} id="svc2" />}
      {s("ServiceSlot2") && <TypeIcon item={s("ServiceSlot2")!} left={184} top={98} id="svc3" />}
      {s("ServiceSlot3") && <TypeIcon item={s("ServiceSlot3")!} left={221} top={107} id="svc4" />}

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
          src={type_url(ship.type?.id ?? 0, 256)}
          style={{ height: "256px", width: "256px" }}
          title={ship.name}
          alt={ship.name}
        />
      </div>
    </div>
  );
};

// ── Exported modals ───────────────────────────────────────────────────────────

export const FittingModal = ({
  ship,
  showModal,
  setShowModal,
}: {
  ship: ShipInfo & { id: number; name: string };
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) => {
  const { data, isFetching } = useQuery({
    queryKey: ["glances", "account", ship.id],
    queryFn: () => loadStructureFit(ship.id ? Number(ship.id) : 0),
    refetchOnWindowFocus: false,
  });

  return <FittingModalBase {...{ ship, data, showModal, setShowModal, isFetching }} />;
};

export const AssetFittingModal = ({
  asset,
  assetContents,
  showModal,
  setShowModal,
}: {
  asset: { item: FitItem };
  assetContents?: Array<{ location: { name: string }; item: FitItem }>;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) => {
  const data = assetContents?.reduce<StructureFitData>(
    (o, n) => {
      const key = n.location.name;
      if (BAY_KEYS.has(key)) {
        (o.fit[key] as FitItem[]).push(n.item);
      } else {
        o.fit[key] = n.item;
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

  const ship: ShipInfo = {
    name: asset.item.name,
    type: { id: asset.item.id },
  };

  return <FittingModalBase {...{ ship, data, showModal, setShowModal }} isFetching={false} />;
};

export const FittingModalBase = ({
  ship,
  data,
  showModal,
  setShowModal,
  isFetching,
}: {
  ship: ShipInfo;
  data: StructureFitData | undefined;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  isFetching: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Modal size="xl" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>{ship?.name}</Modal.Title>
      </Modal.Header>
      {isFetching || !data ? (
        <PanelLoader title={t("Loading Fit")} message={t("Please Wait")} />
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
            {(data.high ?? 0) > 0 && (
              <SlotSection title={t("Hi Slots")}>
                {renderModuleSlots(data.fit, "HiSlot", data.high!, t("Empty Hi Slot"))}
              </SlotSection>
            )}
            {(data.med ?? 0) > 0 && (
              <SlotSection title={t("Med Slots")}>
                {renderModuleSlots(data.fit, "MedSlot", data.med!, t("Empty Med Slot"))}
              </SlotSection>
            )}
            {(data.low ?? 0) > 0 && (
              <SlotSection title={t("Lo Slots")}>
                {renderModuleSlots(data.fit, "LoSlot", data.low!, t("Empty Lo Slot"))}
              </SlotSection>
            )}
            {(data.rig ?? 0) > 0 && (
              <SlotSection title={t("Rigs")}>
                {renderModuleSlots(data.fit, "RigSlot", data.rig!, t("Empty Rig Slot"))}
              </SlotSection>
            )}
            {(data.service ?? 0) > 0 && (
              <SlotSection title={t("Service Slots")}>
                {renderModuleSlots(data.fit, "ServiceSlot", data.service!, t("Empty Service Slot"))}
              </SlotSection>
            )}
            {(data.subsystem ?? 0) > 0 && (
              <SlotSection title={t("Subsystem Slots")}>
                {renderModuleSlots(
                  data.fit,
                  "SubSystemSlot",
                  data.subsystem!,
                  t("Empty Sub System Slot"),
                )}
              </SlotSection>
            )}
            {(data.fit.StructureFuel?.length ?? 0) > 0 && (
              <SlotSection title={t("Structure Fuel")}>
                {data.fit.StructureFuel!.map((item) => (
                  <FitTypeDiv key={item.id} item={item} qty={item.qty} />
                ))}
              </SlotSection>
            )}
            {(data.fit.Cargo?.length ?? 0) > 0 && (
              <SlotSection title={t("Cargo")}>
                {data.fit.Cargo!.map((item) => (
                  <FitTypeDiv key={item.id} item={item} qty={item.qty} />
                ))}
              </SlotSection>
            )}
            {(data.fit.MoonMaterialBay?.length ?? 0) > 0 && (
              <SlotSection title={t("Moon Material Bay")}>
                {data.fit.MoonMaterialBay!.map((item) => (
                  <FitTypeDiv key={item.id} item={item} qty={item.qty} />
                ))}
              </SlotSection>
            )}
            {(data.fighter ?? 0) > 0 && (
              <SlotSection title={t("Fighter Tubes")}>
                {renderFighterTubes(data.fit, data.fighter!, t("Empty Fighter Tube"))}
              </SlotSection>
            )}
            {(data.fit.FighterBay?.length ?? 0) > 0 && (
              <SlotSection title={t("Fighter Bay")}>
                {data.fit.FighterBay!.map((item) => (
                  <FitTypeDiv key={item.id} item={item} qty={item.qty} />
                ))}
              </SlotSection>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
