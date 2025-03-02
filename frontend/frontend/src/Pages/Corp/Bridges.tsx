import { loadBridges } from "../../api/corporation";
import { useQuery } from "react-query";
import { PanelLoader } from "../../Components/Loaders/loaders";
import { Card } from "react-bootstrap";
import { BridgeLink } from "../../Components/Corporation/BridgeLink";
import { BridgeHeader } from "../../Components/Corporation/BridgeHeader";

const Bridges = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["bridges"],
    queryFn: () => loadBridges(),
    refetchOnWindowFocus: false,
    initialData: { characters: [], main: undefined, headers: [] },
  });

  return data.length > 0 ? (
    <>
      <Card.Body className="flex-container">
        <BridgeHeader />

        <hr className="col-xs-12" />

        {data
          .sort((a: any, b: any) => {
            let levels_a = [];
            let levels_b = [];

            a.start.known && levels_a.push(a.start.ozone);
            a.end.known && levels_a.push(a.end.ozone);
            b.start.known && levels_b.push(b.start.ozone);
            b.end.known && levels_b.push(b.end.ozone);

            if (Math.min(...levels_a) > Math.min(...levels_b)) {
              return 1;
            } else if (Math.min(...levels_a) < Math.min(...levels_b)) {
              return -1;
            } else {
              return 0;
            }
          })
          .map((bridgePair: any) => {
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
