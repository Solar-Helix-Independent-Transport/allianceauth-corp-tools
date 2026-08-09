import { useQuery } from "@tanstack/react-query";
import Select, { StylesConfig } from "react-select";
import { useTranslation } from "react-i18next";
import { loadStatus } from "../../api/corporation";
import { useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";
import { bootstrapSelectStyles, SelectOption } from "../Helpers/reactSelectTheme";

const colourStyles = bootstrapSelectStyles as StylesConfig<SelectOption>;

// Matches the backend's "corporation_id == 0 means every corp the user can
// see" convention (corptools/api/corporation/activity_map.py).
const ALL_CORPORATIONS_ID = 0;

const CorpSelect = ({ includeAllOption = false }: { includeAllOption?: boolean }) => {
  const { t } = useTranslation();
  const { isLoading, data } = useQuery({
    queryKey: ["corp-status"],
    queryFn: () => loadStatus(),
  });
  const [cidStr, setCid] = useQueryState("cid");

  const corpOptions: SelectOption[] = useMemo(
    () =>
      isLoading
        ? []
        : (data?.corps.map((corp) => ({
            value: corp.corporation.corporation_id,
            label: corp.corporation.corporation_name,
          })) ?? []),
    [isLoading, data],
  );

  const options: SelectOption[] = useMemo(() => {
    if (!includeAllOption || corpOptions.length === 0) {
      return corpOptions;
    }
    return [{ value: ALL_CORPORATIONS_ID, label: t("All Corporations") }, ...corpOptions];
  }, [includeAllOption, corpOptions, t]);

  const value = options.find((o) => o.value === Number(cidStr)) ?? null;

  useEffect(() => {
    if (!isLoading && !includeAllOption && corpOptions.length === 1) {
      setCid(String(corpOptions[0].value));
    }
  }, [isLoading, includeAllOption, corpOptions, setCid]);

  return (
    <Select<SelectOption>
      isLoading={isLoading}
      value={value}
      styles={colourStyles}
      options={options}
      onChange={(entry) => entry && setCid(String(entry.value))}
    />
  );
};

export default CorpSelect;
