import { loadBridges } from "../../api/corporation";
import { useQuery } from "react-query";
import { PanelLoader } from "../../Components/Loaders/loaders";
import { Badge, Card } from "react-bootstrap";
import { BridgeLink } from "../../Components/Corporation/BridgeLink";

const Bridges = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["bridges"],
    queryFn: () => loadBridges(),
    refetchOnWindowFocus: false,
    initialData: { characters: [], main: undefined, headers: [] },
  });

  return data.length > 0 ? (
    <>
      <Card.Header>Jump Bridge Network</Card.Header>
      <Card.Body className="flex-container">
        <div className="flex-container">
          <p
            className="gate-active"
            style={{
              margin: "15px",
              borderBottom: "3px dotted",
            }}
          >
            Gate Online
          </p>
          <p
            className="gate-inactive"
            style={{
              margin: "15px",
              borderBottom: "3px dotted",
            }}
          >
            Gate Offline
          </p>{" "}
          <p
            className="gate-unknown"
            style={{
              margin: "15px",
              borderBottom: "3px dotted",
            }}
          >
            Gate Unknown
          </p>
          <Badge
            bg="info"
            style={{
              margin: "15px",
            }}
          >
            Lo/Fuel Level Ok
          </Badge>
          <Badge
            bg="danger"
            style={{
              margin: "15px",
            }}
          >
            Lo/Fuel Level Low
          </Badge>
        </div>

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
