import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Select, { StylesConfig } from "react-select";
import { loadAssetLocations } from "../../api/corporation";
import { bootstrapSelectStyles, SelectOption } from "../Helpers/reactSelectTheme";

const colourStyles = bootstrapSelectStyles as StylesConfig<SelectOption>;

const CorporationAssetLocationSelect = ({
  corporationID,
  setLocation,
}: {
  corporationID: number;
  setLocation: (value: number) => void;
}) => {
  const { isLoading, data } = useQuery({
    queryKey: ["corp_asset_loc", corporationID],
    queryFn: () => loadAssetLocations(corporationID),
  });

  const [selected, setSelected] = useState<SelectOption | null>(null);
  // Auto-select the first location whenever a new location list arrives -
  // this is React's documented "adjust state when a prop changes" pattern
  // (calling setState during render, guarded by comparing against the
  // previous render's data), not a side effect, so it doesn't need
  // useEffect: https://react.dev/learn/you-might-not-need-an-effect
  const [prevData, setPrevData] = useState(data);
  if (data !== prevData) {
    setPrevData(data);
    setSelected(data?.length ? data[0] : null);
  }

  // Notifying the parent is a side effect (updating an external system),
  // so it belongs in an effect - unlike the local `selected` adjustment
  // above.
  useEffect(() => {
    if (selected) setLocation(Number(selected.value));
  }, [selected, setLocation]);

  return (
    <Select<SelectOption>
      isLoading={isLoading}
      styles={colourStyles}
      options={data}
      value={selected}
      isDisabled={!corporationID}
      onChange={(e) => setSelected(e)}
    />
  );
};

export default CorporationAssetLocationSelect;
