import { useQuery } from "react-query";
import Select from "react-select";
import { loadStatus } from "../../api/corporation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

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

const CorpSelect = ({ setCorporation }: { setCorporation: any }) => {
  const { isLoading, data } = useQuery({
    queryKey: ["corp-status"],
    queryFn: () => loadStatus(),
  });
  const [baseQry, setRefQry] = useQueryState("cid");

  const updateFilter = (entry: any) => {
    setCorporation(entry.value);
    setRefQry(entry.value);
  };

  let options = [];
  let defaultValue: any = undefined;
  if (!isLoading) {
    options = data?.corps.map((corp: any) => {
      if (Number(baseQry) === corp.corporation.corporation_id) {
        defaultValue = {
          value: corp.corporation.corporation_id,
          label: corp.corporation.corporation_name,
        };
      }
      return {
        value: corp.corporation.corporation_id,
        label: corp.corporation.corporation_name,
      };
    });
    if (data?.corps.length === 1) {
      setCorporation(options[0].value);
    }
  }

  useEffect(() => {
    defaultValue && setCorporation(defaultValue?.value);
  }, [data]);

  return (
    <Select
      isLoading={isLoading}
      value={defaultValue}
      styles={colourStyles}
      options={options}
      onChange={updateFilter}
    />
  );
};

export default CorpSelect;
