import { loadBridges } from "../../api/corporation";
import { BridgePair } from "../../Components/Corporation/BridgeTypes";
import { useQuery } from "@tanstack/react-query";
import { PanelLoader } from "../../Components/Loaders/loaders";
import { Card } from "react-bootstrap";
import { BridgeLink } from "../../Components/Corporation/BridgeLink";
import { BridgeHeader } from "../../Components/Corporation/BridgeHeader";

const Bridges = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["bridges"],
    queryFn: () => loadBridges(),
    refetchOnWindowFocus: false,
    initialData: [] as BridgePair[],
  });

  return data.length > 0 ? (
    <>
      <Card.Body className="flex-container">
        <BridgeHeader />

        <hr className="col-xs-12" />

        {data
          .sort((a, b) => {
            const levels_a = [];
            const levels_b = [];

            if (a.start.known) levels_a.push(a.start.ozone);
            if (a.end.known) levels_a.push(a.end.ozone);
            if (b.start.known) levels_b.push(b.start.ozone);
            if (b.end.known) levels_b.push(b.end.ozone);

            if (Math.min(...levels_a) > Math.min(...levels_b)) {
              return 1;
            } else if (Math.min(...levels_a) < Math.min(...levels_b)) {
              return -1;
            } else {
              return 0;
            }
          })
          .map((bridgePair) => {
            return <BridgeLink start={bridgePair.start} end={bridgePair.end} />;
          })}
      </Card.Body>
    </>
  ) : isFetching ? (
    <PanelLoader />
  ) : (
    <PanelLoader message="No Bridges Found" />
  );
};

export default Bridges;
