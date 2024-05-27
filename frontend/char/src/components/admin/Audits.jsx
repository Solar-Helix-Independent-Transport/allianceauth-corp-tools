import { loadAssetLocations } from "../apis/Character";
import AdminPanel from "./AdminPanel";
import React from "react";
import { useQuery } from "react-query";

const ModelsAdmin = () => {
  const { isLoading, data } = useQuery(["asset_loc"], () => loadAssetLocations(), {
    refetchOnWindowFocus: false,
  });

  return (
    <AdminPanel isFetching={isLoading} title="Eve Models">
      {data && (
        <>
          <p>TESTASDFA</p>
        </>
      )}
    </AdminPanel>
  );
};

export default ModelsAdmin;
