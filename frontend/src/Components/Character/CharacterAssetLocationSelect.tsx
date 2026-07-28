import { loadAssetLocations } from "../../api/character";
import { useQuery } from "@tanstack/react-query";
import Select, { StylesConfig } from "react-select";
import { bootstrapSelectStyles } from "../Helpers/reactSelectTheme";

interface LocationOption {
  value: number;
  label: string;
}

const colourStyles = bootstrapSelectStyles as StylesConfig<LocationOption>;

const CharacterAssetLocationSelect = ({
  characterID,
  setLocation,
}: {
  characterID: number;
  setLocation: (value: number) => void;
}) => {
  const { isLoading, data } = useQuery({
    queryKey: ["asset_loc", characterID],
    queryFn: () => loadAssetLocations(characterID),
    refetchOnWindowFocus: false,
  });

  return (
    <Select<LocationOption>
      isLoading={isLoading}
      styles={colourStyles}
      options={data}
      onChange={(e) => e && setLocation(e.value)}
    />
  );
};

export default CharacterAssetLocationSelect;
