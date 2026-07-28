import { loadAssetLocations } from "../../api/character";
import { useQuery } from "@tanstack/react-query";
import Select, { StylesConfig } from "react-select";
import { bootstrapSelectStyles, SelectOption } from "../Helpers/reactSelectTheme";

const colourStyles = bootstrapSelectStyles as StylesConfig<SelectOption>;

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
    <Select<SelectOption>
      isLoading={isLoading}
      styles={colourStyles}
      options={data}
      onChange={(e) => e && setLocation(Number(e.value))}
    />
  );
};

export default CharacterAssetLocationSelect;
