import { loadAssetLocations } from "../../api/character";
import { useQuery } from "react-query";
import Select from "react-select";

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

const CharacterAssetLocationSelect = ({
  characterID,
  setLocation,
}: {
  characterID: number;
  setLocation: any;
}) => {
  const { isLoading, data } = useQuery(
    ["asset_loc", characterID],
    () => loadAssetLocations(characterID),
    { refetchOnWindowFocus: false },
  );

  return (
    <Select
      isLoading={isLoading}
      styles={colourStyles}
      options={data}
      onChange={(e: any) => setLocation(e.value)}
    />
  );
};

export default CharacterAssetLocationSelect;
