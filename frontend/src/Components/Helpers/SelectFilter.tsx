import Select, { StylesConfig } from "react-select";
import { bootstrapSelectStyles } from "./reactSelectTheme";

export interface SelectFilterOption<T> {
  value: T;
  label: string;
}

const colourStyles = {
  ...bootstrapSelectStyles,
  container: (base) => ({ ...base, zIndex: 0 }),
} as StylesConfig<SelectFilterOption<unknown>>;

export const SelectFilter = <T,>({
  setFilter,
  options,
  labelText,
}: {
  setFilter: (value: T) => void;
  options: SelectFilterOption<T>[];
  labelText: string;
}) => {
  return (
    <div className="flex-grow-1 flex-even d-flex text-nowrap">
      <div className="my-auto mx-2">
        <h6 className="p-0 m-0">{labelText}</h6>
      </div>
      <Select<SelectFilterOption<T>, false>
        className="m-1 flex-grow-1"
        styles={colourStyles as StylesConfig<SelectFilterOption<T>>}
        options={options}
        onChange={(e) => e && setFilter(e.value)}
        defaultValue={options[0]}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  );
};
