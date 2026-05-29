import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { loadStatus } from "../../api/corporation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

const colourStyles = {
  option: (styles: any) => ({ ...styles, color: "black" }),
  menu: (base: any) => ({ ...base, zIndex: 9999 }),
  menuList: (base: any) => ({ ...base, zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const CorpSelect = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["corp-status"],
    queryFn: () => loadStatus(),
  });
  const [cidStr, setCid] = useQueryState("cid");

  const options: { value: number; label: string }[] = isLoading
    ? []
    : (data?.corps.map((corp: any) => ({
        value: corp.corporation.corporation_id,
        label: corp.corporation.corporation_name,
      })) ?? []);

  const value = options.find((o) => o.value === Number(cidStr)) ?? null;

  useEffect(() => {
    if (!isLoading && data?.corps.length === 1) {
      setCid(String(options[0].value));
    }
  }, [data]);

  return (
    <Select
      isLoading={isLoading}
      value={value}
      styles={colourStyles}
      options={options}
      onChange={(entry) => entry && setCid(String(entry.value))}
    />
  );
};

export default CorpSelect;
