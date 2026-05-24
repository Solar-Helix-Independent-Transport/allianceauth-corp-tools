import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { loadAssetLocations } from "../../api/corporation";

const colourStyles = {
  option: (styles: any) => {
    return {
      ...styles,
      color: "black",
    };
  },
  menu: (base: any) => ({ ...base, zIndex: 9999 }),
  menuList: (base: any) => ({ ...base, zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const CorporationAssetLocationSelect = ({
  corporationID,
  setLocation,
}: {
  corporationID: number;
  setLocation: any;
}) => {
  const { isLoading, data } = useQuery({
    queryKey: ["corp_asset_loc", corporationID],
    queryFn: () => loadAssetLocations(corporationID),
  });

  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (data?.length) {
      setSelected(data[0]);
      setLocation(data[0].value);
    }
  }, [data]);

  return (
    <Select
      isLoading={isLoading}
      styles={colourStyles}
      options={data}
      value={selected}
      isDisabled={!corporationID}
      onChange={(e: any) => {
        setSelected(e);
        setLocation(e.value);
      }}
    />
  );
};

export default CorporationAssetLocationSelect;
