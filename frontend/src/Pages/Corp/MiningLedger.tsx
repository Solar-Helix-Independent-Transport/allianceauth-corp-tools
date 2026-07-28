import { LoadAgregatedMining } from "../../api/corporation";
import { useQuery } from "@tanstack/react-query";
import LedgerGraph from "../../Components/Graphs/LedgerGraph";
import { PanelLoader } from "../../Components/Loaders/loaders";
import CorporationFilterBar from "../../Components/Corporation/CorporationFilterBar";
import { useCorporationId } from "../../Components/Corporation/useCorporationId";

const CorporationMiningLedger = () => {
  const corporationID = useCorporationId();

  const { data } = useQuery({
    queryKey: ["mining-ledger-corp", corporationID],
    queryFn: () => LoadAgregatedMining(Number(corporationID)),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <CorporationFilterBar />

      {data ? <LedgerGraph {...{ data }} /> : <PanelLoader />}
    </>
  );
};

export default CorporationMiningLedger;
