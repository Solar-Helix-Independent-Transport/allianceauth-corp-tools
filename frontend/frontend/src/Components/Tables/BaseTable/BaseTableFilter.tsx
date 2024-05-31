import { colourStyles } from "./BaseTableStyles";
import { Column, Table as ReactTable } from "@tanstack/react-table";
import { Form, OverlayTrigger, Popover } from "react-bootstrap";
import Select from "react-select";

const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

export const NumberFilter = ({ column }: { column: Column<any, any> }) => {
  const columnFilterValue = column.getFilterValue();
  const fromToNumber = columnFilterValue as [string, string];

  const popoverNumber = (
    <Popover id="popover-positioned-top">
      <input
        type="number"
        value={fromToNumber?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="form-control"
      />
      <p className="text-center">to</p>
      <input
        type="number"
        value={fromToNumber?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="form-control"
      />
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popoverNumber}>
      <Form.Control
        readOnly={true}
        className="text-center"
        type="text"
        value={`${
          typeof fromToNumber?.[0] === "undefined" || fromToNumber?.[0] === ""
            ? "-∞"
            : fromToNumber?.[0]
        }
        ${" to "}
        ${
          typeof fromToNumber?.[1] === "undefined" || fromToNumber?.[1] === ""
            ? "∞"
            : fromToNumber?.[1]
        }`}
      ></Form.Control>
    </OverlayTrigger>
  );
};

export const BoolFilter = ({ column }: { column: Column<any, any> }) => {
  const options = [
    { value: true, label: "Pass" },
    { value: false, label: "Fail" },
  ];

  return (
    <Select
      styles={colourStyles}
      isClearable={true}
      onChange={(newValue) => {
        column.setFilterValue(newValue ? newValue.value : "");
      }}
      onInputChange={(value, action) => {
        if (action.action === "input-change") {
          column.setFilterValue(value);
        }
      }}
      placeholder={`Search...`}
      className=""
      options={options}
    />
  );
};

export const TextFilter = ({ column }: { column: Column<any, any> }) => {
  return (
    <Form.Control
      type="text"
      onChange={(event) => {
        column.setFilterValue(event.target.value ? event.target.value : "");
      }}
    />
  );
};

export const SelectFilter = ({ column }: { column: Column<any, any> }) => {
  const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort();
  const selectOptions = sortedUniqueValues
    .slice(0, 50)
    .reduce((previousValue: Array<any>, currentValue: any) => {
      previousValue.push({ value: currentValue, label: currentValue });
      return previousValue;
    }, []);

  const isObjectorHTML =
    isHTML(sortedUniqueValues?.[0]) || typeof sortedUniqueValues?.[0] === "object";
  return (
    <Select
      styles={colourStyles}
      isClearable={true}
      onChange={(newValue) => {
        column.setFilterValue(newValue ? newValue.value : "");
      }}
      onInputChange={(value, action) => {
        if (action.action === "input-change") {
          column.setFilterValue(value);
        }
      }}
      placeholder={`Search...`}
      className=""
      options={selectOptions}
      components={isObjectorHTML ? { Menu: () => <></>, IndicatorsContainer: () => <></> } : {}}
    />
  );
};
export const Filter = ({ column, table }: { column: Column<any, any>; table: ReactTable<any> }) => {
  const firstValue: any = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  if (typeof firstValue === "number") {
    return <NumberFilter {...{ column }} />;
  } else if (typeof firstValue === "boolean") {
    return <BoolFilter {...{ column }} />;
  } else if (typeof firstValue === "object") {
    return <SelectFilter {...{ column }} />;
  } else {
    return <SelectFilter {...{ column }} />;
  }
};

export default Filter;
