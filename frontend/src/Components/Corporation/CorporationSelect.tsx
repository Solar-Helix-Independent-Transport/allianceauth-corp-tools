import { useQuery } from "@tanstack/react-query";
import Select, { StylesConfig } from "react-select";
import { loadStatus } from "../../api/corporation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";
import { bootstrapSelectStyles } from "../Helpers/reactSelectTheme";

interface CorpOption {
  value: number;
  label: string;
}

const colourStyles = bootstrapSelectStyles as StylesConfig<CorpOption>;

const CorpSelect = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["corp-status"],
    queryFn: () => loadStatus(),
  });
  const [cidStr, setCid] = useQueryState("cid");

  const options: CorpOption[] = useMemo(
    () =>
      isLoading
        ? []
        : (data?.corps.map((corp) => ({
            value: corp.corporation.corporation_id,
            label: corp.corporation.corporation_name,
          })) ?? []),
    [isLoading, data],
  );

  const value = options.find((o) => o.value === Number(cidStr)) ?? null;

  useEffect(() => {
    if (!isLoading && options.length === 1) {
      setCid(String(options[0].value));
    }
  }, [isLoading, options, setCid]);

  return (
    <Select<CorpOption>
      isLoading={isLoading}
      value={value}
      styles={colourStyles}
      options={options}
      onChange={(entry) => entry && setCid(String(entry.value))}
    />
  );
};

export default CorpSelect;
