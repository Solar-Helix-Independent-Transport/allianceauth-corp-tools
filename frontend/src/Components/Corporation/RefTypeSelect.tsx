import { useQuery } from "@tanstack/react-query";
import Select, { MultiValue, StylesConfig } from "react-select";
import { loadRefTypes } from "../../api/corporation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { bootstrapSelectStyles } from "../Helpers/reactSelectTheme";

interface RefTypeOption {
  value: string;
  label: string;
}

const colourStyles = bootstrapSelectStyles as StylesConfig<RefTypeOption, true>;

const convertToTitleCase = (str: string) => {
  if (!str) {
    return "";
  }
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const RefTypeSelect = ({ setFilter }: { setFilter: (value: string) => void }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["ref_types", 0],
    queryFn: () => loadRefTypes(),
    initialData: [] as string[],
    refetchOnWindowFocus: false,
  });
  const [baseQry, setRefQry] = useQueryState("refs");

  const updateFilter = (entry: MultiValue<RefTypeOption>) => {
    const values = entry.map((o) => {
      return o.value;
    });
    setFilter(values.sort().join(","));
    setRefQry(values.sort().join(","));
  };

  let options: RefTypeOption[] = [];

  if (!isLoading) {
    options = data?.map((ref) => {
      return {
        value: ref,
        label: convertToTitleCase(ref.replaceAll("_", " ")),
      };
    });
  }

  const defaultValue = baseQry?.split(",").map((ref) => {
    return {
      value: ref,
      label: convertToTitleCase(ref.replaceAll("_", " ")),
    };
  });

  useEffect(() => {
    if (baseQry) setFilter(baseQry);
    // Only read the ?refs= query param once, on mount, to seed the parent's
    // filter state. After mount, changes to this URL param are driven by
    // this component's own updateFilter -> setRefQry, so re-running on
    // every baseQry change would create a feedback loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    !isLoading && (
      <Select
        isLoading={isLoading}
        styles={colourStyles}
        options={options}
        isMulti={true}
        onChange={updateFilter}
        defaultValue={defaultValue}
      />
    )
  );
};

export default RefTypeSelect;
