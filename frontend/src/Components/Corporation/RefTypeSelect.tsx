import { useQuery } from "react-query";
import Select from "react-select";
import { loadRefTypes } from "../../api/corporation";

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

const convertToTitleCase = (str: string) => {
  if (!str) {
    return "";
  }
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const RefTypeSelect = ({ setFilter }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["ref_types", 0],
    queryFn: () => loadRefTypes(),
    initialData: [],
    refetchOnWindowFocus: false,
  });
  console.log(data);
  let options = [];
  if (!isLoading) {
    options = data?.map((ref: any) => {
      return {
        value: ref,
        label: convertToTitleCase(ref.replaceAll("_", " ")),
      };
    });
  }
  return (
    <Select
      isLoading={isLoading}
      styles={colourStyles}
      options={options}
      isMulti={true}
      onChange={setFilter}
    />
  );
};

export default RefTypeSelect;
