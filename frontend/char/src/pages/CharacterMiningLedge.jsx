import { loadMining } from "../apis/Character";
import ErrorBoundary from "../components/ErrorBoundary";
import MiningLedger from "../components/MiningLedger";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharMiningLedger = () => {
  let { characterID } = useParams();
  const { isLoading, data } = useQuery(["mining", characterID], () => loadMining(characterID), {
    refetchOnWindowFocus: false,
    //   initialData: {
    //     all_ores: [],
    //     all_systems: [],
    //     total_volume: 0,
    //     total_value: 0,
    //     data: [],
    //   },
  });
  if (isLoading) {
    return <p>Loading</p>;
  }
  return (
    <ErrorBoundary>
      <MiningLedger data={data} />
    </ErrorBoundary>
  );
};

export default CharMiningLedger;
