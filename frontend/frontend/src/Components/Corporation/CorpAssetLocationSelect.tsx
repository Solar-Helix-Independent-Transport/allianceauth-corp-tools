import { useQuery } from "react-query";
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
  const { isLoading, data } = useQuery(["corp_asset_loc", corporationID], () =>
    loadAssetLocations(corporationID),
  );

  return (
    <Select
      isLoading={isLoading}
      styles={colourStyles}
      options={data}
      isDisabled={!corporationID ? true : false}
      onChange={(e: any) => setLocation(e.value)}
    />
  );
};

export default CorporationAssetLocationSelect;
