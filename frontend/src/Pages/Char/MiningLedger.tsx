// import { useTranslation } from "react-i18next";
import { loadMining } from "../../api/character";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import LedgerGraph from "../../Components/Graphs/LedgerGraph";
import { PanelLoader } from "../../Components/Loaders/loaders";

const CharacterMiningLedger = () => {
  // const { t } = useTranslation();
  const { characterID } = useParams();

  const { data } = useQuery({
    queryKey: ["mining-ledger", characterID],
    queryFn: () => loadMining(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  return data ? <LedgerGraph {...{ data }} /> : <PanelLoader />;
};

export default CharacterMiningLedger;
