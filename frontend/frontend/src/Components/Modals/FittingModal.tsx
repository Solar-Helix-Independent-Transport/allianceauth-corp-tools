import ring from "../../assets/fittings/tyrannis.png";
import h8 from "../../assets/fittings/8h.png";
import m8 from "../../assets/fittings/8m.png";
import l8 from "../../assets/fittings/8l.png";
import r from "../../assets/fittings/3r.png";
import s from "../../assets/fittings/5s.png";
import { Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import { loadStructureFit } from "../../api/corporation";
import { PanelLoader } from "../Loaders/loaders";

const type_url = (typeID: number, size = 32) => {
  return `https://images.evetech.net/types/${typeID}/icon?size=${size}`;
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

const FittingModalContent = ({ ship, fitting }: any) => {
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
        <img className="rounded" src={h8} alt="High Slots" style={{ border: 0 }} />
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
        <img className="rounded" src={m8} alt="Med Slots" style={{ border: 0 }} />
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
        <img className="rounded" src={l8} alt="Low Slots" style={{ border: 0 }} />
      </div>

      {fitting.LowSlot0 && <TypeIcon item={fitting.LowSlot0} left={344} top={143} id="low1" />}
      {fitting.LowSlot1 && <TypeIcon item={fitting.LowSlot1} left={350} top={178} id="low2" />}
      {fitting.LowSlot2 && <TypeIcon item={fitting.LowSlot2} left={349} top={213} id="low3" />}
      {fitting.LowSlot3 && <TypeIcon item={fitting.LowSlot3} left={323} top={246} id="low4" />}
      {fitting.LowSlot4 && <TypeIcon item={fitting.LowSlot4} left={323} top={277} id="low5" />}
      {fitting.LowSlot5 && <TypeIcon item={fitting.LowSlot5} left={300} top={304} id="low6" />}
      {fitting.LowSlot6 && <TypeIcon item={fitting.LowSlot6} left={268} top={324} id="low7" />}
      {fitting.LowSlot7 && <TypeIcon item={fitting.LowSlot7} left={234} top={338} id="low8" />}

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
        <img className="rounded" src={r} alt="Rig Slots" style={{ border: 0 }} />
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
        <img className="rounded" src={s} alt="Subsystem Slots" style={{ border: 0 }} />
      </div>
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

export const FittingModal = ({ ship }: any) => {
  console.log(ship);
  const { data, isLoading } = useQuery({
    queryKey: ["glances", "account", ship.id],
    queryFn: () => loadStructureFit(ship.id ? Number(ship.id) : 0),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <PanelLoader title="Laoding Fit" message="Please Wait" />;
  }

  return (
    <>
      <Modal size="xl" show={true}>
        <FittingModalContent ship={ship} fitting={data} />
      </Modal>
    </>
  );
};
