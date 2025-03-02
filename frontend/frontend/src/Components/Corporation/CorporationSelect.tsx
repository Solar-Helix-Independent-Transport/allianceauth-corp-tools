import { useQuery } from "react-query";
import Select from "react-select";
import { loadStatus } from "../../api/corporation";

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
  let options = [];
  if (!isLoading) {
    options = data?.corps.map((corp: any) => {
      return {
        value: corp.corporation.corporation_id,
        label: corp.corporation.corporation_name,
      };
    });
    if (data?.corps.length === 1) {
      setCorporation(options[0].value);
    }
  }
  return (
    <Select
      isLoading={isLoading}
      styles={colourStyles}
      options={options}
      onChange={(e: any) => setCorporation(e.value)}
    />
  );
};

export default CorpSelect;
