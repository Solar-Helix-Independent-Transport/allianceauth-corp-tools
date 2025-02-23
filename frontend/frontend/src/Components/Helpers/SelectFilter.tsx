import Select from "react-select";

const colourStyles = {
  option: (styles: any) => {
    return {
      ...styles,
      color: "black",
    };
  },
  container: (base: any) => ({ ...base, zIndex: 0 }),
  menu: (base: any) => ({ ...base, zIndex: 9999 }),
  menuList: (base: any) => ({ ...base, zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

export const SelectFilter = ({ setFilter, options, labelText }: any) => {
  return (
    <div className="flex-grow-1 flex-even d-flex text-nowrap">
      <div className="my-auto mx-2">
        <h6>{labelText}</h6>
      </div>
      <Select
        className="m-1 flex-grow-1"
        styles={colourStyles}
        options={options}
        onChange={(e) => setFilter(e.value)}
        defaultValue={options[0]}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  );
};
